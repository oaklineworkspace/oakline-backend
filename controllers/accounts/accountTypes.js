// controllers/accounts/accountTypes.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// =====================
// Get All Account Types
// =====================
export const getAccountTypes = async (req, res) => {
  try {
    // Run a raw SQL query to get all values from the enum
    const { data, error } = await supabase
      .rpc('get_account_types'); // We'll create a PostgreSQL function next

    if (error) {
      console.error('Error fetching account types:', error);
      return res.status(500).json({ error: 'Failed to fetch account types' });
    }

    res.status(200).json({ accountTypes: data });
  } catch (err) {
    console.error('Server error fetching account types:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
