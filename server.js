// server.js — thin Express server for the USMLE Illustration Portfolio + QBank.
//
// The frontend talks to Supabase directly from the browser using the public
// anon key (that's what it's for — Row Level Security in schema.sql keeps
// writes locked down), so this server mainly serves static files and a small
// /api/config endpoint so the frontend never hardcodes the anon key in a
// committed .js file.

require('dotenv').config();
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Public config for the frontend Supabase client. The anon key is designed
// to be public (RLS enforces what it can actually do), so this is safe to
// serve — it is NOT the service role key.
app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  });
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

// Fallback to index.html for any other route (single-page app navigation).
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`USMLE portfolio server listening on port ${PORT}`);
});
