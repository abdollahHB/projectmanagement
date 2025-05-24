import axios from 'axios';
import { toast } from 'react-toastify';


// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = Bearer ${token};
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/users/me')
};

// Projects API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(/projects/${id}),
  create: (project) => api.post('/projects', project),
  update: (id, project) => api.put(/projects/${id}, project),
  delete: (id) => api.delete(/projects/${id}),
  addMember: (projectId, userId) => api.post(/projects/${projectId}/members/${userId}),
  removeMember: (projectId, userId) => api.delete(/projects/${projectId}/members/${userId}),
  changeProjectLead: (projectId, leadId) => api.put(/projects/${projectId}/lead, { leadId }),
  // Add these methods if they don't exist and backend supports them
  getMembers: (projectId) => api.get(/projects/${projectId}/members),
  updateMemberRole: (projectId, userId, role) => api.put(/projects/${projectId}/members/${userId}/role, { role })
};

// Tasks API
export const taskAPI = {
  getAll: (projectId) => api.get(/tasks/project/${projectId}),
  getById: (id) => api.get(/tasks/${id}),
  create: (task, projectId) => api.post(/tasks?projectId=${projectId}, task),
  update: (id, task) => api.put(/tasks/${id}, task),
  delete: (id) => api.delete(/tasks/${id}),
  updateStatus: (id, status) => api.patch(/tasks/${id}/status, { status: status }),
  assignTask: (taskId, assigneeId) => api.patch(/tasks/${taskId}/assign, { assigneeId }),
  getAssigned: () => api.get('/tasks/assigned'),
  getBySprint: (sprintId) => api.get(/tasks/sprint/${sprintId}),
  updatePriority: (id, priority) => api.patch(/tasks/${id}/priority, { priority })
};

// Comments API
export const commentAPI = {
  getByTask: (taskId) => api.get(/comments/task/${taskId}),
  create: (comment, taskId) => api.post(/comments?taskId=${taskId}, comment),
  update: (id, comment) => api.put(/comments/${id}, comment),
  delete: (id) => api.delete(/comments/${id})
};

// Users API
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(/users/${id}),
  update: (id, userData) => api.put(/users/${id}, userData),
  delete: (id) => api.delete(/users/${id}),
  findByEmail: (email) => api.get(/users/email?email=${encodeURIComponent(email)})
};

// Sprints API
export const sprintAPI = {
  getByProject: (projectId) => api.get(/sprints/project/${projectId}),
  getById: (id) => api.get(/sprints/${id}),
  create: (sprint, projectId) => api.post(/sprints?projectId=${projectId}, sprint),
  update: (id, sprint) => api.put(/sprints/${id}, sprint),
  delete: (id) => api.delete(/sprints/${id}),
  start: (id) => api.post(/sprints/${id}/start),
  complete: (id) => api.post(/sprints/…
