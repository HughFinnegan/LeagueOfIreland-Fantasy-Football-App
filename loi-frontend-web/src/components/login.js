import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import './componentsCSS/login.css';
import './componentsCSS/background.css';
import Header from './Header.js';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Sending request to backend with data:", { email, password });
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            console.log("Response:", res.data); // Log the response
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                await login(email, password);
                navigate('/temp'); // Navigate to temp page after successful login
            }
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message); // Log the error
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <div className='maincontainer'>
            <Header />
            <div className='login-container'>
                <h1>Login</h1>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email} 
                            onChange={onChange} 
                            placeholder="Enter your email" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={onChange} 
                            placeholder="Enter your password" 
                            required 
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <p className="forgot-password-link"><a href="/forgot-password">Forgot Password?</a></p>
                <p className="register-link">Don't have an account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
};

export default Login;
