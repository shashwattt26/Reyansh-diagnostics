const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Read token from the httpOnly cookie instead of the Authorization header
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // Verify token using the secret from your .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to the request object so routes can use it
    req.user = decoded;
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

module.exports = { protect };