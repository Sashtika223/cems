import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar as CalIcon, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [events, setEvents] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchData();
    }, [search, category]);

    const fetchData = async () => {
        try {
            const [eventsRes, recRes] = await Promise.all([
                api.get(`/events?search=${search}&category=${category}`),
                api.get('/events/recommendations')
            ]);
            setEvents(eventsRes.data);
            setRecommendations(recRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-transition">
            <section style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Recommended for You <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>AI Powered</span></h2>
                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                    {recommendations.map(event => (
                        <Link to={`/events/${event.id}`} key={event.id} style={{ minWidth: 300 }}>
                            <div className="glass-card" style={{ padding: '1rem' }}>
                                <img src={event.image_url || 'https://via.placeholder.com/300x150'} alt={event.title} style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                                <h3>{event.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{event.category}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Upcoming Events</h2>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {events.map(event => (
                    <motion.div 
                        whileHover={{ y: -5 }}
                        key={event.id} 
                        className="glass-card" 
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ height: 180, overflow: 'hidden' }}>
                            <img src={event.image_url || 'https://via.placeholder.com/400x200'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <span style={{ fontSize: '0.75rem', background: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '1rem', marginBottom: '1rem', display: 'inline-block' }}>{event.category}</span>
                            <h3 style={{ marginBottom: '1rem' }}>{event.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalIcon size={16} /> {new Date(event.date).toLocaleDateString()} at {event.time}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {event.location}</div>
                            </div>
                            <Link to={`/events/${event.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>View Details</Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
