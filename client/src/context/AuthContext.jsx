import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        console.log("AuthContext: Fetching profile...");
        try {
            const res = await api.get('/auth/profile');
            console.log("AuthContext: Profile received:", res.data ? "Success" : "Empty");
            if (res.data) {
                setUser(res.data);
            } else {
                throw new Error('Invalid profile data');
            }
        } catch (err) {
            console.error('AuthContext: Profile fetch failed:', err.message);
            if (err.response) {
                console.error('AuthContext: Server error status:', err.response.status);
            }
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
            console.log("AuthContext: Loading finished.");
        }
    };

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
