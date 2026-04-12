import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export function verifyAuth(req: NextRequest) {
  try {
    const token = req.cookies.get('adminToken')?.value || 
                  req.headers.get('authorization')?.split(' ')[1];

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (error) {
    return null;
  }
}
