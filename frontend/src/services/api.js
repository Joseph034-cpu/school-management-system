import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to every request
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

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Auth endpoints
export const auth = {
    login: (data) => api.post('/auth/login', data),
    signup: (data) => api.post('/auth/signup', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    getSecurityQuestion: (data) => api.post('/auth/security-question', data),
};

// Student endpoints
export const students = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students', data),
    delete: (id) => api.delete(`/students/${id}`),
    search: (query) => api.get(`/students/search/${query}`),
};

// Course endpoints
export const courses = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    create: (data) => api.post('/courses', data),
    delete: (id) => api.delete(`/courses/${id}`),
};

// Attendance endpoints
export const attendance = {
    getAll: () => api.get('/attendance'),
    getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
    create: (data) => api.post('/attendance', data),
    delete: (id) => api.delete(`/attendance/${id}`),
};

// Fee endpoints
export const fees = {
    getAll: () => api.get('/fees'),
    getByStudent: (studentId) => api.get(`/fees/student/${studentId}`),
    create: (data) => api.post('/fees', data),
    delete: (id) => api.delete(`/fees/${id}`),
};

// Result endpoints
export const results = {
    getAll: () => api.get('/results'),
    getByStudent: (studentId) => api.get(`/results/student/${studentId}`),
    create: (data) => api.post('/results', data),
    delete: (id) => api.delete(`/results/${id}`),
};

// User endpoints (Admin only)
export const users = {
    getAll: () => api.get('/users'),
    createLecturer: (data) => api.post('/users/lecturer', data),
    delete: (username) => api.delete(`/users/${username}`),
    resetPassword: (data) => api.post('/users/reset-password', data),
};

// Add to the existing file
export const timetable = {
    getAll: () => api.get('/timetable'),
    create: (data) => api.post('/timetable', data),
    delete: (id) => api.delete(`/timetable/${id}`)
};