const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  test('responds with 200 and the expected JSON message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World' });
  });
});
