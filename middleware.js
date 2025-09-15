
import { rateLimit } from './lib/middleware/rateLimiter.js';
import { sanitizeInput } from './lib/middleware/sanitization.js';
import { errorHandler } from './lib/middleware/errorHandler.js';

export default function middleware(req, res, next) {
  // Apply rate limiting
  rateLimit()(req, res, () => {
    // Apply input sanitization
    sanitizeInput(req, res, () => {
      // Apply error handling
      errorHandler(req, res, next);
    });
  });
}

export const config = {
  matcher: '/api/:path*',
};
