const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user should be populated by your JWT verification middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Your role (${req.user?.role}) is not authorized to perform this action.` 
      });
    }
    next();
  };
};

module.exports = authorizeRoles;