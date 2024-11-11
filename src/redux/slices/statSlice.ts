// Stats Redux Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatsState {
  totalBooks: number;
  totalAuthors: number;
  booksRead: number;
}

const initialState: StatsState = {
  totalBooks: 0,
  totalAuthors: 0,
  booksRead: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setTotalBooks(state, action: PayloadAction<number>) {
      console.log('Updating totalBooks:', action.payload);
      state.totalBooks = action.payload;
    },
    setTotalAuthors(state, action: PayloadAction<number>) {
      console.log('Updating totalAuthors:', action.payload);
      state.totalAuthors = action.payload;
    },
    setBooksRead(state, action: PayloadAction<number>) {
      console.log('Updating booksRead:', action.payload);
      state.booksRead = action.payload;
    },
    updateStats(state, action: PayloadAction<Partial<StatsState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setTotalBooks, setTotalAuthors, setBooksRead, updateStats } = statsSlice.actions;
export default statsSlice.reducer;