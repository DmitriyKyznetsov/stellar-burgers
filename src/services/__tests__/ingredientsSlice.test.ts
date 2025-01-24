import ingredientsReducer, {
  fetchIngredients,
  initialState
} from '../slices/ingredientsSlice';

// Мокаем API
jest.mock('../../utils/burger-api');
import { getIngredientsApi } from '../../utils/burger-api';

describe('ingredientsSlice', () => {
  // Начальные данные для мока
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
    }
  ];

  // Общая переменная состояния
  let newState: typeof initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    newState = { ...initialState };
  });

  it('Состояние при fetchIngredients.pending', () => {
    newState = ingredientsReducer(
      newState,
      fetchIngredients.pending('', undefined)
    );

    // Проверка состояния после pending
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
    expect(newState.items).toEqual([]);
  });

  it('Состояние при fetchIngredients.fulfilled', () => {
    // Мокаем успешный ответ от API
    (getIngredientsApi as jest.Mock).mockResolvedValueOnce(mockIngredients);

    newState = ingredientsReducer(
      newState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    // Проверка состояния после fulfilled
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.items).toEqual(mockIngredients);
  });

  it('Состояние при fetchIngredients.rejected', () => {
    // Мокаем ошибку от API
    const errorMessage = 'Ошибка при загрузке ингредиентов';
    (getIngredientsApi as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Мокаем rejected с передачей объекта ошибки
    const error = new Error(errorMessage);
    newState = ingredientsReducer(
      newState,
      fetchIngredients.rejected(error, '', undefined)
    );

    // Проверка состояния после rejected
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe(errorMessage);
    expect(newState.items).toEqual([]);
  });
});
