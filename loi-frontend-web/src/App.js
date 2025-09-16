import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage.js';
import About from './components/About.js';
import Contact from './components/Contact.js';
import PlayerEvaluationIndex from './components/PlayerEvaluationIndex.js';
import Login from './components/login.js';
import Register from './components/register.js';
import ForgotPassword from './components/forgotpassword.js';
import Temp from './components/temp.js';
import Eleven from './components/eleven.js';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import './components/componentsCSS/NavBar.css';
import './components/componentsCSS/menuStyle.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/player-evaluations" element={<PlayerEvaluationIndex />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/temp" element={<Temp />} />
                        <Route path="/eleven" element={<Eleven />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
