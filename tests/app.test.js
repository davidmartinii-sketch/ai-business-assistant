const request = require('supertest');
const app = require('../src/app');
const userController = require('../src/controllers/userController');

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
  beforeEach(() => {
    userController.resetUsers();
  });

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
  beforeEach(() => {
    userController.resetUsers();
  });

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
