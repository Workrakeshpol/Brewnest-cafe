import request from 'supertest';
import app from '../src/app';

describe('Health Check Endpoint', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/healthz');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('services');
    expect(response.body.services).toMatchObject({ database: 'up', cache: 'up' });
  });
});
