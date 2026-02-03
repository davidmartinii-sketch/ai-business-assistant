const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth');

// Mock in-memory user store (replace with database in production)
let users = [];
let userId = 1;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = users.some((u) => u.email === email);
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: { statusCode: 400, message: 'Email already registered' },
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const user = {
    id: userId++,
    name,
    email,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

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
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((u) => u.email === email);
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
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch {
    return null;
  }
};

exports.getMe = (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
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
};

exports.resetUsers = () => {
  users = [];
  userId = 1;
};
