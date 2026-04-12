import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { verifyAuth } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = verifyAuth(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const updatedCert = await Certificate.findByIdAndUpdate(params.id, data, { new: true });

    if (!updatedCert) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCert);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminId = verifyAuth(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const deletedCert = await Certificate.findByIdAndDelete(params.id);

    if (!deletedCert) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Certificate deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
