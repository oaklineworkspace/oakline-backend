// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import { ENV } from './config/env.js';

// Import routes
import authRoutes from './routes/auth.js';
import cardsRoutes from './routes/cards.js';
import accountsRoutes from './routes/accounts.js';
import transactionsRoutes from './routes/transactions.js';
import adminRoutes from './routes/admin.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { verifyToken } from './middleware/authMiddleware.js';

const app = express();

// ------------------------
// Security & Performance
// ------------------------
app.use(helmet()); // Secure HTTP headers

app.use(cors({
  origin: ENV.NEXT_PUBLIC_SITE_URL || '*',
  credentials: true
}));

// Rate limiter: max 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------
// Health Check
// ------------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ------------------------
// API Routes
// ------------------------
app.use('/api/auth', authRoutes);                    // Public auth routes
app.use('/api/cards', verifyToken, cardsRoutes);    // Protected card routes
app.use('/api/accounts', verifyToken, accountsRoutes); // Protected account routes
app.use('/api/transactions', verifyToken, transactionsRoutes); // Protected transaction routes
app.use('/api/admin', verifyToken, adminRoutes);    // Admin-only routes

// ------------------------
// 404 Not Found Handler
// ------------------------
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ------------------------
// Global Error Handler
// ------------------------
app.use(errorHandler);

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Oakline Backend running on port ${PORT}`);
});

export default app;
