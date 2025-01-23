import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Новые слайсы
import orderReducer from './slices/orderSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import loginReducer from './slices/loginSlice';

//const rootReducer = () => {}; // Заменить на импорт настоящего редьюсера

// "Настоящий" редьюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  order: orderReducer,
  burgerConstructor: burgerConstructorReducer,
  auth: authReducer,
  user: userReducer,
  login: loginReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
