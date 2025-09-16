import React, { useState, useEffect, useContext } from 'react';
import './componentsCSS/temp.css';
import './componentsCSS/eleven.css';
import Header from './Header.js';
import PlayerPopup from './PlayerPopup.js';
import pitch from '../assets/pitch.png';
import replace from '../assets/replace.png'
import { clubJerseys } from './clubJerseys.js';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const GAMEWEEK = 20;
const BUDGET = 2000;

const allowedFormations = [
    { name: '3-4-3', positions: [1, 3, 4, 3] },
    { name: '3-5-2', positions: [1, 3, 5, 2] },
    { name: '4-3-3', positions: [1, 4, 3, 3] },
    { name: '4-4-2', positions: [1, 4, 4, 2] },
    { name: '4-5-1', positions: [1, 4, 5, 1] },
    { name: '5-3-2', positions: [1, 5, 3, 2] },
    { name: '5-4-1', positions: [1, 5, 4, 1] }
];

const loadSelectedPlayersFromLocalStorage = () => {
    const storedPlayers = localStorage.getItem('selectedPlayers');
    return storedPlayers ? JSON.parse(storedPlayers) : {};
};

const loadTotalSquadValue = () => {
    const storedValue = localStorage.getItem('totalSquadValue');
    return storedValue ? storedValue : 0;
}

