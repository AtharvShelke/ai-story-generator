import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from '../utils';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Also intercept global axios to ensure consistency
axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Setup axios defaults
axios.defaults.baseURL = API_BASE_URL;

export default axiosClient;
