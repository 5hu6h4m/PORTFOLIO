// Centralized configuration to replace hardcoded localhost URLs
// Use NEXT_PUBLIC_BASE_URL if set, otherwise fallback to VERCEL_URL if in production, or empty string for relative paths.
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
                        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

export const API_URL = `${BASE_URL}/api`;
