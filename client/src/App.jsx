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
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
                    <Navbar />
                    <div className="page-responsive" style={{ padding: '0 2rem' }}>
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
                        </Routes>
                    </div>
                    <Toaster position="bottom-right" />
                    <Chatbot />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
