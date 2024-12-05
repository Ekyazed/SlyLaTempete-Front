import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Author interface
interface Author {
  id: number;
  name: string;
}

// Book interface
interface Book {
  id: number;
  title: string;
  authors: Author[];
  genre: string;
  publication_date: string;
  is_read: boolean;
}

// Redux state for books
interface BookState {
  books: Book[];           // Array of books
  loading: boolean;        // Loading state
  error: string | null;    // Error state
  page: number;            // Current page
  pageSize: number;        // Items per page
  total: number;           // Total number of items
  totalPages: number;      // Total number of pages
}

// Initial state
const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
};

// Create the slice
const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    // Triggered when fetching books starts
    fetchBooksStart(state) {
      state.loading = true;
      state.error = null;
    },
    // Triggered when fetching books is successful
    fetchBooksSuccess(state, action: PayloadAction<{ books: Book[]; total: number; page: number; pageSize: number; totalPages: number }>) {
      const { books, total, page, pageSize, totalPages } = action.payload;
      state.books = books;
      state.total = total;
      state.page = page;
      state.pageSize = pageSize;
      state.totalPages = totalPages;
      state.loading = false;
    },
    // Triggered when fetching books fails
    fetchBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    // Triggered when a book is successfully added
    addBookSuccess(state, action: PayloadAction<Book>) {
      state.books.push(action.payload);
    },
    // Triggered when a book is successfully deleted
    deleteBookSuccess(state, action: PayloadAction<number>) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    // Toggle the read status of a book
    toggleBookReadUpdateStatus(state, action: PayloadAction<number>) {
      const book = state.books.find(book => book.id === action.payload);
      if (book) {
        book.is_read = !book.is_read;
      }
    },
    // Update a specific book in the state
    updateBookInState(state, action: PayloadAction<Book>) {
      const index = state.books.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    // Update pagination values in the state
    setPagination(state, action: PayloadAction<{ page: number; pageSize: number }>) {
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
    },
  },
});

// Export the actions
export const {
  fetchBooksStart,
  fetchBooksSuccess,
  fetchBooksFailure,
  addBookSuccess,
  deleteBookSuccess,
  toggleBookReadUpdateStatus,
  updateBookInState,
  setPagination,
} = bookSlice.actions;

// Export the reducer
export default bookSlice.reducer;
