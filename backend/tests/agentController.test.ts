import request from 'supertest';
import express from 'express';
import { processCommand } from '../controllers/agentController';

const app = express();
app.use(express.json());
app.post('/api/agent/command', (req, res, next) => {
  // Mock req.user for testing
  (req as any).user = { id: 1 };
  next();
}, processCommand);

// Mock the DB and fetch
jest.mock('../config/db', () => ({
  db: {
    all: jest.fn((query, params, cb) => cb(null, [])),
    run: jest.fn((query, params, cb) => cb(null)),
    get: jest.fn((query, params, cb) => cb(null, {}))
  }
}));

global.fetch = jest.fn();

describe('Agent Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no command or image is provided', async () => {
    const res = await request(app).post('/api/agent/command').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Command or Image is required');
  });

  it('should return error gracefully when python agent is down', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Connection refused'));

    const res = await request(app)
      .post('/api/agent/command')
      .send({ command: 'Hello' });

    expect(res.status).toBe(500);
    expect(res.body.actionType).toBe('ERROR');
    expect(res.body.message).toContain('Failed to connect to AI Agent');
  });

  it('should process successful response from python agent', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ actionType: 'CHAT', message: 'Hello from AI', data: {} })
    });

    const res = await request(app)
      .post('/api/agent/command')
      .send({ command: 'Hello' });

    expect(res.status).toBe(200);
    expect(res.body.actionType).toBe('CHAT');
    expect(res.body.message).toBe('Hello from AI');
  });
});
