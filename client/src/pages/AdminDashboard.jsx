import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, PieChart, Users, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', category: 'Technology', image_url: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await api.get('/events');
        setEvents(res.data);
    };

    const handleAIRecommend = async () => {
        if (!formData.title) return toast.error('Enter a title first');
        try {
            const res = await api.post('/events/ai-description', { title: formData.title, category: formData.category });
            setFormData({ ...formData, description: res.data.description });
            toast.success('AI description generated!');
        } catch (err) {
            toast.error('AI generation failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, formData);
                toast.success('Event updated');
            } else {
                await api.post('/events', formData);
                toast.success('Event created');
            }
            setShowModal(false);
            setEditingEvent(null);
            setFormData({ title: '', description: '', date: '', time: '', location: '', category: 'Technology', image_url: '' });
            fetchEvents();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || 'Failed to save event';
            toast.error(msg);
        }
    };

    const deleteEvent = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/events/${id}`);
            toast.success('Event deleted');
            fetchEvents();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="page-transition">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="gradient-text">Admin Control Center</h1>
                <button onClick={() => setShowModal(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> Create Event
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <Calendar color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Total Events</p>
                    <h2>{events.length}</h2>
                </div>
                {/* Add more stats here */}
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} style={{ borderBottom: '1px solid var(--border-dark)' }}>
                                <td style={{ padding: '1rem' }}>{event.title}</td>
                                <td style={{ padding: '1rem' }}>{event.category}</td>
                                <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                    <button onClick={() => { setEditingEvent(event); setFormData(event); setShowModal(true); }} style={{ color: 'var(--primary)', background: 'transparent' }}><Edit size={18} /></button>
                                    <button onClick={() => deleteEvent(event.id)} style={{ color: 'var(--error)', background: 'transparent' }}><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card" 
                            style={{ width: '90%', maxWidth: 600, padding: '2rem' }}
                        >
                            <h2>{editingEvent ? 'Edit Event' : 'New Event'}</h2>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label>Title</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white' }} required />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        Description 
                                        <span onClick={handleAIRecommend} style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer' }}>Generate AI description ✨</span>
                                    </label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white', minHeight: 100 }} required />
                                </div>
                                <div>
                                    <label>Date</label>
                                    <input type="date" value={formData.date ? formData.date.split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white' }} required />
                                </div>
                                <div>
                                    <label>Time</label>
                                    <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white' }} required />
                                </div>
                                <div>
                                    <label>Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white' }}>
                                        <option value="Technology">Technology</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Social">Social</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Cultural">Cultural</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Location</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Auditorium" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', color: 'white' }} required />
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => { setShowModal(false); setEditingEvent(null); }} style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: '0.75rem', fontWeight: 600, border: '1px solid var(--border-dark)' }}>Cancel</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1rem' }}>{editingEvent ? 'Update Event' : 'Create Event'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
