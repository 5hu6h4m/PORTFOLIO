import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || '';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/about-sections`, {
      next: { revalidate: 5 } // Re-fetch every 5 seconds so admin changes apply fast
    });
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Return safe defaults if backend is down
    return NextResponse.json({
      showGithub: true,
      showLeetcode: false,
      showCustom: true,
      customTitle: 'Currently Leveling Up',
      customDesc: 'Building real-world projects, sharpening DSA skills, and working toward 200+ LeetCode problems.'
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const token = req.headers.get('authorization');
    const res = await fetch(`${BACKEND_URL}/api/settings/about-sections`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {})
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
