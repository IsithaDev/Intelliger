import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUser } from "@/lib/models";

interface AuthState {
  author: IUser | null;
  access_token: string | null;
}

const initialState: AuthState = {
  author: null,
  access_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthor: (state, action: PayloadAction<{ user: IUser }>) => {
      state.author = action.payload.user;
    },
    receivedToken: (state, action: PayloadAction<{ access_token: string }>) => {
      state.access_token = action.payload.access_token;
    },
    logout: () => initialState,
  },
});

export const { setAuthor, receivedToken, logout } = authSlice.actions;
export const selectAuthor = (state: { auth: AuthState }) => state.auth.author;
export default authSlice.reducer;
