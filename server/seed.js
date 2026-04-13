const { pool } = require('./src/config/db');

const seedEvents = async () => {
    try {
        const events = [
            ['HackerRank Challenge 2026', 'Showcase your coding skills in this campus-wide competitive programming event.', '2026-05-15', '10:00:00', 'Main Auditorium', 'Technology', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'],
            ['Spring Cultural Fest', 'A night of music, dance, and celebration of campus diversity.', '2026-05-18', '18:00:00', 'Open Theater', 'Cultural', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'],
            ['AI Workshop: Future of LLMs', 'Learn how to build and fine-tune large language models from industry experts.', '2026-05-20', '14:00:00', 'Seminar Hall B', 'Technology', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'],
            ['Annual Inter-College Cricket', 'Cheer for your team in the biggest sports event of the year!', '2026-05-25', '09:00:00', 'Campus Ground', 'Sports', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80'],
            ['Startup Pitch Day', 'Pitch your innovative ideas to top venture capitalists and win prizes.', '2026-06-05', '11:00:00', 'Innovation Lab', 'Workshop', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80']
        ];

        console.log('Seeding database with events...');

        for (const event of events) {
            await pool.query(
                'INSERT INTO events (title, description, date, time, location, category, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                event
            );
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedEvents();
