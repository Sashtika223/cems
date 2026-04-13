import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, CheckCircle, Info, Calendar } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
            // Default mock data if API fails or is empty
            setNotifications([
                { id: 1, message: 'Welcome to CEMS! Explore and register for events.', created_at: new Date(), type: 'info' },
                { id: 2, message: 'Successfully registered for HackerRank Challenge 2026.', created_at: new Date(Date.now() - 86400000), type: 'success' },
                { id: 3, message: 'Spring Cultural Fest starts in 2 days!', created_at: new Date(Date.now() - 172800000), type: 'warning' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {}
    };

    return (
        <div className="page-transition" style={{ maxWidth: 800, margin: '2rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="gradient-text">Notifications</h1>
                <button style={{ color: 'var(--primary)', background: 'transparent', fontSize: '0.9rem' }}>Mark all as read</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className="glass-card" 
                        style={{ 
                            padding: '1.5rem', 
                            display: 'flex', 
                            gap: '1.5rem', 
                            alignItems: 'flex-start',
                            opacity: n.is_read ? 0.6 : 1,
                            borderColor: n.is_read ? 'var(--border-dark)' : 'var(--primary)'
                        }}
                    >
                        <div style={{ 
                            background: n.type === 'success' ? 'var(--success)' : (n.type === 'warning' ? 'var(--warning)' : 'var(--primary)'),
                            padding: '0.75rem',
                            borderRadius: '0.75rem',
                            color: 'white'
                        }}>
                            {n.type === 'success' ? <CheckCircle size={20} /> : (n.type === 'warning' ? <Calendar size={20} /> : <Bell size={20} />)}
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{n.message}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                        {!n.is_read && (
                            <button onClick={() => markAsRead(n.id)} style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'transparent' }}>Mark read</button>
                        )}
                    </div>
                ))}
                {notifications.length === 0 && <p style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No notifications yet.</p>}
            </div>
        </div>
    );
};

export default Notifications;
