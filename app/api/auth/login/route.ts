import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password === 'S2World') {
      await connectDB();
      const admin = await Admin.findOne();
      const adminId = admin ? admin._id.toString() : 'admin_placeholder_id';

      const token = jwt.sign({ id: adminId }, JWT_SECRET, { expiresIn: '24h' });

      const response = NextResponse.json({ message: "Login successful", token });

      response.cookies.set('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({ message: 'INVALID_PASSWORD' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('[AUTH] Login Error:', error.message);
    return NextResponse.json({ message: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}
