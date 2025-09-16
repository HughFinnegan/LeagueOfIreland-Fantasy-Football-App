import React from 'react';
import './componentsCSS/forgotpassword.css';
import './componentsCSS/background.css';
import './componentsCSS/all.css';
import Header from './Header.js';

const ForgotPassword = () => {
    return (
        <div className='mainContainer'>
            <Header />
            <div className='forgot-password-container'>
                <h2>Forgot Password</h2>
                <p>Please enter your email address below. We will send you a link to reset your password.</p>
                <form>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
