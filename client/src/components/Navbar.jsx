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
        <nav className="glass-card nav-responsive" style={{ margin: '1rem', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>
                    <Calendar size={28} />
                    <span className="desktop-only text-logo">CEMS</span>
                </Link>
            </div>

            <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/events" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Events</Link>
                {user ? (
                    <>
                        {user.role === 'admin' ? (
                            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                                <LayoutDashboard size={18} /> <span className="nav-text">Admin</span>
                            </Link>
                        ) : (
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                                <LayoutDashboard size={18} /> <span className="nav-text">Dashboard</span>
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
                    <div className="auth-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Login</Link>
                        <Link to="/register" className="btn-primary desktop-only" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Sign Up</Link>
                    </div>
                )}
            </div>

            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ background: 'transparent', color: 'var(--text-light)', display: 'none', padding: '0.25rem' }}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: block !important; }
                    .nav-links {
                        display: ${mobileOpen ? 'flex' : 'none'} !important;
                        position: absolute;
                        top: 110%;
                        left: 0;
                        right: 0;
                        background: var(--glass);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        padding: 1.5rem;
                        border-radius: 1.25rem;
                        border: 1px solid var(--border-dark);
                        flex-direction: column !important;
                        gap: 1.25rem !important;
                        align-items: center !important;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    }
                    .auth-buttons {
                        flex-direction: column;
                        width: 100%;
                    }
                    .auth-buttons a {
                        width: 100%;
                        text-align: center;
                    }
                    .desktop-only { display: none !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
