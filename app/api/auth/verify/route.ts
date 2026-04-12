import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const adminId = verifyAuth(req);

  if (adminId) {
    return NextResponse.json({ valid: true, adminId });
  } else {
    return NextResponse.json({ valid: false, message: 'Not authorized' }, { status: 401 });
  }
}
