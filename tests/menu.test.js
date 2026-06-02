const request = require('supertest');
const app = require('../src/app');

describe('GET /api/menu', () => {
  it('returns 200 and array of items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(6);
  });

  it('each item has required fields (id, name, price, imageUrl)', async () => {
    const res = await request(app).get('/api/menu');

    res.body.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('price');
      expect(typeof item.price).toBe('number');
      expect(item).toHaveProperty('imageUrl');
    });
  });
});
