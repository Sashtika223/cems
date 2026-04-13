import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card form-card-responsive" 
            style={{ maxWidth: 450, margin: '3rem auto', padding: '2.5rem' }}
        >
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="gradient-text">Create Account</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Full Name</label>
                    <input 
                        type="text" 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-dark)', background: 'var(--bg-dark)', color: 'white' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Email Address</label>
                    <input 
                        type="email" 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-dark)', background: 'var(--bg-dark)', color: 'white' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Password</label>
                    <input 
                        type="password" 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-dark)', background: 'var(--bg-dark)', color: 'white' }}
                        required
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Role</label>
                    <select 
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-dark)', background: 'var(--bg-dark)', color: 'white' }}
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
            </p>
        </motion.div>
    );
};

export default Register;
