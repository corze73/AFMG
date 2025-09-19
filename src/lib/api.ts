import { PlayerData } from '../components/PlayerModal';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/.netlify/functions';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  profile_image_url?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// HTTP Client Class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await this.request<User>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      this.setToken(null);
      return null;
    }
  }

  async updateProfile(updates: { name?: string; profile_image_url?: string }): Promise<User> {
    const response = await this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  // Player methods
  async getPlayers(): Promise<PlayerData[]> {
    const response = await this.request<PlayerData[]>('/players');
    return response.data;
  }

  async createPlayer(player: Omit<PlayerData, 'id'>): Promise<PlayerData> {
    const response = await this.request<PlayerData>('/players', {
      method: 'POST',
      body: JSON.stringify(player),
    });
    return response.data;
  }

  async updatePlayer(id: string, player: Partial<PlayerData>): Promise<PlayerData> {
    const response = await this.request<PlayerData>(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(player),
    });
    return response.data;
  }

  async deletePlayer(id: string): Promise<void> {
    await this.request(`/players/${id}`, {
      method: 'DELETE',
    });
  }

  // Image upload method (will use Cloudinary)
  async uploadImage(file: File): Promise<string> {
    // Convert file to base64
    const fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      const response = await this.request<{ url: string; public_id: string }>('/upload', {
        method: 'POST',
        body: JSON.stringify({ file: fileData }),
      });

      return response.data.url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; database: boolean; auth: boolean }> {
    const response = await this.request<{ status: string; database: boolean; auth: boolean }>('/health');
    return response.data;
  }
}

// Enhanced error checking and logging
export const apiClient = (() => {
  if (!API_BASE_URL) {
    console.error('❌ CRITICAL: API base URL not found!');
    console.error('Please ensure the following environment variable is set:');
    console.error('- VITE_API_BASE_URL');
    return null;
  }

  if (API_BASE_URL === 'YOUR_API_BASE_URL') {
    console.error('❌ CRITICAL: Placeholder value detected in API_BASE_URL!');
    console.error('Please replace placeholder value with actual API URL.');
    return null;
  }

  try {
    const client = new ApiClient(API_BASE_URL);
    console.log('✅ API client initialized successfully');
    return client;
  } catch (error) {
    console.error('❌ CRITICAL: Failed to create API client:', error);
    return null;
  }
})();

// Export the client for use in components
export default apiClient;