import React, { useState, useEffect, useContext } from 'react';
import './componentsCSS/temp.css';
import Header from './Header.js';
import PlayerPopup from './PlayerPopup.js';
import pitch from '../assets/pitch.png';
import plus from '../assets/plus.png';
import { clubJerseys } from './clubJerseys.js';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const BUDGET = 2000;

const Temp = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState({});
    const [totalSquadValue, setTotalSquadValue] = useState(0);
    const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
    const [clubPlayerCounts, setClubPlayerCounts] = useState({});
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

    useEffect(() => {
        const counts = {};
        Object.values(selectedPlayers).forEach(player => {
            const club = player.club;
            counts[club] = counts[club] ? counts[club] + 1 : 1;
        });
        setClubPlayerCounts(counts);

        const playerCount = Object.keys(selectedPlayers).length;
        setIsSubmitEnabled(playerCount === 15 && totalSquadValue <= BUDGET);

        // Add class to body element when the component mounts
        document.body.classList.add('no-horizontal-scroll');

        // Fetch the user's team data from the server
        const fetchTeamData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/team/${user._id}`);
                setSelectedPlayers(response.data);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };

        if (user) {
            fetchTeamData();
        }

        // Remove class from body element when the component unmounts
        return () => {
            document.body.classList.remove('no-horizontal-scroll');
        };
    }, [selectedPlayers, user]);

    const openModal = (position) => {
        setSelectedPosition(position.name);
        setIsModalOpen(true);
    };

    const closeModal = (selectedPlayer = null) => {
        if (selectedPlayer) {
            const playerName = selectedPlayer.name;

            if (selectedPlayerNames.includes(playerName)) {
                alert(playerName + " has already been selected.");
                return;
            }

            const club = selectedPlayer.club;
            const clubCount = clubPlayerCounts[club] || 0;
            if (clubCount >= 4) {
                alert("You have already selected 4 players from " + club + ".");
                return;
            }

            const normalizedClubName = normalizeClubName(selectedPlayer.club);
            console.log(`Selected Player Club: ${normalizedClubName}`); 
            console.log(`Jersey Path: ${clubJerseys[normalizedClubName]}`); 

            let value = 0;
            const currentValue = selectedPlayer.value.match(/\d+\.?\d*|\.\d+/g);
            if(currentValue) {
                value = currentValue.reduce((acc, val) => acc + parseFloat(val.replace(/€/, '').replace(/k/g, '000')), 0);
            }
            
            setSelectedPlayers(prevState => ({
                ...prevState,
                [selectedPosition]: {
                    ...selectedPlayer,
                    clubShirt: clubJerseys[normalizedClubName]
                }
            }));

            setTotalSquadValue(prevTotalSquadValue => prevTotalSquadValue + value);
            setSelectedPlayerNames([...selectedPlayerNames, selectedPlayer.name]);
        }
        setSelectedPosition(null);
        setIsModalOpen(false);
    };

    const removePlayer = (position) => {
        setSelectedPlayers(prevState => {
            const removedPlayer = prevState[position];
            const newValue = totalSquadValue - getPlayerValue(removedPlayer); 
            setTotalSquadValue(newValue);

            const newState = { ...prevState };
            delete newState[position];
            return newState;
        });
        setSelectedPlayerNames(prevIds => prevIds.filter(id => id !== selectedPlayers[position].name));
    };

    const getPlayerValue = (player) => {
        if (!player) return 0;
        const currentValue = player.value.match(/\d+\.?\d*|\.\d+/g);
        if (!currentValue) return 0;
        return currentValue.reduce((acc, val) => acc + parseFloat(val.replace(/€/, '').replace(/k/g, '000')), 0);
    };

    const positions = [
        { name: 'Goalkeeper 1', className: 'Goalkeeper', left: '-6%' },
        { name: 'Goalkeeper 2', className: 'Goalkeeper', left: '6%' },
        { name: 'Defender 1', className: 'Defender', left: '-20%' },
        { name: 'Defender 2', className: 'Defender', left: '-10%' },
        { name: 'Defender 3', className: 'Defender', left: '0%' },
        { name: 'Defender 4', className: 'Defender', left: '10%' },
        { name: 'Defender 5', className: 'Defender', left: '20%' },
        { name: 'Midfielder 1', className: 'Midfielder', left: '-22%' },
        { name: 'Midfielder 2', className: 'Midfielder', left: '-11%' },
        { name: 'Midfielder 3', className: 'Midfielder', left: '0%' },
        { name: 'Midfielder 4', className: 'Midfielder', left: '11%' },
        { name: 'Midfielder 5', className: 'Midfielder', left: '22%' },
        { name: 'Forward 1', className: 'Forward', left: '-12%' },
        { name: 'Forward 2', className: 'Forward', left: '0%' },
        { name: 'Forward 3', className: 'Forward', left: '12%' }
    ];

    const handleResetButtonClick = () => {
        setSelectedPlayers({});
        setSelectedPlayerNames([]);
        setTotalSquadValue(0);
    };

    const handleSubmitSquadClick = async () => {
        try {
            console.log("Submitting squad:", selectedPlayers);
            const response = await axios.post('http://127.0.0.1:5000/upload-players', {
                players: selectedPlayers
            });
            console.log('Squad submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting squad:', error);
        }
    }

    const getPositionAbbreviation = (position) => {
        switch (position) {
            case 'Goalkeeper':
                return 'GK';
            case 'Defender':
                return 'DEF';
            case 'Midfielder':
                return 'MID';
            case 'Forward':
                return 'FOR';
            default:
                return '';
        }
    };

    return (
        <div className="temp.maincontainer">
            <Header />
            <h1 className="select">Select your Squad</h1>
            <div className="positions">
                <img src={pitch} alt="Pitch" className="pitch" />
                {positions.map((position, index) => (
                    <div key={index} className={`position-container ${position.className}`} style={{ left: position.left }}>
                        {selectedPlayers[position.name] ? (
                            <>
                                <img src={selectedPlayers[position.name].clubShirt} alt="Club Shirt" className="club-shirt" />
                                <div className='playerBox'>
                                    <div className='player-pos'>{getPositionAbbreviation(position.className)}</div>
                                    <div className="playerName">{selectedPlayers[position.name].name}</div>
                                    <div className="value">{selectedPlayers[position.name].value}</div>
                                    <button className="remove-button" onClick={() => removePlayer(position.name)}>X</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <img src={plus} alt="Plus" className="plus" onClick={() => openModal(position)} />
                                <div className="positionName playerName">Add {position.className}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {selectedPosition && <PlayerPopup onClose={closeModal} position={selectedPosition} />}
            <div className='rules'>
                <h1>Rules:</h1>
                <h3>Select a maximum of 4 players from a single team</h3>
                <h3>Do not exceed the budget of €2 Million</h3>
            </div>
            <div className='squadvalue'>
                <h1>Current Value:</h1>
                <h1>€{(totalSquadValue * 1000).toLocaleString()}</h1>
                {totalSquadValue <= BUDGET && <h2 style={{ color: 'green' }}>Under budget</h2>}
                {totalSquadValue > BUDGET && <h2 style={{ color: 'red' }}>Over budget</h2>}
                <div className={`budget-bar-container ${totalSquadValue >= BUDGET ? 'over-budget' : ''}`}>
                    <div className="budget-bar" style={{ width: `${Math.min((totalSquadValue / BUDGET) * 100, 100)}%` }}></div>
                </div>
                <button className="reset-button" onClick={handleResetButtonClick}>Reset</button>
            </div>
            <button
                className={`submit-squad ${!isSubmitEnabled ? 'disabled' : ''}`}
                onClick={handleSubmitSquadClick}
                disabled={!isSubmitEnabled}
            >
                Submit Squad
            </button>
            <div className="upcoming">
                <h1>Upcoming Fixtures: </h1>
            </div>
        </div>
    );
};

export default Temp;

const normalizeClubName = (name) => {
    if (typeof name !== 'string') {
        console.error("normalizeClubName: Expected a string but got", typeof name);
        return ""; 
    }
    return name.toLowerCase().replace(/[\s.-]/g, '_');
};

