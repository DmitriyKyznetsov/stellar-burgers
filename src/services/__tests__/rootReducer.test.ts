import { combineReducers } from '@reduxjs/toolkit';
// Импорт редьюсера
import { rootReducer } from '../store';
// Импорт слайсов
import orderReducer from '../slices/orderSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import feedReducer from '../slices/feedSlice';
import burgerConstructorReducer from '../slices/burgerConstructorSlice';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import loginReducer from '../slices/loginSlice';

describe('Проверка rootReducer', () => {
  it('Проверка начального состояния', () => {
    // Список ключей редьюсеров
    const expectedReducerKeys = [
      'ingredients',
      'feed',
      'order',
      'burgerConstructor',
      'auth',
      'user',
      'login'
    ];

    // rootReducer без состояния (undefined), чтобы получить его начальное состояние
    const actualReducerKeys = Object.keys(rootReducer(undefined, { type: '' }));
    // Сравниваем с ключами, которые должны быть по умолчанию
    expect(actualReducerKeys).toEqual(expectedReducerKeys);
  });

  it('Должен включать все слайс-редьюсеры', () => {
    // Объект всех ожидаемых слайс-редьюсеров
    const expectedReducers = {
      ingredients: ingredientsReducer,
      feed: feedReducer,
      order: orderReducer,
      burgerConstructor: burgerConstructorReducer,
      auth: authReducer,
      user: userReducer,
      login: loginReducer
    };

    // Тестовый редьюсер со всеми слайс-редьюсерами
    const combinedReducers = combineReducers(expectedReducers);

    // Сравнение результата работы rootReducer и тестового редьюсера
    expect(rootReducer(undefined, { type: '' })).toEqual(
      combinedReducers(undefined, { type: '' })
    );
  });
});
