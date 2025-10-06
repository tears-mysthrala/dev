import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from './dbConnect';

export interface AuthUser {
  _id: string;
  email: string;
  level: string;
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    await dbConnect();
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return null;
    return {
      _id: user._id.toString(),
      email: user.email,
      level: user.level
    };
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}