const db = require('../config/db');

// Bookmarks Controller
exports.toggleBookmark = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const check = await db.query('SELECT * FROM bookmarks WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
        if (check.rows.length > 0) {
            await db.query('DELETE FROM bookmarks WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
            return res.json({ message: 'Bookmark removed', status: 'unbookmarked' });
        } else {
            await db.query('INSERT INTO bookmarks (user_id, event_id) VALUES ($1, $2)', [userId, eventId]);
            return res.json({ message: 'Bookmark added', status: 'bookmarked' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getMyBookmarks = async (req, res) => {
    try {
        const result = await db.query('SELECT e.* FROM bookmarks b JOIN events e ON b.event_id = e.id WHERE b.user_id = $1', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Feedback Controller
exports.addFeedback = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { rating, comment } = req.body;
        const result = await db.query(
            'INSERT INTO feedbacks (user_id, event_id, rating, comment) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, event_id) DO UPDATE SET rating = $3, comment = $4 RETURNING *',
            [req.user.id, eventId, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Notifications Controller
exports.getMyNotifications = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await db.query('UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
