import request from 'supertest';
import app from '../route/index';

describe('API Endpoints', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' });
    token = res.body.token;
  });

  afterAll(async () => {
  });

  test('GET /status', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'OK' });
  });

  test('GET /stats', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toBe(200);
  });

  test('POST /users', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'password' });
    expect(res.statusCode).toBe(201);
  });

  test('GET /connect', async () => {
    const res = await request(app)
      .get('/connect')
      .auth('test@example.com', 'password');
    expect(res.statusCode).toBe(200);
  });

  test('GET /disconnect', async () => {
    const res = await request(app)
      .get('/disconnect')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });

  test('GET /users/me', async () => {
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('POST /files', async () => {
    const res = await request(app)
      .post('/files')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'path/to/file');
    expect(res.statusCode).toBe(201);
  });

  test('GET /files/:id', async () => {
    const res = await request(app)
      .get('/files/somefileid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /files (pagination)', async () => {
    const res = await request(app)
      .get('/files?limit=10&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('PUT /files/:id/publish', async () => {
    const res = await request(app)
      .put('/files/somefileid/publish')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('PUT /files/:id/unpublish', async () => {
    const res = await request(app)
      .put('/files/somefileid/unpublish')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /files/:id/data', async () => {
    const res = await request(app)
      .get('/files/somefileid/data')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});

