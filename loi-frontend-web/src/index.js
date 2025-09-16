// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { AuthProvider } from './context/AuthContext.js';

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById('root')
);
