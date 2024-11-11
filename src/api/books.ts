// Book API Calls
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

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  genre: string;
  publication_date: string;
  is_read: boolean;
}

// Function to get the last 10 added books
export const getLast10Books = async (): Promise<Book[]> => {
  try {
    const response = await axiosInstance.get('/books?limit=10&sort_column=title&sort_order=asc');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'Failed to fetch books');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to get all books with optional pagination
export const getAllBooks = async (page: number = 1, limit: number = 10): Promise<Book[]> => {
  try {
    const response = await axiosInstance.get(`/books?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch books');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const searchCollection = async (type: string, query: string) => {
  try {
    const response = await axiosInstance.get(`/books/search`, {
      params: {
        type,
        query,
      },
    });    
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch search results');
  }
};

// Function to add a new book
export const addBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  try {
    const response = await axiosInstance.post('/books', book);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to add book');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const updateBook = async (bookId: number, updatedData: Partial<Book>): Promise<Book> => {
  try {
    const response = await axiosInstance.put(`/books/${bookId}`, updatedData);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'Failed to update the book');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to delete a book by ID
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/books/${bookId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to delete book');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to toggle the read status of a book
export const toggleBookReadStatus = async (bookId: number): Promise<void> => {
  try {
    await axiosInstance.patch(`/books/${bookId}/toggle-read`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to toggle read status');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

// Function to retrieve statistics (total books, total authors, books read)
export const getStats = async (): Promise<{ total_books: number; total_authors: number; books_read: number }> => {
  try {
    const response = await axiosInstance.get('/stats');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch stats');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export const getBookByID = async(bookId: number): Promise<Book> => {
  try {
    const response = await axiosInstance.get(`/books/${bookId}`)
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch stats');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}