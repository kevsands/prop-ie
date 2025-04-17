import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await api.get(`/auth/verify/${token}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during email verification' };
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during password reset request' };
    }
  },
  
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred during password reset' };
    }
  },
  
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching profile' };
    }
  },
  
  updateProfile: async (userData: { firstName?: string; lastName?: string }) => {
    try {
      const response = await api.put('/auth/me', userData);
      
      // Update user in localStorage
      if (response.data.success && response.data.data) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...user,
          ...response.data.data
        }));
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while updating profile' };
    }
  },
  
  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/auth/change-password', passwords);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while changing password' };
    }
  }
};

// Property API calls
export const propertyAPI = {
  getProperties: async () => {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching properties' };
    }
  },
  
  getProperty: async (id: string) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching property' };
    }
  },
  
  getPropertiesByProject: async (projectId: string) => {
    try {
      const response = await api.get(`/properties/project/${projectId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching project properties' };
    }
  }
};

// Purchase API calls
export const purchaseAPI = {
  createPurchase: async (purchaseData: { propertyId: string; bookingDeposit?: number }) => {
    try {
      const response = await api.post('/purchases', purchaseData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while creating purchase' };
    }
  },
  
  getBuyerPurchases: async () => {
    try {
      const response = await api.get('/purchases/buyer');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching purchases' };
    }
  },
  
  getPurchase: async (id: string) => {
    try {
      const response = await api.get(`/purchases/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'An error occurred while fetching purchase details' };
    }
  }
};

export default api;
