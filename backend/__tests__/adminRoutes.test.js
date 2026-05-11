const request = require('supertest');
const app = require('../server'); 
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// 🛡️ MOCK THE DATABASE
jest.mock('../config/db', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

// Set a dummy JWT secret specifically for this test environment
process.env.JWT_SECRET = 'test-secret-key';

describe('Admin Protected Routes & RBAC', () => {
  
  afterAll(async () => {
    if (db.end) {
      await db.end();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Security Middleware Tests', () => {

    it('1. Should block access with 401 if no cookie/token is provided', async () => {
      // Trying to fetch bookings without logging in
      const response = await request(app).get('/api/admin/bookings');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatch(/no token provided/i);
      // Ensure the database was never queried
      expect(db.query).not.toHaveBeenCalled(); 
    });

    it('2. Should block access with 401 if the token is invalid or tampered with', async () => {
      const response = await request(app)
        .get('/api/admin/bookings')
        .set('Cookie', ['token=fake.tampered.jwt']);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatch(/token failed or expired/i);
    });

    it('3. Should block access with 403 if a regular Staff tries to use an Admin route', async () => {
      // Create a VALID token, but assign it the 'staff' role
      const staffToken = jwt.sign({ id: 99, role: 'staff' }, process.env.JWT_SECRET);

      // Try to access the highly sensitive patient anonymization route
      const response = await request(app)
        .patch('/api/admin/bookings/1/anonymize')
        .set('Cookie', [`token=${staffToken}`]);

      // 403 Forbidden: The server understands the token, but refuses to authorize the action
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toMatch(/Unauthorized/i);
      expect(db.query).not.toHaveBeenCalled(); 
    });

    it('4. Should allow access with 200 if a valid Admin token is provided', async () => {
      // Create a VALID token with the 'admin' role
      const adminToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);

      // Fake the database successfully returning bookings
      db.query.mockResolvedValueOnce({ 
        rowCount: 1, 
        rows: [{ id: 1, patient_name: 'John Doe', status: 'Pending' }] 
      });

      const response = await request(app)
        .get('/api/admin/bookings')
        .set('Cookie', [`token=${adminToken}`]);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].patient_name).toBe('John Doe');
      
      // Ensure the database was actually queried this time
      expect(db.query).toHaveBeenCalledTimes(1);
    });

  });
});