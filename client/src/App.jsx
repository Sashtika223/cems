import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Notifications from './pages/Notifications';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Authenticating...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }
    
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main className="page-responsive" style={{ flex: 1, padding: '1rem' }}>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            <Route path="/dashboard" element={
                                <ProtectedRoute role="student">
                                    <StudentDashboard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/admin" element={
                                <ProtectedRoute role="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/events/:id" element={<EventDetails />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/notifications" element={<Notifications />} />
                            
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    <Toaster position="bottom-right" />
                    <Chatbot />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
