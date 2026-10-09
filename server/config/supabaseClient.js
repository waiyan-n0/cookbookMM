// server
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
global.WebSocket = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in server .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;