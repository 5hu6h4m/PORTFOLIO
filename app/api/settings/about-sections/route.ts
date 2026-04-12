import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AboutSettings from '@/models/AboutSettings';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    let settings = await AboutSettings.findOne();
    
    // If no settings exist yet, create default entry
    if (!settings) {
      settings = await AboutSettings.create({
        showGithub: true,
        showLeetcode: false,
        showCustom: true,
        customTitle: 'Currently Leveling Up',
        customDesc: 'Building real-world projects, sharpening DSA skills, and working toward 200+ LeetCode problems.'
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminId = verifyAuth(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();
    const updatedSettings = await AboutSettings.findOneAndUpdate({}, data, { new: true, upsert: true });

    return NextResponse.json(updatedSettings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
