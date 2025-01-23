import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from '../../utils/cookie';
import { refreshTokens } from '../../utils/token';
import { RootState } from '../store';
import { fetchUserDataThunk } from './userSlice';
import { setLoginLoading, unsetLoginLoading } from './loginSlice';

// Для автоматической авторизации

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true,
  error: null
};

export const authLoadingCheckSelector = (state: RootState) =>
  state.auth.loading;

// Проверка авторизации
export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = getCookie('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available.');
      }

      if (!accessToken) {
        await refreshTokens();
      }

      await dispatch(fetchUserDataThunk());

      return true;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    } finally {
      dispatch(unsetLoginLoading());
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.loading = true;
    },
    unsetAuthLoading(state) {
      state.loading = false;
    },
    setAuthentificated(state) {
      state.isAuthenticated = true;
    },
    unsetAuthentificated(state) {
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const {
  setAuthentificated,
  unsetAuthentificated,
  setAuthLoading,
  unsetAuthLoading
} = authSlice.actions;
export default authSlice.reducer;
