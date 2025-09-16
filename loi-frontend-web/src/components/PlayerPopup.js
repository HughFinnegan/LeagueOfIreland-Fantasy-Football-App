import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './componentsCSS/PlayerPopup.css';

const loadSelectedPlayersFromLocalStorage = () => {
    const storedPlayers = localStorage.getItem('players');
    return storedPlayers ? JSON.parse(storedPlayers) : {};
};

const PlayerPopup = ({ onClose, position }) => {
    const [players, setPlayers] = useState(loadSelectedPlayersFromLocalStorage);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [sortCriteria, setSortCriteria] = useState('value');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/scrape-players');
                setPlayers(response.data);
                localStorage.setItem('players', JSON.stringify(players));
            } catch (error) {
                console.error('Error fetching player data:', error);
            }
        };

        fetchPlayers();
    }, []);

    const positionText = position.slice(0, -1); // Remove the last character from the position prop

    const filteredPlayers = players.filter(player =>
        player.position.toLowerCase() === positionText.toLowerCase() &&
        player.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (!selectedClub || player.club.toLowerCase().includes(selectedClub.toLowerCase()))
    );

    const clubs = [...new Set(players.map(player => player.club))];

    const sortPlayers = (criteria) => {
        const order = sortCriteria === criteria && sortOrder === 'desc' ? 'asc' : 'desc';
        setSortCriteria(criteria);
        setSortOrder(order);
    };

    const sortedPlayers = filteredPlayers.sort((a, b) => {
        const aValue = a[sortCriteria];
        const bValue = b[sortCriteria];

        if (sortCriteria === 'value') {
            const aValueNum = parseFloat(aValue.replace('€', '').replace('k', '').replace('N/A', '0'));
            const bValueNum = parseFloat(bValue.replace('€', '').replace('k', '').replace('N/A', '0'));
            return sortOrder === 'asc' ? aValueNum - bValueNum : bValueNum - aValueNum;
        } else {
            return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    });

    const handlePlayerSelection = (player) => {
        setSelectedPlayer(player);
    };

    const handleCancelButtonClick = () => {
        onClose(null);
    };

    const handleSelectButtonClick = () => {
        onClose(selectedPlayer);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2 className="choose">Choose a {positionText}</h2>
                <div className="filters">
                    <p>Search by Name:</p>
                    <input
                        type="text"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                    <p>Filter by Club:</p>
                    <select className = "select-club" value={selectedClub} onChange={e => setSelectedClub(e.target.value)}>
                        <option value="">All Clubs</option>
                        {clubs.map((club, index) => (
                            <option key={index} value={club}>{club}</option>
                        ))}
                    </select>
                </div>
                <div className="player-table-container">
                    <table className="player-table">
                        <thead>
                            <tr>
                                <th style={{ width: '250px' }}>Name</th>
                                <th style={{ width: '150px' }}>Position</th>
                                <th style={{ width: '150px' }}>Nationality</th>
                                <th style={{ width: '100px' }}>Age</th>
                                <th style={{ width: '200px' }}>Club</th>
                                <th onClick={() => sortPlayers('value')}>Value {sortCriteria === 'value' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlayers.map((player, index) => (
                                <tr key={index} onClick={() => handlePlayerSelection(player)} className={selectedPlayer === player ? "selected-row" : ""}>
                                    <td>{player.name}</td>
                                    <td>{player.position}</td>
                                    <td>{player.nationality}</td>
                                    <td>{player.age}</td>
                                    <td>{player.club}</td>
                                    <td>{player.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="cancel-button" onClick={handleCancelButtonClick}>Cancel</button>
                <button className="select-button" onClick={handleSelectButtonClick}>Select</button>
            </div>
        </div>
    );
};

export default PlayerPopup;
