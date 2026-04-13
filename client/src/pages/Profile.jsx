import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Shield, Award, Calendar as CalIcon } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [myEvents, setMyEvents] = useState([]);

    useEffect(() => {
        fetchProfile();
        fetchMyEvents();
    }, []);

    const fetchProfile = async () => {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
    };

    const fetchMyEvents = async () => {
        const res = await api.get('/registrations/my-events');
        setMyEvents(res.data);
    };

    if (!profile) return null;

    return (
        <div className="page-transition page-responsive" style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
            <div className="glass-card profile-header-responsive" style={{ padding: '3rem', display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ width: 100, height: 100, minWidth: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800 }}>
                    {profile.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>{profile.name}</h1>
                    <div className="profile-info-responsive" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> {profile.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={18} /> {profile.role}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}><Award size={18} /> {profile.points} Points</span>
                    </div>
                </div>
            </div>

            <div className="profile-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                <div>
                    <h3>Interests</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {(profile.interests || ['Technology', 'Coding', 'Music']).map(interest => (
                            <span key={interest} style={{ padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', border: '1px solid var(--border-dark)', fontSize: '0.85rem' }}>
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <h3>Registered Events</h3>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {myEvents.map(event => (
                            <div key={event.id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <CalIcon size={20} color="var(--primary)" />
                                    <div>
                                        <h4 style={{ margin: 0 }}>{event.title}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{event.status}</span>
                            </div>
                        ))}
                        {myEvents.length === 0 && <p style={{ color: 'var(--text-muted)' }}>You haven't registered for any events yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
