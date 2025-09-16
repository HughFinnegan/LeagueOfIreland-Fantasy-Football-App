import React from 'react';
import './componentsCSS/Home.css';
import './componentsCSS/background.css';
import './componentsCSS/all.css';
import Header from './Header.js';
import players from '../assets/river.jpeg';
import bohemians from '../assets/crests/Bohs.png';
import derry from '../assets/crests/Derry.png';
import drogheda from '../assets/crests/Drogheda.png';
import dundalk from '../assets/crests/Dundalk.png';
import galway from '../assets/crests/Galway.png';
import pats from '../assets/crests/Pats.jpg';
import rovers from '../assets/crests/ShamrockRovers.png';
import shelbourne from '../assets/crests/Shelbourne.png';
import sligo from '../assets/crests/Sligo.png';
import waterford from '../assets/crests/Waterford.png';
import sample from '../assets/SampleGame.png';
import sub from '../assets/subs.png';
import podium from '../assets/score.png';

const Home = () => {
    return (
        <div className="home-container">
            <Header />
            <div className="content">
                <h3 className='text'>Welcome to the League of Ireland Fantasy Football Official Website!</h3>
                <div className = "howTo">
                    <div className='howToStep'>
                        <img src={sample} alt="Sample" style={{ width: "auto", height: "300px" }}/>
                        <h3 className="text">Select a Squad</h3>
                    </div>
                    <div className='howToStep'>
                        <img src={sub} alt="Sub" style={{ width: 'auto', height: '300px' }} />
                        <h3 className="text">Make Changes</h3>
                    </div>
                    <div className='howToStep'>
                        <img src={podium} alt="Podium" style={{ width: 'auto', height: '300px' }} />
                        <h3 className="text">Score Points</h3>
                    </div>
                </div>
                <button onClick={() => { window.location.href = '/register'; }} className = "start">START NOW</button>
                <div className='clubs'>
                    <img src = {players} alt = 'Players' className = 'players'/>
                    <div class = "teams one">
                        <img src={shelbourne} alt = "Shelbourne" className='team'/>
                        <img src = {galway} alt = "Galway" className = "team"/>
                    </div>
                    <div class = "teams two">
                        <img src = {bohemians} alt = "Bohemians" className="team"/>
                        <img src = {derry} alt = "Derry City" className = "team"/>
                        <img src = {drogheda} alt = "Drogheda" className = "smallTeam"/>
                    </div>
                    <div class='teams three'>
                        <img src={pats} alt = "Pats" className='team'/>
                        <img src={rovers} alt='Rovers' className='smallTeam'/>
                        <img src = {dundalk} alt = "Dundalk" className="smallTeam"/>
                    </div>
                    <div class='teams four'>
                        <img src={sligo} alt="Sligo" className='team'/>
                        <img src={waterford} alt="Waterford" className='team'/>
                    </div>
                    <h3 class = "text bottom">Choose from 200+ Players in Ireland's Premier Division</h3>
                </div>
            </div>
        </div>
    );
}

export default Home;
