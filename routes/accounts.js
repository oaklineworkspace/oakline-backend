// routes/accounts.js
import express from 'express';
import { getAccountTypes } from '../controllers/accounts/accountTypes.js';
import { createAccount } from '../controllers/accounts/accountCreationController.js';
import { updateBalance } from '../controllers/accounts/balanceController.js';
import { transferFunds, getTransactionHistory } from '../controllers/accounts/transferController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// =====================
// Account Types
// =====================
router.get('/types', verifyToken, getAccountTypes);

// =====================
// Account Creation
// =====================
router.post('/create', verifyToken, createAccount);

// =====================
// Balance Updates
// =====================
router.post('/balance', verifyToken, updateBalance);

// =====================
// Transfers
// =====================
router.post('/transfer', verifyToken, transferFunds);

// =====================
// Transaction History
// =====================
router.get('/:accountId/transactions', verifyToken, getTransactionHistory);

export default router;
