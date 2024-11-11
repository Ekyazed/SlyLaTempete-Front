import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Author {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  genre: string;
  publication_date: string;
  is_read: boolean;
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    fetchBooksStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
      state.loading = false;
    },
    fetchBooksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addBookSuccess(state, action: PayloadAction<Book>) {
      state.books.push(action.payload);
    },
    deleteBookSuccess(state, action: PayloadAction<number>) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    toggleBookReadUpdateStatus(state, action: PayloadAction<number>) {
      const book = state.books.find(book => book.id === action.payload);
      if (book) {
        book.is_read = !book.is_read;
      }
    },
    updateBookInState: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
  },
});

export const { fetchBooksStart, fetchBooksSuccess, fetchBooksFailure, addBookSuccess, deleteBookSuccess, toggleBookReadUpdateStatus, updateBookInState } = bookSlice.actions;
export default bookSlice.reducer;