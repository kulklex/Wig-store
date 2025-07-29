import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('user');

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: true,
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
