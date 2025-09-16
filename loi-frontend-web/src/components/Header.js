import React, { useContext } from 'react';
import './componentsCSS/all.css';
import loilogo from '../assets/crests/loilogo.png';
import { AuthContext } from '../context/AuthContext'; // Ensure this import path is correct

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="banner">
            <img onClick={() => { window.location.href = '../'; }} src={loilogo} alt="LoI Logo" className="logo-top-left" />
            <h1 onClick={() => { window.location.href = '../'; }} className='title'>League of Ireland Fantasy</h1>
            <div className="links">
                <button onClick={() => { window.location.href = '../'; }} className="menuButton">Home</button>
                {!user && <button onClick={() => { window.location.href = 'login'; }} className="menuButton">Sign In</button>}
                <button onClick={() => { window.location.href = 'about'; }} className="menuButton">About</button>
                <button onClick={() => { window.location.href = 'contact'; }} className="menuButton">Contact</button>
                <button onClick={() => { window.location.href = 'player-evaluations'; }} className="menuButton">Stats</button>
                {/*user && */<button onClick={() => { window.location.href = 'temp'; }} className="menuButton">Squad</button>}
                {/*user && */<button onClick={() => { window.location.href = 'eleven'; }} className="menuButton">Edit 11</button>}
                {user && <button onClick={logout} className="menuButton">Log Out</button>}
            </div>
        </div>
    );
};

export default Header;
