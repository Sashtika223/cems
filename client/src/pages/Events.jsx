import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, Calendar as CalIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchEvents();
    }, [search, category]);

    const fetchEvents = async () => {
        try {
            const res = await api.get(`/events?search=${search}&category=${category}`);
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-transition" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 className="gradient-text">Explore Events</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search events..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', background: 'var(--card-dark)', border: '1px solid var(--border-dark)', color: 'white' }}
                        />
                    </div>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--card-dark)', border: '1px solid var(--border-dark)', color: 'white' }}
                    >
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading events...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {events.map(event => (
                        <motion.div 
                            whileHover={{ y: -5 }}
                            key={event.id} 
                            className="glass-card" 
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ height: 160, overflow: 'hidden' }}>
                                <img src={event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <span style={{ fontSize: '0.75rem', background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', marginBottom: '0.5rem', display: 'inline-block' }}>{event.category}</span>
                                <h3 style={{ marginBottom: '1rem' }}>{event.title}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                                    <div>📍 {event.location}</div>
                                </div>
                                <Link to={`/events/${event.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: '0.9rem' }}>View Details</Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            
            {events.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    No events found.
                </div>
            )}
        </div>
    );
};

export default Events;
