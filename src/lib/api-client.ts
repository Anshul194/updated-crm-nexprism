import axios from 'axios';

const getBaseURL = () => {
    const envURL = (import.meta as any).env.VITE_API_URL;
    if (envURL) return envURL;

    // In production (on Vercel), if no VITE_API_URL is set, 
    // we should NOT default to localhost as it triggers browser security warnings.
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        console.warn('⚠️ VITE_API_URL is not defined in Production environment variables!');
        // Return a relative path or an empty string to avoid "Private Network Access" popup
        return '/api';
    }

    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('📡 API Client Initialized with URL:', api.defaults.baseURL);

// Request interceptor for auth token (if needed in future)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        // You could trigger a toast here if you have access to a global toast state
        return Promise.reject(new Error(message));
    }
);

export default api;
