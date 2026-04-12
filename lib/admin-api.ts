import { getCookie } from '@/lib/cookies';
import { safeStorage } from '@/lib/safe-storage';

const API_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? '/api'
    : (process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api` : 'http://localhost:5000/api');

// Tokens are now managed securely via HTTP-Only cookies
// credentials: 'include' handles the transmission of the cookie automatically
export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const logout = async () => {
    try {
        await fetch(`${API_URL}/admin/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        console.error('Logout failed:', e);
    }
};

export const verifyToken = async (token?: string | null) => {
    try {
        const response = await fetch(`${API_URL}/admin/verify`, {
            credentials: 'include'
        });
        if (!response.ok) return { valid: false };
        return response.json();
    } catch (error) {
        return { valid: false };
    }
};


export const fetchProjects = async () => {
    const response = await fetch(`${API_URL}/projects?t=${Date.now()}`, { cache: 'no-store' });
    return response.json();
};

export const fetchCertificates = async () => {
    const response = await fetch(`${API_URL}/certificates?t=${Date.now()}`, { cache: 'no-store' });
    return response.json();
};

export const createProject = async (data: any, token?: string | null) => {
    const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create project');
    return response.json();
};

export const updateProject = async (id: string, data: any, token?: string | null) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update project');
    return response.json();
};

export const deleteProject = async (id: string, token?: string | null) => {
    const response = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete project');
    return response.json();
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file); // Field name remains 'image' for backend consistency
    const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    return response.json(); // Returns { imageUrl: '...' } - we can use this for any file
};

export const createCertificate = async (data: any, token?: string | null) => {
    const response = await fetch(`${API_URL}/certificates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create certificate');
    return response.json();
};


export const updateCertificate = async (id: string, data: any, token?: string | null) => {
    const response = await fetch(`${API_URL}/certificates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update certificate');
    return response.json();
};

export const deleteCertificate = async (id: string, token?: string | null) => {
    const response = await fetch(`${API_URL}/certificates/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete certificate');
    return response.json();
};

export const sendMessage = async (data: any) => {
    const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
};

export const fetchMessages = async (token?: string | null) => {
    const response = await fetch(`${API_URL}/messages?t=${Date.now()}`, {
        credentials: 'include',
        cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
};

export const deleteMessage = async (id: string, token?: string | null) => {
    const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete message');
    return response.json();
};

