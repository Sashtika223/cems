import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your CEMS AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        
        const userMsg = { role: 'user', text: input };
        setMessages([...messages, userMsg]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            let botText = "I'm not sure about that, but you can find all events in the dashboard!";
            const query = input.toLowerCase();
            if (query.includes('event') || query.includes('today')) {
                botText = "There are several events happening today! Check out the 'Upcoming Events' section.";
            } else if (query.includes('points') || query.includes('reward')) {
                botText = "You earn 10 points for every event you attend. Check your profile for the leaderboard!";
            }
            setMessages(prev => [...prev, { role: 'bot', text: botText }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 3000 }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="btn-primary" 
                style={{ width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.5)' }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-card" 
                        style={{ position: 'absolute', bottom: 80, right: 0, width: 350, height: 450, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ padding: '1rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Bot size={24} />
                            <span style={{ fontWeight: 600 }}>CEMS AI Assistant</span>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <div style={{ 
                                        padding: '0.75rem 1rem', 
                                        borderRadius: '1rem', 
                                        background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                        fontSize: '0.9rem',
                                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-dark)'
                                    }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-dark)', display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border-dark)', borderRadius: '0.5rem', padding: '0.5rem 1rem', color: 'white' }}
                            />
                            <button onClick={handleSend} style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.5rem' }}><Send size={18} /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
