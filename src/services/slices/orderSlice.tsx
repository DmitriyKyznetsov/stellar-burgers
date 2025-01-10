import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrderByNumberApi } from '../../utils/burger-api';

interface OrderState {
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(orderNumber);
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
