import axios from 'axios';

const API_URL = 'https://backend.librairie.slylatempete.fr'; // Replace with your actual API URL

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  name: string;
  email: string;
  token: string;
}

interface RegisterCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  }
  

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

// Function to handle user login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${API_URL}/auth/login`, credentials);
    if (response.data.status === 'success' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to handle user registration
export const registerUser = async (credentials: RegisterCredentials): Promise<void> => {
  try {
    const response = await axios.post<ApiResponse<RegisterResponse>>(`${API_URL}/auth/register`, credentials);
    if (response.data.status === 'success') {
      return
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};