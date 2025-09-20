import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseClient.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, accountId, userId, description } = req.body;

    if (!amount || !accountId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify account belongs to user
    const { data: account, error: accountError } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Verify user exists
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // cents
      currency: 'usd',
      metadata: {
        accountId,
        userId,
        description: description || 'Account deposit',
        type: 'deposit'
      },
      description: `Deposit to account ${account.account_number}`,
    });

    // Store pending transaction
    const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        account_id: accountId,
        user_id: userId,
        type: 'deposit',
        amount: parseFloat(amount),
        description: description || 'Account deposit',
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        created_at: new Date().toISOString()
      });

    if (transactionError) throw transactionError;

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};
