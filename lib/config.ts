// Centralized configuration to replace hardcoded localhost URLs
// This ensures that when NEXT_PUBLIC_BASE_URL is set in production, the entire app respects it without fallback to localhost.

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
export const API_URL = `${BASE_URL}/api`;
