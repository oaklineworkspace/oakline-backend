// routes/accounts.js
import express from 'express';
import { getAccountTypes } from '../controllers/accounts/accountTypes.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 Protect this route if needed
router.get('/types', verifyToken, getAccountTypes);

export default router;
