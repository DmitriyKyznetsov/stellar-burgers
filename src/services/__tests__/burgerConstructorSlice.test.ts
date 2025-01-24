import { configureStore } from '@reduxjs/toolkit';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../slices/burgerConstructorSlice';
import { v4 as uuidv4 } from 'uuid';

// Мокаем UUID
jest.mock('uuid', () => ({
  v4: jest.fn()
}));

describe('Тестирование экшенов burgerConstructorSlice', () => {
  const mockIngredients = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '2',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
      __v: 0
    },
    {
      _id: '3',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
      __v: 0
    },
    {
      _id: '4',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      __v: 0
    }
  ];

  const createTestStore = () =>
    configureStore({
      reducer: { burgerConstructor: burgerConstructorReducer }
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Обработка экшена добавления ингредиента', () => {
    const store = createTestStore();
    const mockedBun = mockIngredients[0];
    const mockedIngredient = mockIngredients[2];
    const mockedUuid = 'mocked-uuid';

    // Мокаем UUID
    (uuidv4 as jest.Mock).mockReturnValue(mockedUuid);

    // Сборка бургера
    store.dispatch(addIngredient(mockedBun));
    store.dispatch(addIngredient(mockedIngredient));

    const state = store.getState().burgerConstructor;

    // Проверка наличия в стейте добавленных ингредиентов
    expect(state.bun).toEqual({ ...mockedBun, id: mockedUuid });
    expect(state.ingredients).toEqual([
      { ...mockedIngredient, id: mockedUuid }
    ]);
  });

  it('Обработка экшена удаления ингредиента', () => {
    const store = createTestStore();
    const mockedIngredient = { ...mockIngredients[3] };

    store.dispatch(addIngredient(mockedIngredient));
    expect(store.getState().burgerConstructor.ingredients).toHaveLength(1);

    // Удаляем ингредиент
    store.dispatch(removeIngredient(0));

    // Проверка удаления ингредиента
    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toEqual([]);
  });

  it('Обработка экшена изменения порядка ингредиентов', () => {
    const store = createTestStore();
    const firstIngredient = { ...mockIngredients[2], id: 'mocked-uuid-1' };
    const secondIngredient = { ...mockIngredients[3], id: 'mocked-uuid-2' };

    // Мокаем UUID для ингредиентов и добавляем их в стор
    (uuidv4 as jest.Mock).mockReturnValueOnce('mocked-uuid-1');
    store.dispatch(addIngredient(firstIngredient));

    (uuidv4 as jest.Mock).mockReturnValueOnce('mocked-uuid-2');
    store.dispatch(addIngredient(secondIngredient));

    // Меняем порядок ингредиентов
    store.dispatch(moveIngredient({ fromIndex: 0, toIndex: 1 }));

    // Проверяем, что ингредиенты изменили порядок
    const state = store.getState().burgerConstructor;
    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });
});
