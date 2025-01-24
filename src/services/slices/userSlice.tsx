import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  updateUserApi,
  getOrdersApi
} from '../../utils/burger-api';
import { TUser, TOrder } from '@utils-types';
import { TRegisterData } from '@api';
import { RootState } from '../store';

// Для авторизованных пользователей

type UserState = {
  data: TUser | null;
  userOrders: TOrder[];
  loading: boolean;
  ordersLoading: boolean;
  error: string | null;
};

export const initialState: UserState = {
  data: null,
  userOrders: [],
  loading: true,
  ordersLoading: false,
  error: null
};

export const userDataSelector = (state: RootState) => state.user.data;
export const userOrdersSelector = (state: RootState) => state.user.userOrders;
export const ordersLoadingSelector = (state: RootState) =>
  state.user.ordersLoading;

// Получить пользователя по access-token
export const fetchUserDataThunk = createAsyncThunk(
  'user/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchUserOrdersThunk = createAsyncThunk(
  'user/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading(state) {
      state.loading = true;
    },
    unsetUserLoading(state) {
      state.loading = false;
    },
    setUser(state, action) {
      state.data = action.payload;
      state.loading = false;
    },
    clearUser(state) {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Загрузка пользователя
      .addCase(fetchUserDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Загрузка заказов
      .addCase(fetchUserOrdersThunk.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrdersThunk.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })
      // Обновление данных пользователя
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const { clearUser, setUser, setUserLoading, unsetUserLoading } =
  userSlice.actions;
export default userSlice.reducer;
