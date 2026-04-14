const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key missing. Storage features will not work.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
