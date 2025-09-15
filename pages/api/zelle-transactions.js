import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sender_id,
      sender_account_id,
      recipient_contact,
      amount,
      memo,
      transaction_type
    } = req.body;

    // Validate required fields
    if (!sender_id || !sender_account_id || !recipient_contact || !amount || !transaction_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate amount
    const transactionAmount = parseFloat(amount);
    if (transactionAmount <= 0 || transactionAmount > 2500) {
      return res.status(400).json({ error: 'Amount must be between $0.01 and $2,500' });
    }

    // Validate contact format (email or phone)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (!emailRegex.test(recipient_contact) && !phoneRegex.test(recipient_contact)) {
      return res.status(400).json({ error: 'Invalid email or phone number format' });
    }

    // Use the database function to process the transaction
    const { data: result, error } = await supabase.rpc('process_zelle_transaction', {
      sender_id_param: sender_id,
      account_id_param: sender_account_id,
      recipient_contact_param: recipient_contact,
      amount_param: transactionAmount,
      memo_param: memo || (transaction_type === 'send' ? 'Zelle Transfer' : 'Zelle Request'),
      transaction_type_param: transaction_type
    });

    if (error) {
      console.error('Database function error:', error);
      throw error;
    }

    // Check if the function returned an error
    if (!result.success) {
      return res.status(400).json({ 
        error: result.error,
        details: result.daily_remaining ? `Daily remaining: $${result.daily_remaining}` : 
                result.monthly_remaining ? `Monthly remaining: $${result.monthly_remaining}` : ''
      });
    }

    // Return success response
    const response = {
      success: true,
      transaction_id: result.transaction_id,
      reference_number: result.reference_number,
      status: result.status,
      amount: result.amount,
      recipient: result.recipient,
      estimated_delivery: transaction_type === 'send' ? 'Within minutes' : 'Pending recipient response',
      message: transaction_type === 'send' 
        ? `$${transactionAmount.toFixed(2)} sent to ${recipient_contact}`
        : `$${transactionAmount.toFixed(2)} requested from ${recipient_contact}`
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Zelle transaction error:', error);
    res.status(500).json({ 
      error: 'Transaction failed. Please try again.',
      details: error.message 
    });
  }
}