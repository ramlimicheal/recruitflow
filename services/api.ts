const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper to get auth headers
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

// Helper for API calls
const apiCall = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: any
) => {
    const options: RequestInit = {
        method,
        headers: getHeaders()
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API Error');
    }

    return data;
};

// AUTH
export const authAPI = {
    login: (email: string, password: string) =>
        fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(r => r.json()),

    register: (email: string, name: string, password: string, role: string) =>
        fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password, role })
        }).then(r => r.json()),

    getMe: () => apiCall('/api/auth/me', 'GET')
};

// CANDIDATES
export const candidateAPI = {
    getAll: () => apiCall('/api/candidates', 'GET'),
    getById: (id: string) => apiCall(`/api/candidates/${id}`, 'GET'),
    create: (candidate: any) => apiCall('/api/candidates', 'POST', candidate),
    update: (id: string, updates: any) => apiCall(`/api/candidates/${id}`, 'PUT', updates),
    changeStage: (id: string, newStage: string) =>
        apiCall(`/api/candidates/${id}/stage`, 'PATCH', { new_stage: newStage }),
    delete: (id: string) => apiCall(`/api/candidates/${id}`, 'DELETE')
};

// TASKS
export const taskAPI = {
    getAll: () => apiCall('/api/tasks', 'GET'),
    getMy: () => apiCall('/api/tasks/user/me', 'GET'),
    create: (task: any) => apiCall('/api/tasks', 'POST', task),
    update: (id: string, updates: any) => apiCall(`/api/tasks/${id}`, 'PUT', updates),
    delete: (id: string) => apiCall(`/api/tasks/${id}`, 'DELETE')
};

// CHAT
export const chatAPI = {
    getChannels: () => apiCall('/api/chat/channels', 'GET'),
    createChannel: (name: string, description: string, type: string = 'team') =>
        apiCall('/api/chat/channels', 'POST', { name, description, type }),
    getMessages: (channelId: string) =>
        apiCall(`/api/chat/channels/${channelId}/messages`, 'GET'),
    sendMessage: (channelId: string, text: string, mentions: string[] = [], attachments: string[] = []) =>
        apiCall(`/api/chat/channels/${channelId}/messages`, 'POST', {
            text,
            mentions,
            attachments
        })
};

// NOTIFICATIONS
export const notificationAPI = {
    getAll: () => apiCall('/api/notifications', 'GET'),
    markAsRead: (id: string) => apiCall(`/api/notifications/${id}/read`, 'PATCH')
};

// ACTIVITIES
export const activityAPI = {
    getAll: () => apiCall('/api/activities', 'GET'),
    getByEntity: (entityType: string, entityId: string) =>
        apiCall(`/api/activities/entity/${entityType}/${entityId}`, 'GET')
};

// USERS
export const userAPI = {
    getAll: () => apiCall('/api/users', 'GET'),
    getById: (id: string) => apiCall(`/api/users/${id}`, 'GET'),
    update: (id: string, updates: any) => apiCall(`/api/users/${id}`, 'PUT', updates)
};

export default {
    authAPI,
    candidateAPI,
    taskAPI,
    chatAPI,
    notificationAPI,
    activityAPI,
    userAPI
};