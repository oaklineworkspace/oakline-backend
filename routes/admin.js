// routes/admin.js
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  approveOrRejectCardApplication,
  assignCard,
  getCardApplications
} from '../controllers/admin/cardApplications.js';

const router = express.Router();

// All routes here require authentication
router.use(verifyToken);

// Approve or reject a card application
// POST /api/admin/card-application
router.post('/card-application', approveOrRejectCardApplication);

// Assign a card directly (admin action)
// POST /api/admin/assign-card
router.post('/assign-card', assignCard);

// Get all card applications
// GET /api/admin/card-applications
router.get('/card-applications', getCardApplications);

export default router;
