import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  message?: string;
}

export const authClient = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>('/signup', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await authApi.post<AuthResponse>('/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await authApi.post('/logout');
  },

  me: async (): Promise<User> => {
    // Use native fetch to avoid browser logging 401 as error
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Functionally handle non-authenticated state
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    
    // Parse and return user data
    if (response.ok) {
      const data: AuthResponse = await response.json();
      return data.data;
    }
    
    throw new Error('Failed to fetch user data');
  },
};

