import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TLoginData, TRegisterData } from '@api';
import { handleTokens, clearTokens } from '../../utils/token';
import {
  forgotPasswordApi,
  resetPasswordApi,
  loginUserApi,
  registerUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setAuthentificated, unsetAuthentificated } from './authSlice';
import {
  setUser,
  clearUser,
  setUserLoading,
  unsetUserLoading
} from './userSlice';

// Для неавторизованных пользователей

type LoginState = {
  loading: boolean;
  error: string | null;
};

export const initialState: LoginState = {
  loading: true,
  error: null
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data: TLoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);

      handleTokens(response.accessToken, response.refreshToken);
      dispatch(setUser(response.user));
      dispatch(setAuthentificated());

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setUserLoading());
    try {
      await logoutApi();
      clearTokens();
      dispatch(clearUser());
      dispatch(unsetAuthentificated());
    } catch (err) {
      return rejectWithValue((err as Error).message);
    } finally {
      dispatch(unsetUserLoading());
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      handleTokens(response.accessToken, response.refreshToken);
      dispatch(setUser(response.user));
      dispatch(setAuthentificated());
      return response.user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'login/forgotPassword',
  async (email: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(email);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'login/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    setLoginLoading(state) {
      state.loading = true;
    },
    unsetLoginLoading(state) {
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Результат авторизации
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Результат регистрации
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Восстановление пароля (запрос)
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Восстановление пароля (подтверждение)
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Неизвестная ошибка';
        state.loading = false;
      })
      // Результат выхода из системы
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const { setError, setLoginLoading, unsetLoginLoading } =
  loginSlice.actions;
export default loginSlice.reducer;
