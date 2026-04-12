import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    return NextResponse.json(certificates);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminId = verifyAuth(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const newCert = new Certificate(data);
    await newCert.save();

    return NextResponse.json(newCert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
