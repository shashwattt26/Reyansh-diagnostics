const request = require('supertest');
const app = require('../server'); 
const db = require('../config/db'); 

// 🛡️ 1. MOCK CLOUDINARY: Stop real uploads and return a fake URL
jest.mock('../config/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({ 
      secure_url: 'https://res.cloudinary.com/fake-url/prescription.jpg' 
    })
  }
}));

// 🛡️ 2. MOCK POSTGRESQL: Stop real database inserts and return a fake saved row
jest.mock('../config/db', () => ({
  query: jest.fn().mockResolvedValue({ 
    rows: [{ 
      id: 1, 
      patient_name: 'Rahul Sharma', 
      phone: '9876543210',
      address: 'Lucknow, UP',
      prescription_url: 'https://res.cloudinary.com/fake-url/prescription.jpg',
      short_code: 'A1B2C3',
      status: 'Pending Review' 
    }] 
  }),
  end: jest.fn() // Mock the end function so it doesn't crash on teardown
}));

describe('Booking API Routes', () => {
  
  afterAll(async () => {
    if (db.end) {
      await db.end();
    }
  });

  describe('POST /api/bookings/upload-prescription', () => {
    
    it('should fail and return 400 if prescription file is missing', async () => {
      const response = await request(app)
        .post('/api/bookings/upload-prescription')
        .field('patientName', 'Rahul Sharma')
        .field('phone', '9876543210')
        .field('address', 'Lucknow, UP');

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/Please upload a prescription/i);
    });

    it('should successfully create a new test booking with a fake file', async () => {
      const response = await request(app)
        .post('/api/bookings/upload-prescription')
        .field('patientName', 'Rahul Sharma')
        .field('phone', '9876543210')
        .field('address', 'Lucknow, UP')
        .attach('prescription', Buffer.from('fake-image-data'), 'prescription.jpg');

      // Now it will bypass Cloudinary & Postgres, and successfully return 200!
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('trackingCode');
    });

  });
});