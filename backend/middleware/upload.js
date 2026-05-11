// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = './uploads/temp/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `TEMP-${Date.now()}${path.extname(file.originalname)}`)
});

// 🛡️ SECURITY: Strict MIME Type Verification
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 🛡️ SECURITY: Limit file size to 5MB to prevent DoS
    files: 1 // Only allow 1 file per request
  },
  fileFilter 
});

module.exports = upload;