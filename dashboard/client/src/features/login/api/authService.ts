
export const connectWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/google`;
};

// const API_BASE_URL = 'http://localhost:5005/api/local-auth'; 
const API_BASE_URL = import.meta.env.FRONTEND_URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const localAuthService = {

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error during login process');
        if (data.session?.access_token) {
            localStorage.setItem('token', data.session.access_token);
        } else if (data.token) {
            localStorage.setItem('token', data.token);
        }

        return data;
    },

    createEmployee: async (email: string, name: string, phoneNumber: string, permissionIds: number[] = []) => {
        const response = await fetch(`${API_BASE_URL}/create-employee`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ email, name, phoneNumber, permissionIds })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error creating new employee');
        return data;
    },

    requestPasswordReset: async (email: string) => {
        const response = await fetch(`${API_BASE_URL}/request-password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error requesting password reset');
        return data;
    },

    setNewPassword: async (newPassword: string) => {
        const response = await fetch(`${API_BASE_URL}/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error setting new password');
        return data;
    },

    addNewPermission: async (name: string, description: string) => {
        const response = await fetch(`${API_BASE_URL}/add-permission`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, description })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error creating new permission');
        return data;
    }
};