import { POST } from '@/app/api/auth/login/route';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

// Mock the dependencies
jest.mock('@/models/User');
jest.mock('@/lib/dbConnect');
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: 'hashedpassword',
  level: 'N5',
};

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for non-existent user', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Invalid credentials');
  });

  it('should return 400 for wrong password', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const bcrypt = require('bcryptjs');
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe('Invalid credentials');
  });

  it('should return token for valid credentials', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    const bcrypt = require('bcryptjs');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const jwt = require('jsonwebtoken');
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const request = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.token).toBe('mocktoken');
    expect(data.user.email).toBe('test@example.com');
  });
});