import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './componentsCSS/PlayerEvaluationIndex.css';
import './componentsCSS/background.css';
import './componentsCSS/all.css';
import Header from './Header.js';

const loadSelectedPlayersFromLocalStorage = () => {
    const storedPlayers = localStorage.getItem('players');
    return storedPlayers ? JSON.parse(storedPlayers) : {};
};

function PlayerEvaluationIndex() {
    const [players, setPlayers] = useState(loadSelectedPlayersFromLocalStorage);
    const [searchName, setSearchName] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [selectedPos, setSelectedPos] = useState(''); 
    const [sortCriteria, setSortCriteria] = useState('points'); 
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersResponse = await axios.get('http://127.0.0.1:5000/scrape-players');
                setPlayers(playersResponse.data);
                localStorage.setItem('players', JSON.stringify(players));
            } catch (error) {
                console.error('Error fetching player data:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchPlayers()
    }, []);

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (!selectedClub || player.club.toLowerCase().includes(selectedClub.toLowerCase())) &&
        (!selectedPos || player.position.toLowerCase().includes(selectedPos.toLowerCase())) 
    );

    const clubs = [...new Set(players.map(player => player.club))];
    const positions = [...new Set(players.map(player => player.position))];

    const handleSort = (criteria) => {
        const order = sortCriteria === criteria && sortOrder === 'desc' ? 'asc' : 'desc';
        setSortCriteria(criteria);
        setSortOrder(order);
    };

    const sortedPlayers = filteredPlayers.sort((a, b) => {
        let aValue = a[sortCriteria];
        let bValue = b[sortCriteria];

        if (sortCriteria === 'value') {
            aValue = parseFloat(aValue.replace('€', '').replace('k', '').replace('N/A', '0'));
            bValue = parseFloat(bValue.replace('€', '').replace('k', '').replace('N/A', '0'));
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    return (
        <div className="mainContainer">
            <Header />
            <div className="player-evaluation-container">
                <h1>Player Statistics</h1>
                <div className="filters">
                    <p>Search by Name: </p>
                    <input
                        className="search filter"
                        type="text"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                    <p>Filter by Club: </p>
                    <select className="filter" value={selectedClub} onChange={e => setSelectedClub(e.target.value)}>
                        <option className="filter" value="">All Clubs</option>
                        {clubs.map((club, index) => (
                            <option key={index} value={club}>{club}</option>
                        ))}
                    </select>
                    <p>Filter by Position: </p>
                    <select className="filter" value={selectedPos} onChange={e => setSelectedPos(e.target.value)}>
                        <option value="">All Positions</option>
                        {positions.map((position, index) => (
                            <option key={index} value={position}>{position}</option>
                        ))}
                    </select>
                </div>
                <table className="player-table">
                    <thead>
                        <tr>
                            <th style={{ width: '150px' }}>Name</th>
                            <th style={{ width: '100px' }}>Position</th>
                            <th style={{ width: '150px' }}>Club</th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('value')}>
                                Value {sortCriteria === 'value' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('games')}>
                                Games {sortCriteria === 'games' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('goals')}>
                                Goals {sortCriteria === 'goals' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('assists')}>
                                Assists {sortCriteria === 'assists' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('yellows')}>
                                Yellows {sortCriteria === 'yellows' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('reds')}>
                                Reds {sortCriteria === 'reds' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                            <th style={{ width: '50px' }} onClick={() => handleSort('points')}>
                                Points {sortCriteria === 'points' ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map((player, index) => (
                            <tr key={index}>
                                <td>{player.name}</td>
                                <td>{player.position}</td>
                                <td>{player.club}</td>
                                <td>{player.value}</td>
                                <td>{player.games}</td>
                                <td>{player.goals}</td>
                                <td>{player.assists}</td>
                                <td>{player.yellows}</td>
                                <td>{player.reds}</td>
                                <td>{player.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h2>End of Results</h2>
            </div>
        </div>
    );
}

export default PlayerEvaluationIndex;
