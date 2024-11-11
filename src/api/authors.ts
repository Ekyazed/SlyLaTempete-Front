// Author API Calls
import axios from 'axios';

const API_URL = 'http://backend.library.localhost'; // Replace with your actual API URL

axios.defaults.withCredentials = true;

// Create an instance of axios with pre-configured settings
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export interface Author {
  id: number;
  name: string;
}

// Function to get all authors
export const getAllAuthors = async (): Promise<Author[]> => {
  try {
    const response = await axiosInstance.get('/authors');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch authors');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to get an author by ID
export const getAuthorById = async (id: number): Promise<Author> => {
  try {
    const response = await axiosInstance.get(`/authors/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch author');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to add a new author
export const addAuthor = async (author: Omit<Author, 'id'>): Promise<Author> => {
  try {
    const response = await axiosInstance.post('/authors', author);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to add author');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to update an existing author
export const updateAuthor = async (id: number, author: Omit<Author, 'id'>): Promise<Author> => {
  try {
    const response = await axiosInstance.put(`/authors/${id}`, author);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to update author');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to delete an author by ID
export const deleteAuthor = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/authors/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to delete author');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};