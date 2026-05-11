const rateLimit = require('express-rate-limit');

// 1. Global API Limiter (General Spam/Scraping Protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per window
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 2. Strict Login Limiter (Brute Force / Credential Stuffing Protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per window
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 3. Registration Limiter (Bot/Mass Account Creation Protection)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 account creations per hour
  message: { success: false, message: 'Too many accounts created from this IP, please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. AI Generation Limiter (Resource Exhaustion / Billing Protection)
// const aiLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 10, // Limit each IP to 10 AI generation requests per hour
//   message: { success: false, message: 'AI generation quota exceeded. Please try again later.' },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

module.exports = {
  globalLimiter,
  loginLimiter,
  registerLimiter,
  // aiLimiter
};