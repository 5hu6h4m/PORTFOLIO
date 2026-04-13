import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { verifyAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const adminId = verifyAuth(req);
    if (!adminId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio_2026',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve(NextResponse.json({ message: 'Upload failed', error: error.message }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ imageUrl: result?.secure_url }, { status: 200 }));
          }
        }
      );

      uploadStream.end(buffer);
    });

  } catch (error: any) {
    console.error('Upload Route Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Set runtime to nodejs for Cloudinary stream support
export const runtime = 'nodejs';
