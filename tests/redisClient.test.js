import redisClient from '../utils/redis';

describe('redisClient', () => {
  beforeAll(() => {
  });

  afterAll(() => {
    redisClient.quit();
  });

  test('should set and get a value from Redis', async () => {
    await redisClient.set('test_key', 'test_value');
    const value = await redisClient.get('test_key');
    expect(value).toBe('test_value');
  });

  test('should delete a value from Redis', async () => {
    await redisClient.set('test_key', 'test_value');
    await redisClient.del('test_key');
    const value = await redisClient.get('test_key');
    expect(value).toBeNull();
  });
});

