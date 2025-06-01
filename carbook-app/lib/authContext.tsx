import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from './api';

type User = { id: number; email: string; role: string } | null;

const AuthContext = createContext<{
    user: User;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .refreshToken()
            .then(async () => {
                const res = await api.fetchWithAuth('/users/me');
                if (res.ok) {
                    setUser(await res.json());
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        await api.login(email, password);
        const res = await api.fetchWithAuth('/users/me');
        setUser(await res.json());
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
