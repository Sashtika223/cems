const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase URL or Key missing. Storage features will not work.');
} else {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Supabase:', err.message);
    }
}

module.exports = supabase;
