const authController = require('../controllers/authController');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        statusCode: 401,
        message: 'Missing or invalid authorization header',
      },
    });
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  const decoded = authController.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: { statusCode: 401, message: 'Invalid or expired token' },
    });
  }

  req.user = decoded;
  next();
};

module.exports = authenticate;
