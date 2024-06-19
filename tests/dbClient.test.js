import DBClient from '../utils/db';
import { MongoClient } from 'mongodb';

describe('dbClient', () => {
  beforeAll(async () => {
    await DBClient.connect();
  });

  afterAll(async () => {
    await DBClient.db.collection('test').deleteMany({});
    await DBClient.close();
  });

  test('should insert and find a document in MongoDB', async () => {
    const collection = DBClient.db.collection('test');
    await collection.insertOne({ name: 'test_name' });
    const document = await collection.findOne({ name: 'test_name' });
    expect(document).not.toBeNull();
    expect(document.name).toBe('test_name');
  });

  test('should delete a document in MongoDB', async () => {
    const collection = DBClient.db.collection('test');
    await collection.insertOne({ name: 'test_name' });
    await collection.deleteOne({ name: 'test_name' });
    const document = await collection.findOne({ name: 'test_name' });
    expect(document).toBeNull();
  });
});

