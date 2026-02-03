const request = require('supertest');
const app = require('../src/app');

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
