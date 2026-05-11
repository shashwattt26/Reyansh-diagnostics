const request = require('supertest');
const app = require('../server'); 
const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

// 🛡️ 1. MOCK THE DATABASE
jest.mock('../config/db', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

// 🛡️ 2. MOCK THE EMAIL SENDER (Prevents actual emails from being sent)
jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue(true));

describe('Auth API Routes', () => {
  
  afterAll(async () => {
    if (db.end) {
      await db.end();
    }
  });

  // Clear mocks before each test so they don't interfere with each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    
    it('should successfully register a user and send a verification email', async () => {
      // Fake the database successfully inserting the user
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: 1, email: 'dr.sharma@clinic.com' }] 
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Dr. Sharma',
          email: 'dr.sharma@clinic.com',
          password: 'SecurePassword123!'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/check your email/i);
      
      // Verify that our email utility was actually triggered!
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/auth/login', () => {
    
    it('should successfully login an active, verified user and set a cookie', async () => {
      // Create a real hash for the test password so bcrypt.compare works
      const testPassword = 'Password123!';
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      // Fake the database returning a valid user
      db.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: 1, 
          email: 'admin@clinic.com', 
          password_hash: hashedPassword,
          role: 'admin',
          is_active: true,
          is_verified: true // Must be true based on your security patch!
        }] 
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@clinic.com',
          password: testPassword
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      
      // 🛡️ CRITICAL SECURITY CHECK: Ensure the HTTP-Only cookie was set!
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toMatch(/token=/);
      expect(response.headers['set-cookie'][0]).toMatch(/HttpOnly/);
    });

    it('should block login if the user email is not verified', async () => {
      // Fake the database returning an UNVERIFIED user
      db.query.mockResolvedValueOnce({ 
        rows: [{ 
          id: 2, 
          email: 'newstaff@clinic.com', 
          is_active: true,
          is_verified: false // <--- This should trigger your 403 block
        }] 
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'newstaff@clinic.com',
          password: 'DoesNotMatterHere'
        });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toMatch(/verify your email address before logging in/i);
    });

  });
});