const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { statusCode: 400, message: 'Email already exists' },
      });
    }

    // Generate a default password hash for non-auth users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('default-password', salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        age: age || null,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'Failed to create user' },
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: { statusCode: 500, message: 'Failed to get users' },
    });
  }
};

// Test helper to clean database
exports.resetUsers = async () => {
  await prisma.user.deleteMany();
};
