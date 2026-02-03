const request = require('supertest');
const app = require('../src/app');
const userController = require('../src/controllers/userController');
const authController = require('../src/controllers/authController');

// Clean up database before each test
beforeEach(async () => {
  await userController.resetUsers();
  await authController.resetUsers();
});

describe('GET /', () => {
  test('responds with 200 and the expected JSON message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World' });
  });
});

describe('GET /health', () => {
  test('responds with 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /notfound', () => {
  test('responds with 404 for non-existent route', async () => {
    const res = await request(app).get('/notfound');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.statusCode).toBe(404);
  });
});

describe('POST /users', () => {
  test('creates a user with valid data', async () => {
    const res = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('John Doe');
    expect(res.body.data.email).toBe('john@example.com');
    expect(res.body.data.age).toBe(30);
    expect(res.body.data.id).toBeDefined();
  });

  test('returns 400 for invalid email', async () => {
    const res = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'invalid-email',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('Validation error');
  });

  test('returns 400 if name is missing', async () => {
    const res = await request(app).post('/users').send({
      email: 'john@example.com',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 if name is too short', async () => {
    const res = await request(app).post('/users').send({
      name: 'J',
      email: 'john@example.com',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('creates a user without age (optional field)', async () => {
    const res = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.age).toBeNull();
  });
});

describe('GET /users', () => {
  test('returns empty array initially', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  test('returns created users', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('John Doe');
  });
});

describe('POST /auth/register', () => {
  test('registers a new user with valid data', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.name).toBe('John Doe');
    expect(res.body.data.email).toBe('john@example.com');
    expect(res.body.data.token).toBeDefined();
    expect(typeof res.body.data.token).toBe('string');
  });

  test('returns 400 for duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    };

    // First registration succeeds
    await request(app).post('/auth/register').send(userData);

    // Second registration with same email fails
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Email already registered');
  });

  test('returns 400 if name is missing', async () => {
    const res = await request(app).post('/auth/register').send({
      email: 'john@example.com',
      password: 'securepassword123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 if email is invalid', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'securepassword123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 if password is too short', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /auth/login', () => {
  test('logs in user with correct credentials', async () => {
    // Register user first
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });

    // Login
    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'securepassword123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.email).toBe('john@example.com');
    expect(res.body.data.token).toBeDefined();
  });

  test('returns 401 for non-existent user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'anypassword',
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  test('returns 401 for incorrect password', async () => {
    // Register user first
    await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });

    // Login with wrong password
    const res = await request(app).post('/auth/login').send({
      email: 'john@example.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('returns 400 for validation errors', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'invalid-email',
      password: 'password',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /auth/me', () => {
  let token;

  beforeEach(async () => {
    // Register and get token
    const registerRes = await request(app).post('/auth/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });

    token = registerRes.body.data.token;
  });

  test('returns current user with valid token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('john@example.com');
    expect(res.body.data.id).toBeDefined();
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('returns 401 with malformed authorization header', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'InvalidFormat token');

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
