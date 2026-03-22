import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUserProfile {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  promptCount?: number;
  followersCount?: number;
  followingCount?: number;
  reputationScore?: number;
}

export interface AuthUser {
  id: string;
  username: string;
  slug: string;
  email: string;
  status?: string;
  roles?: string[];
  permissions?: string[];
  createdOn?: string;
  profile?: AuthUserProfile | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  isLoading: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: AuthUser }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.isLoading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.isInitialized = true;
      state.isLoading = false;
    },
    setAccessToken(
      state,
      action: PayloadAction<{ accessToken: string | null }>,
    ) {
      state.accessToken = action.payload.accessToken;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.isInitialized = true;
      state.isLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setInitialized(state, action: PayloadAction<boolean | undefined>) {
      state.isInitialized = action.payload ?? true;
    },
  },
});

export const {
  setAuth,
  logout,
  setAccessToken,
  clearAuth,
  setAuthLoading,
  setInitialized,
} = authSlice.actions;
export default authSlice.reducer;
