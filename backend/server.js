const express = require('express');
const http = require('http'); // Built-in Node module
const { Server } = require('socket.io'); // Import Socket.io
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const { globalLimiter } = require('./middleware/rateLimiter');
const morgan = require('morgan');
const logger = require('./utils/logger');

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap Express in an HTTP server

const corsOptions = {
  // 🛡️ NO WILDCARDS! Use the exact URL of your Vite frontend
  origin: 'http://localhost:5173', 
  credentials: true, // 🛡️ Allow cookies to be sent back and forth
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.set('trust proxy', 1); // If behind a proxy (like Heroku), trust the first proxy for secure cookies
app.use(cors(corsOptions));

// 🛡️ SECURITY: Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// --- IMPORTANT: Update Socket.io CORS too! ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Make the 'io' instance globally accessible to your routes
app.set('io', io);

// Listen for basic socket connections
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet()); 
app.use(express.json()); 
app.use(cookieParser()); // For parsing cookies
app.use('/api', globalLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 📡 OBSERVABILITY: Log all HTTP requests
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/branding', require('./routes/brandingRoutes')); 
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));

const PORT = process.env.PORT || 5000;
// 🛡️ CRITICAL FOR TESTING: 
// Only start the server if we are NOT running tests. 
// Supertest will handle starting its own temporary server.
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => console.log(`Server & Socket running on port ${PORT}`));
}

// Export the app so Jest and Supertest can use it to fake API calls
module.exports = app;