const Temp = () => {
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedPlayers, setSelectedPlayers] = useState(loadSelectedPlayersFromLocalStorage);
    const [totalSquadValue, setTotalSquadValue] = useState(localStorage.getItem(loadTotalSquadValue));
    const [selectedPlayerNames, setSelectedPlayerNames] = useState([]);
    const [clubPlayerCounts, setClubPlayerCounts] = useState({});
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [selectedFormation, setSelectedFormation] = useState(allowedFormations[2].name);
    const [substitutes, setSubstitutes] = useState({})

    useEffect(() => {
        const counts = {};
        Object.values(selectedPlayers).forEach(player => {
            const club = player.club;
            counts[club] = counts[club] ? counts[club] + 1 : 1;
        });
        setClubPlayerCounts(counts);

        const playerCount = Object.keys(selectedPlayers).length;
        setIsSubmitEnabled(totalSquadValue <= BUDGET);

        document.body.classList.add('no-horizontal-scroll');

        return () => {
            document.body.classList.remove('no-horizontal-scroll');
        };

    }, [selectedPlayers]);

    const fetchTeamData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/download-players');
            setSelectedPlayers(response.data);
            localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));
            setTotalSquadValue(0)

            for (let player in selectedPlayers) {
                let value = 0;
                const currentValue = selectedPlayers[player].value.match(/\d+\.?\d*|\.\d+/g);
                if (currentValue) {
                    value = currentValue.reduce((acc, val) => acc + parseFloat(val.replace(/€/, '').replace(/k/g, '000')), 0);
                }
                setTotalSquadValue(prevTotalSquadValue => prevTotalSquadValue + value);
                localStorage.setItem('totalSquadValue', totalSquadValue)
            }
            
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    };

    fetchTeamData();

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
            if (currentValue) {
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

    const getPlayerValue = (player) => {
        if (!player) return 0;
        const currentValue = player.value.match(/\d+\.?\d*|\.\d+/g);
        if (!currentValue) return 0;
        return currentValue.reduce((acc, val) => acc + parseFloat(val.replace(/€/, '').replace(/k/g, '000')), 0);
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
    };

    const handleFormationChange = (formation) => {
        setSelectedFormation(formation.name);
        fetchTeamData();
        console.log(selectedPlayers);
    };

    const generatePositions = () => {
        const formation = allowedFormations.find(f => f.name === selectedFormation).positions;
        const positions = [
            { name: 'Goalkeeper 1', className: 'Goalkeeper'},
        ];
        const rowOffsets = {
            1: '10%',  // Goalkeeper
            2: '20%',  // Defenders
            3: '30%',  // Midfielders
            4: '40%'   // Forwards
        };
        const columnOffsets = {
            1: [0],
            2: [-10, 10],
            3: [-15, 0, 15],
            4: [-18, -6, 6, 18],
            5: [-22, -11, 0, 11, 22]
        };
    
        formation.forEach((count, i) => {
            const rowOffset = rowOffsets[i + 1];
            const cols = columnOffsets[count];
            cols.forEach((colOffset, j) => {
                positions.push({
                    name: `${['Goalkeeper', 'Defender', 'Midfielder', 'Forward'][i]} ${j + 1}`,
                    className: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'][i],
                    left: `${colOffset}%`,
                    top: rowOffset,
                });
            });
        });

        const substitutes = [];

        positions.push({name: 'Goalkeeper 2', className: 'substitute', left: '-18%'});
        substitutes.push({name: 'Goalkeeper 2', className: 'substitute', left: '-18%'});

        if (formation[1] == 3) {
            positions.push({name: 'Defender 5', className: 'substitute', left: '-6%'});
            substitutes.push({name: 'Defender 5', className: 'substitute', left: '-6%'});
            positions.push({name: 'Defender 4', className: 'substitute', left: '6%'});
            substitutes.push({name: 'Defender 4', className: 'substitute', left: '6%'});
            if (formation[2] == 4) {
                positions.push({name: 'Midfielder 5', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Midfielder 5', className: 'substitute', left: '18%'});
            }
            else {
                positions.push({name: 'Forward 3', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '18%'});
            }
        }
        else if (formation[1] == 4) {
            positions.push({name: 'Defender 5', className: 'substitute', left: '-6%'});
            substitutes.push({name: 'Defender 5', className: 'substitute', left: '-6%'});
            if (formation[2] == 3) {
                positions.push({name: 'Midfielder 5', className: 'substitute', left: '6%'});
                substitutes.push({name: 'Midfielder 5', className: 'substitute', left: '6%'});
                positions.push({name: 'Midfielder 4', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Midfielder 4', className: 'substitute', left: '18%'});
            }
            else if (formation[2] == 4) {
                positions.push({name: 'Midfielder 5', className: 'substitute', left: '6%'});
                substitutes.push({name: 'Midfielder 5', className: 'substitute', left: '6%'});
                positions.push({name: 'Forward 3', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '18%'});
            }
            else {
                positions.push({name: 'Forward 3', className: 'substitute', left: '6%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '6%'});
                positions.push({name: 'Forward 3', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '18%'});
            }
        }
        else {
            positions.push({name: 'Midfielder 5', className: 'substitute', left: '-6%'});
            substitutes.push({name: 'Midfielder 5', className: 'substitute', left: '-6%'});
            if (formation[2] == 3) {
                positions.push({name: 'Midfielder 4', className: 'substitute', left: '6%'});
                substitutes.push({name: 'Midfielder 4', className: 'substitute', left: '6%'});
                positions.push({name: 'Forward 3', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '18%'});
            }
            if (formation[2] == 4) {
                positions.push({name: 'Forward 3', className: 'substitute', left: '6%'});
                substitutes.push({name: 'Forward 3', className: 'substitute', left: '6%'});
                positions.push({name: 'Forward 2', className: 'substitute', left: '18%'});
                substitutes.push({name: 'Forward 2', className: 'substitute', left: '18%'});
            }
        }

        console.log(substitutes)
    
        return positions;
    };

    const getPositionAbbreviation = (position) => {
        const trimmedPosition = position.slice(0, -2);
        switch (trimmedPosition) {
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

    const makeSubstitution = (position) => {
        
    }
    
    
    return (
        <div className="temp-maincontainer">
            <Header />
            <h1 className="select11">Select your Team for Gameweek {GAMEWEEK}</h1>
            <div className="positions">
                <img src={pitch} alt="Pitch" className="pitch" />
                {generatePositions().map((position, index) => (
                    <div key={index} className={`position-container ${position.className}`} style={{ left: position.left }}>
                        {selectedPlayers[position.name] && (
                            <>
                                <img src={selectedPlayers[position.name]?.clubShirt} alt="Club Shirt" className="club-shirt" />
                                <div className='playerBox'>
                                    <div className='player-pos'>{getPositionAbbreviation(position.name)}</div>
                                    <div className="playerName">{selectedPlayers[position.name]?.name}</div>
                                    <div className="value">{selectedPlayers[position.name]?.value}</div>
                                    <img src={replace} className="replace-button" onClick={() => makeSubstitution(position.name)}/>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {selectedPosition && <PlayerPopup onClose={closeModal} position={selectedPosition} />}
            <div className='rules'>
                <h1>Choose Formation:</h1>
                {allowedFormations.map((formation, index) => (
                    <button
                        key={index}
                        onClick={() => handleFormationChange(formation)}
                        className={`formation-button ${selectedFormation === formation.name ? 'selected' : ''}`}
                    >
                        {formation.name}
                    </button>
                ))}
            </div>
            <div className='squadvalue'>
                <h1>Current Value:</h1>
                <h1>€{(totalSquadValue * 1000).toLocaleString()}</h1>
                {totalSquadValue <= BUDGET && <h2 style={{ color: 'green' }}>Under budget</h2>}
                {totalSquadValue > BUDGET && <h2 style={{ color: 'red' }}>Over budget</h2>}
                <div className={`budget-bar-container ${totalSquadValue >= BUDGET ? 'over-budget' : ''}`}>
                    <div className="budget-bar" style={{ width: `${Math.min((totalSquadValue / BUDGET) * 100, 100)}%` }}></div>
                </div>
            </div>
            <button
                className={`submit-team ${!isSubmitEnabled ? 'disabled' : ''}`}
                onClick={handleSubmitSquadClick}
                disabled={!isSubmitEnabled}
            >
                Submit Team
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

