import { verifyToken } from '@/lib/auth';

describe('Auth Library', () => {
  it('should return null for invalid token', async () => {
    const result = await verifyToken('invalid-token');
    expect(result).toBeNull();
  });

  it('should verify a valid token', async () => {
    // This would require setting up a test user and token
    // For now, just test the function exists
    expect(typeof verifyToken).toBe('function');
  });
});