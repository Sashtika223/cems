const db = require('../config/db');
const QRCode = require('qrcode');

exports.registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        // Check if already registered
        const check = await db.query('SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
        if (check.rows.length > 0) return res.status(400).json({ error: 'Already registered' });

        // Generate QR Code data (simplified)
        const qrData = JSON.stringify({ userId, eventId, timestamp: Date.now() });
        const qrCodeImage = await QRCode.toDataURL(qrData);

        const result = await db.query(
            'INSERT INTO registrations (user_id, event_id, qr_code) VALUES ($1, $2, $3) RETURNING *',
            [userId, eventId, qrCodeImage]
        );

        // Award points for participation
        await db.query('UPDATE users SET points = points + 10 WHERE id = $1', [userId]);

        res.status(201).json({ message: 'Registered successfully', registration: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getMyEvents = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT e.*, r.registration_date, r.qr_code, r.status FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.user_id = $1',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getEventParticipants = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT u.name, u.email, r.registration_date, r.status FROM registrations r JOIN users u ON r.user_id = u.id WHERE r.event_id = $1',
            [req.params.eventId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
