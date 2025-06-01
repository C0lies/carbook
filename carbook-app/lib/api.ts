import storage from './storage';

const API_URL = 'http://localhost:4000/api';

let accessToken: string | null = null;

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.accessToken) {
        accessToken = data.accessToken;
        await storage.setItem('accessToken', accessToken);
        return true;
    }
    throw new Error(data.message || 'Login failed');
}

export async function logout() {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    accessToken = null;
    await storage.removeItem('accessToken');
}

export async function refreshToken() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
    });
    const data = await res.json();
    if (res.ok && data.accessToken) {
        accessToken = data.accessToken;
        await storage.setItem('accessToken', accessToken);
        return true;
    }
    throw new Error('Refresh failed');
}

export async function fetchWithAuth(input: string, init: RequestInit = {}) {
    if (!accessToken) {
        accessToken = await storage.getItem('accessToken');
    }
    let res = await fetch(`${API_URL}${input}`, {
        ...init,
        headers: {
            ...(init.headers || {}),
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });
    if (res.status === 403 || res.status === 401) {
        try {
            await refreshToken();
            res = await fetch(`${API_URL}${input}`, {
                ...init,
                headers: {
                    ...(init.headers || {}),
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: 'include',
            });
        } catch {
            throw new Error('Session expired');
        }
    }
    return res;
}
