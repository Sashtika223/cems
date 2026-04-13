import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, LayoutGrid as Table } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hero-title"
                    style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}
                >
                    Manage Campus Events <br />
                    <span className="gradient-text">Intelligently.</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="hero-subtitle"
                    style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 700, margin: '0 auto 3rem' }}
                >
                    Connect, discover, and participate in campus activities with AI-powered recommendations and real-time updates.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="hero-buttons"
                    style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}
                >
                    <Link to="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', whiteSpace: 'nowrap' }}>Get Started</Link>
                    <Link to="/events" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', whiteSpace: 'nowrap' }}>View Events</Link>
                    <Link to="/login" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', whiteSpace: 'nowrap' }}>Login</Link>
                </motion.div>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', padding: '0 1rem' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <Sparkles color="var(--primary)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3>AI Recommendations</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Get personalized event suggestions based on your interests and past activity.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <Zap color="var(--secondary)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3>Real-time Alerts</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Never miss an update with instant notifications and live participant counts.</p>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <Shield color="var(--success)" size={32} style={{ marginBottom: '1rem' }} />
                    <h3>Secure Access</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Secure JWT-based authentication and role-based access for students and admins.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
