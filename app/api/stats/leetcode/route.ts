import { NextResponse } from 'next/server';

// Simple in-memory cache
let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
    try {
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
            return NextResponse.json(cache.data);
        }

        const response = await fetch('https://leetcode-api-faisalshohag.vercel.app/shubham_jadhav06', {
            next: { revalidate: 3600 } // ISR for 1 hour
        });
        
        if (!response.ok) throw new Error('LeetCode API Fetch Failed');
        
        const data = await response.json();
        cache = { data, timestamp: Date.now() };
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Stats temporarily unavailable' }, { status: 500 });
    }
}
