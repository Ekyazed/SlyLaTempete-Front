import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Author {
  id: number;
  name: string;
}

interface AuthorState {
  authors: Author[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthorState = {
  authors: [],
  loading: false,
  error: null,
};

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    fetchAuthorsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAuthorsSuccess(state, action: PayloadAction<Author[]>) {
      state.authors = action.payload;
      state.loading = false;
    },
    fetchAuthorsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addAuthorSuccess(state, action: PayloadAction<Author>) {
      state.authors.push(action.payload);
    },
    deleteAuthorSuccess(state, action: PayloadAction<number>) {
      state.authors = state.authors.filter(author => author.id !== action.payload);
    },
    updateAuthorSuccess(state, action: PayloadAction<Author>) {
      const index = state.authors.findIndex(author => author.id === action.payload.id);
      if (index !== -1) {
        state.authors[index] = action.payload;
      }
    },
  },
});

export const {
  fetchAuthorsStart,
  fetchAuthorsSuccess,
  fetchAuthorsFailure,
  addAuthorSuccess,
  deleteAuthorSuccess,
  updateAuthorSuccess,
} = authorSlice.actions;

export default authorSlice.reducer;