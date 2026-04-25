const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, interests } = req.body;

        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const isApproved = role === 'admin' ? false : true;

        // Insert user
        const newUser = await db.query(
            'INSERT INTO users (name, email, password, role, interests, is_approved) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role',
            [name, email, hashedPassword, role || 'student', interests || [], isApproved]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        if (user.role === 'admin' && !user.is_approved) {
            return res.status(403).json({ error: 'Waiting for the host to approve' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, role, interests, points FROM users WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUnapprovedAdmins = async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, email FROM users WHERE role = 'admin' AND is_approved = FALSE");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching unapproved admins' });
    }
};

exports.approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE users SET is_approved = TRUE WHERE id = $1', [id]);
        res.json({ message: 'Admin approved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error approving admin' });
    }
};

exports.rejectAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'Admin rejected and removed' });
    } catch (err) {
        res.status(500).json({ error: 'Server error rejecting admin' });
    }
};
