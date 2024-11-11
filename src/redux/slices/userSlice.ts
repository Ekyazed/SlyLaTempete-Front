import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function isCookiePresent(name: string): boolean {
  return document.cookie.split(';').some((cookie) => cookie.trim().startsWith(`${name}=`));
}

interface UserState {
  isLoggedIn: boolean;
  name: string;
  email: string;
}

const initialState: UserState = {
  isLoggedIn: isCookiePresent('auth_token'),
  name: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string; token: string }>) => {
      state.isLoggedIn = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.name = '';
      state.email = '';
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;