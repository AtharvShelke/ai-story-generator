import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null, // { id, username, points }
    token: localStorage.getItem('token') || null,
    setAuth: (user, token) => {
        if (token) localStorage.setItem('token', token);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
    setUser: (user) => set({ user }),
}));
