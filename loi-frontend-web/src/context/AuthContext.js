import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                await fetchUser(); // Fetch user after login
            }
        } catch (err) {
            console.error('Error logging in:', err);
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name: username, email, password });
            return res;
        } catch (err) {
            console.error('Error registering:', err);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
