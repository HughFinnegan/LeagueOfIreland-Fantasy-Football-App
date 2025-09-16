import React from 'react';
import './componentsCSS/About.css';
import './componentsCSS/background.css';
import './componentsCSS/all.css';
import Header from './Header.js';

const About = () => {
    return (
        <div className='mainContainer'>
            <Header />
            <div className="about-container">
                <h1>Made by CSB students in Trinity College, Dublin.</h1>
                <p>This project is developed to showcase the talents and skills of the students in the Computer Science and Business program.</p>
            </div>
        </div>
    );
}

export default About;
