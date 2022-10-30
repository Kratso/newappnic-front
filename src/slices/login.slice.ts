import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store/store";

import AuthService from "../services/auth.service";

export interface User {
  id: number;
  name?: string;
  email?: string;
  access_token?: string;
  password?: string;
}

export interface UserStatus {
  status: "idle" | "loading" | "OK" | "KO";
  error: string | null | undefined;
}

export interface UserState {
  status: UserStatus;
  user: User | null;
}

const initialState: UserState = {
  status: {
    status: "idle",
    error: null,
  },
  user: null,
};

const userData = createSlice({
  name: "userData",
  initialState,
  reducers: {
    login(state, action) {
      const { user, status } = action.payload;

      state.status = status;
      if (user) {
        state.user = user;
      }
    },
    logout(state, action) {
      state = initialState;
    },
    register(state, action) {},
  },
  extraReducers(builder) {
    builder
      .addCase(loginMiddle.pending, (state, actions) => {
        state.status.status = "loading";
      })
      .addCase(loginMiddle.fulfilled, (state, action) => {
        state.status.status = "OK";
        // Add the user to the state
        
        state.user = action.payload.user;
      })
      .addCase(loginMiddle.rejected, (state, action) => {
        state.status.status = "KO";
        state.status.error = action.error.message;
      });
  },
});

export const { login, logout, register } = userData.actions;

export default userData.reducer;

export const selectUser: (state: RootState) => UserState = (state: RootState) =>
  state.userData;

export const loginMiddle = createAsyncThunk<
  UserState,
  { email: string; password: string }
>("userData/login", async (authData) => {
  const { email, password } = authData;
  return await AuthService.login(email, password);
});

export const registerMiddle = createAsyncThunk<
  any,
  { username: string; email: string; password: string; passwordConfirm: string }
>("userData/register", async (authData) => {
    const {username, email, password, passwordConfirm} = authData
    return await AuthService.register(username, email, password, passwordConfirm);
});