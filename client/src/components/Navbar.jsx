import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, LayoutDashboard, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-card nav-responsive" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                    <Calendar size={28} />
                    <span>CEMS</span>
                </Link>
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ background: 'transparent', color: 'var(--text-light)', display: 'none', padding: '0.25rem' }}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div className="nav-links" style={{ display: mobileOpen ? 'flex' : '', alignItems: 'center', gap: '1rem' }}>
                <Link to="/events" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Events</Link>
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                                <LayoutDashboard size={18} /> Admin
                            </Link>
                        ) : (
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                                <LayoutDashboard size={18} /> Dashboard
                            </Link>
                        )}
                        <Link to="/notifications" style={{ position: 'relative' }} className="hover-link">
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--secondary)', borderRadius: '50%', width: 15, height: 15, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                        </Link>
                        <Link to="/profile" className="hover-link"><User size={20} /></Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--error)', padding: '0.5rem' }} className="hover-link"><LogOut size={20} /></button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Login</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>Sign Up</Link>
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: block !important; }
                    .nav-links {
                        display: ${mobileOpen ? 'flex' : 'none'} !important;
                        flex-direction: column !important;
                        width: 100%;
                        gap: 0.75rem !important;
                        padding-top: 0.75rem;
                        align-items: center !important;
                    }
                    .nav-links > div {
                        flex-direction: column !important;
                        width: 100%;
                        align-items: center;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
