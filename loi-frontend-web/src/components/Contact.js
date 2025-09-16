import React from 'react';
import './componentsCSS/Contact.css';
import './componentsCSS/background.css';
import './componentsCSS/all.css';
import Header from './Header.js';

const Contact = () => {
    return (
        <div className='mainContainer'>
            <Header />
            <div className="contact-container">
                <h1>Need help? Contact us at LOIFantasyFootball@email.ie</h1>
                <p>If you have any questions or need further assistance, feel free to reach out to us at the email address above. We are here to help you!</p>
            </div>
        </div>
    );
}

export default Contact;
