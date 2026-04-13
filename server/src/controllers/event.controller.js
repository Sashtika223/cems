const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        const { category, search, date } = req.query;
        let queryText = 'SELECT * FROM events WHERE TRUE';
        let params = [];
        let count = 1;

        if (category) {
            queryText += ` AND category = $${count++}`;
            params.push(category);
        }

        if (search) {
            queryText += ` AND (title ILIKE $${count++} OR description ILIKE $${count++})`;
            params.push(`%${search}%`, `%${search}%`);
        }

        if (date) {
            queryText += ` AND date = $${count++}`;
            params.push(date);
        }

        queryText += ' ORDER BY date ASC';
        
        const result = await db.query(queryText, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching events' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, category, image_url } = req.body;
        
        // Mock AI auto-tagging if category is not provided
        let finalCategory = category;
        if (!finalCategory && description) {
            if (description.toLowerCase().includes('tech') || description.toLowerCase().includes('coding')) finalCategory = 'Technology';
            else if (description.toLowerCase().includes('music') || description.toLowerCase().includes('dance')) finalCategory = 'Cultural';
            else finalCategory = 'General';
        }

        const result = await db.query(
            'INSERT INTO events (title, description, date, time, location, category, image_url, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, date, time, location, finalCategory, image_url, req.user.id]
        );

        // Notify all users about new event (Socket.io)
        const io = req.app.get('io');
        io.emit('new_event', { message: `New event: ${title}`, event: result.rows[0] });

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating event' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, category, image_url } = req.body;
        const eventId = req.params.id;
        const userRole = req.user.role?.toLowerCase();
        const userId = req.user.id;

        console.log(`Updating Event ID: ${eventId}, User Role: ${userRole}, User ID: ${userId}`);
        
        // Allow admins to update any event, but students can only update their own
        let query;
        let params;
        
        if (userRole === 'admin') {
            query = 'UPDATE events SET title=$1, description=$2, date=$3, time=$4, location=$5, category=$6, image_url=$7 WHERE id=$8 RETURNING *';
            params = [title, description, date, time, location, category, image_url, eventId];
        } else {
            query = 'UPDATE events SET title=$1, description=$2, date=$3, time=$4, location=$5, category=$6, image_url=$7 WHERE id=$8 AND created_by=$9 RETURNING *';
            params = [title, description, date, time, location, category, image_url, eventId, userId];
        }

        const result = await db.query(query, params);
        
        if (result.rows.length === 0) {
            const checkExists = await db.query('SELECT id FROM events WHERE id=$1', [eventId]);
            if (checkExists.rows.length === 0) {
                return res.status(404).json({ error: `Event with ID ${eventId} not found in database` });
            }
            return res.status(403).json({ error: 'Unauthorized to edit this event' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update Event Error:', err);
        res.status(500).json({ error: 'Server error updating event', details: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        let query;
        let params;

        if (req.user.role === 'admin') {
            query = 'DELETE FROM events WHERE id=$1 RETURNING *';
            params = [req.params.id];
        } else {
            query = 'DELETE FROM events WHERE id=$1 AND created_by=$2 RETURNING *';
            params = [req.params.id, req.user.id];
        }

        const result = await db.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found or unauthorized' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Delete Event Error:', err);
        res.status(500).json({ error: 'Server error deleting event' });
    }
};

// AI Features
exports.generateAIDescription = async (req, res) => {
    const { title, category } = req.body;
    // In a real app, you'd call OpenAI/Claude here. Mocking for now.
    const mockDescription = `Join us for the ultimate ${title}! This ${category} event is designed to bring students together for an unforgettable experience filled with learning, networking, and fun. Don't miss out on this campus highlight!`;
    res.json({ description: mockDescription });
};

exports.getRecommendations = async (req, res) => {
    try {
        // Fetch user interests
        const userResult = await db.query('SELECT interests FROM users WHERE id = $1', [req.user.id]);
        const interests = userResult.rows[0].interests || [];

        if (interests.length === 0) {
            // Return upcoming events if no interests
            const events = await db.query('SELECT * FROM events ORDER BY date ASC LIMIT 5');
            return res.json(events.rows);
        }

        // Fetch events matching interests
        const result = await db.query(
            'SELECT * FROM events WHERE category = ANY($1) OR title ILIKE ANY($2) ORDER BY date ASC LIMIT 5',
            [interests, interests.map(i => `%${i}%`)]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
