const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');
const prisma = require('../config/database');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { statusCode: 400, message: 'Email already registered' },
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      authConfig.jwtSecret,
      {
        expiresIn: authConfig.jwtExpiry,
      }
    );

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'Failed to register user' },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { statusCode: 401, message: 'Invalid email or password' },
      });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { statusCode: 401, message: 'Invalid email or password' },
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      authConfig.jwtSecret,
      {
        expiresIn: authConfig.jwtExpiry,
      }
    );

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'Failed to login' },
    });
  }
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch {
    return null;
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { statusCode: 404, message: 'User not found' },
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'Failed to get user' },
    });
  }
};

// Test helper to clean database
exports.resetUsers = async () => {
  await prisma.user.deleteMany();
};
