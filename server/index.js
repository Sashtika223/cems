const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const eventRoutes = require('./src/routes/event.routes');
const registrationRoutes = require('./src/routes/registration.routes');
const bookmarkRoutes = require('./src/routes/bookmark.routes');
const feedbackRoutes = require('./src/routes/feedback.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const uploadRoutes = require('./src/routes/upload.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:", "https://images.unsplash.com"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "connect-src": ["'self'", "https://*.supabase.co", "wss://*.supabase.co"]
        },
    },
    crossOriginEmbedderPolicy: false
}));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Socket.io
app.set('io', io);
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their personal room`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
        }
    });
} else {
    // Root route for development
    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to CEMS API' });
    });

    app.get('/api/health', async (req, res) => {
        try {
            const db = require('./src/config/db');
            await db.query('SELECT 1');
            res.json({ status: 'ok', database: 'connected' });
        } catch (err) {
            res.status(500).json({ status: 'error', database: err.message });
        }
    });
}


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
