// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// --- Example: Map scripts to API endpoints ---
// Each script should export a function: async function(req, res) { ... }

const checkUsers = require('./scripts/check-users');
const cleanupStuckUsers = require('./scripts/cleanup-stuck-users');
const debugAuthUsers = require('./scripts/debug-auth-users');
// Add other scripts as needed

app.use('/api/check-users', checkUsers);
app.use('/api/cleanup-stuck-users', cleanupStuckUsers);
app.use('/api/debug-auth-users', debugAuthUsers);

// Simple root route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Oakline Bank backend is running!' });
});

// Example: A route using Supabase
app.get('/api/accounts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*');

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Oakline backend running on port ${PORT}`);
});
