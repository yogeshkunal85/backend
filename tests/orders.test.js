const request = require('supertest');
const app = require('../src/app');
const { resetOrders } = require('../src/data/orders');

const validOrderPayload = {
  customerName: 'Jane Doe',
  address: '123 Main St',
  phone: '9876543210',
  items: [{ menuItemId: 'burger-1', quantity: 2 }],
};

beforeEach(() => {
  resetOrders();
});

describe('POST /api/orders', () => {
  it('returns 201 with order object and status "Order Received"', async () => {
    const res = await request(app).post('/api/orders').send(validOrderPayload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.customerName).toBe(validOrderPayload.customerName);
    expect(res.body.status).toBe('Order Received');
    expect(res.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          menuItemId: 'burger-1',
          quantity: 2,
        }),
      ])
    );
    expect(res.body).toHaveProperty('totalAmount');
    expect(res.body).toHaveProperty('createdAt');
  });

  it('returns 400 when customerName is missing', async () => {
    const { customerName, ...payload } = validOrderPayload;
    const res = await request(app).post('/api/orders').send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: expect.stringMatching(/customerName/i) }),
      ])
    );
  });

  it('returns 400 when phone is invalid', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, phone: '123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: expect.stringMatching(/phone/i) }),
      ])
    );
  });

  it('returns 400 when items array is empty', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ ...validOrderPayload, items: [] });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: expect.stringMatching(/items/i) }),
      ])
    );
  });
});

describe('GET /api/orders/:id', () => {
  it('returns the correct order', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    const res = await request(app).get(`/api/orders/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    expect(res.body.customerName).toBe(validOrderPayload.customerName);
  });

  it('returns 404 for invalid ID', async () => {
    const res = await request(app).get('/api/orders/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /api/orders/:id/status', () => {
  it('returns just the status field', async () => {
    const created = await request(app).post('/api/orders').send(validOrderPayload);
    const res = await request(app).get(`/api/orders/${created.body.id}/status`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'Order Received' });
    expect(Object.keys(res.body)).toEqual(['status']);
  });
});
