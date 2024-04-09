import supertest from 'supertest';
import { app } from '../../app';
import Post from '../models/Post';
import User from '../models/User';
import { connectToDatabase, disconnectFromDatabase } from '../utils/database';

const api = supertest(app);

describe('Posts', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password' });
      const post = await Post.create({ author: user._id, content: 'Test post' });

      const response = await api.get('/api/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].content).toBe('Test post');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password' });
      const payload = {
        userId: user._id,
        content: 'New test post',
      };

      const response = await api.post('/api/posts').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('New test post');
    });
  });

  // Add more tests for other routes and functionality
});