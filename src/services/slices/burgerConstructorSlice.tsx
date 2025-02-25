import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction
} from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { orderBurgerApi } from '../../utils/burger-api';
import { TIngredient, TOrder, TConstructorIngredient } from '@utils-types';

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderModalData: TOrder | null;
  orderRequest: boolean;
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderModalData: null,
  orderRequest: false
};

export const placeOrder = createAsyncThunk(
  'burgerConstructor/placeOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addIngredient = createAction(
  'burgerConstructor/addIngredient',
  (ingredient: TIngredient) => ({
    payload: {
      ...ingredient,
      id: v4()
    }
  })
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        addIngredient,
        (state, action: PayloadAction<TConstructorIngredient>) => {
          const ingredient = action.payload;
          if (ingredient.type === 'bun') {
            state.bun = ingredient;
          } else {
            state.ingredients.push(ingredient);
          }
        }
      )
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(placeOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  // addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
