import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, CheckCircle, Bookmark, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchEvent();
        if (user) checkRegistration();
    }, [id, user]);

    const fetchEvent = async () => {
        try {
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
        } catch (err) {
            toast.error('Event not found');
            navigate('/');
        }
    };

    const checkRegistration = async () => {
        try {
            const res = await api.get('/registrations/my-events');
            const found = res.data.find(r => r.id === id); // check if the event.id matches some logic
            // In the registration response, we return the event joined with registration.
            // Let's assume we find it by event_id.
            const registeredEvent = res.data.find(r => r.id === id);
            if (registeredEvent) {
                setIsRegistered(true);
                setQrCode(registeredEvent.qr_code);
            }
        } catch (err) {}
    };

    const handleRegister = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await api.post(`/registrations/${id}`);
            setIsRegistered(true);
            setQrCode(res.data.registration.qr_code);
            toast.success('Successfully registered!');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    if (!event) return null;

    return (
        <div style={{ maxWidth: 1000, margin: '2rem auto' }} className="page-transition">
            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <img src={event.image_url || 'https://via.placeholder.com/1000x400'} style={{ width: '100%', height: 400, objectFit: 'cover' }} alt="" />
                <div style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                                <Tag size={16} /> {event.category}
                            </span>
                            <h1 style={{ fontSize: '3rem' }}>{event.title}</h1>
                        </div>
                        <button className="glass-card" style={{ padding: '0.75rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
                            <Bookmark size={24} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '3rem', margin: '2rem 0', padding: '2rem 0', borderTop: '1px solid var(--border-dark)', borderBottom: '1px solid var(--border-dark)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '0.75rem' }}><Calendar color="var(--primary)" /></div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date & Time</p>
                                <p style={{ fontWeight: 600 }}>{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-dark)', padding: '0.75rem', borderRadius: '0.75rem' }}><MapPin color="var(--primary)" /></div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</p>
                                <p style={{ fontWeight: 600 }}>{event.location}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                        <div>
                            <h3>Description</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.8 }}>{event.description}</p>
                        </div>
                        <div className="glass-card" style={{ padding: '2rem', height: 'fit-content', textAlign: 'center' }}>
                            {!isRegistered ? (
                                <>
                                    <h3 style={{ marginBottom: '1rem' }}>Join the Event</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Register now to book your spot and get your entry QR code.</p>
                                    <button onClick={handleRegister} className="btn-primary" style={{ width: '100%' }}>Register Now</button>
                                </>
                            ) : (
                                <>
                                    <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <CheckCircle size={24} />
                                        <h3 style={{ margin: 0 }}>You're Registered!</h3>
                                    </div>
                                    <div style={{ background: 'white', padding: '1rem', display: 'inline-block', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                        <img src={qrCode} alt="Entry QR" style={{ width: 150, height: 150 }} />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show this QR code at the entrance.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
