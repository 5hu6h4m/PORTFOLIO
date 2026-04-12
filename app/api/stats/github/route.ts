import { NextResponse } from 'next/server';

let cache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
    try {
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
            return NextResponse.json(cache.data);
        }

        const [userRes, eventsRes] = await Promise.all([
            fetch('https://api.github.com/users/5hu6h4m', { next: { revalidate: 3600 } }),
            fetch('https://api.github.com/users/5hu6h4m/events/public', { next: { revalidate: 3600 } })
        ]);

        if (!userRes.ok) throw new Error('GitHub API Fetch Failed');

        const userData = await userRes.json();
        const events = await eventsRes.json();
        const lastEvent = Array.isArray(events) 
            ? events.find((e: any) => e.type === 'PushEvent' || e.type === 'CreateEvent')
            : null;
        
        const enhancedData = {
            ...userData,
            lastActivity: lastEvent?.created_at || userData.updated_at,
            stars: 18,
            commits: 332,
            prs: 22,
            languages: [
                { name: 'Python', percent: 56.48, color: '#3572A5' },
                { name: 'Jupyter', percent: 30.51, color: '#DA5B0B' },
                { name: 'HTML', percent: 1.68, color: '#e34c26' },
                { name: 'JS', percent: 1.60, color: '#f1e05a' },
            ]
        };

        cache = { data: enhancedData, timestamp: Date.now() };
        return NextResponse.json(enhancedData);
    } catch (error) {
        return NextResponse.json({ error: 'Stats temporarily unavailable' }, { status: 500 });
    }
}
