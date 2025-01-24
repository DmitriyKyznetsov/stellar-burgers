import userReducer, {
  fetchUserDataThunk,
  fetchUserOrdersThunk,
  updateUserThunk,
  clearUser,
  setUser,
  setUserLoading,
  unsetUserLoading,
  initialState
} from '../slices/userSlice';

// Мокаем API
jest.mock('../../utils/burger-api');
import {
  getUserApi,
  getOrdersApi,
  updateUserApi
} from '../../utils/burger-api';

describe('userSlice', () => {
  // Общая переменная состояния
  let newState: typeof initialState;

  const mockUser = {
    email: 'test@mail.ru',
    name: 'Test User'
  };

  const mockOrders = [
    {
      _id: '677dbeb3133acd001be48eec',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e'],
      status: 'done',
      name: 'Флюоресцентный люминесцентный био-марсианский бургер',
      createdAt: '2025-01-07T23:54:27.919Z',
      updatedAt: '2025-01-07T23:54:28.930Z',
      number: 64984
    }
  ];

  const errorMessage = 'Ошибка загрузки данных пользователя';

  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем состояние перед каждым тестом
    newState = { ...initialState };
  });

  describe('Редьюсеры', () => {
    it('clearUser очищает данные пользователя', () => {
      newState = {
        ...newState,
        data: { email: 'test@mail.ru', name: 'Test User' }
      };
      newState = userReducer(newState, clearUser());
      expect(newState.data).toBeNull();
    });

    it('setUser устанавливает данные пользователя', () => {
      newState = userReducer(newState, setUser(mockUser));
      expect(newState.data).toEqual(mockUser);
    });

    it('setUserLoading устанавливает loading в true', () => {
      newState = userReducer(newState, setUserLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetUserLoading устанавливает loading в false', () => {
      newState = { ...newState, loading: true };
      newState = userReducer(newState, unsetUserLoading());
      expect(newState.loading).toBe(false);
    });
  });

  describe('fetchUserDataThunk', () => {
    it('fetchUserDataThunk.pending устанавливает loading в true', () => {
      newState = userReducer(
        newState,
        fetchUserDataThunk.pending('', undefined)
      );
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchUserDataThunk.fulfilled обновляет данные пользователя и отключает loading', () => {
      (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });
      newState = userReducer(
        newState,
        fetchUserDataThunk.fulfilled(mockUser, '', undefined)
      );
      expect(newState.loading).toBe(false);
      expect(newState.data).toEqual(mockUser);
    });

    it('fetchUserDataThunk.rejected сохраняет ошибку и отключает loading', () => {
      // Мокаем ошибку
      (getUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      newState = userReducer(
        newState,
        fetchUserDataThunk.rejected(new Error(errorMessage), '', undefined)
      );
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrdersThunk', () => {
    it('fetchUserOrdersThunk.pending устанавливает ordersLoading в true', () => {
      newState = userReducer(
        newState,
        fetchUserOrdersThunk.pending('', undefined)
      );
      expect(newState.ordersLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchUserOrdersThunk.fulfilled обновляет заказы пользователя и отключает ordersLoading', () => {
      (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrders);

      newState = userReducer(
        newState,
        fetchUserOrdersThunk.fulfilled(mockOrders, '', undefined)
      );
      expect(newState.ordersLoading).toBe(false);
      expect(newState.userOrders).toEqual(mockOrders);
    });

    it('fetchUserOrdersThunk.rejected сохраняет ошибку и отключает ordersLoading', () => {
      (getOrdersApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      newState = userReducer(
        newState,
        fetchUserOrdersThunk.rejected(new Error(errorMessage), '', undefined)
      );
      expect(newState.ordersLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('updateUserThunk', () => {
    const updatedUser = {
      email: 'newtest@mail.ru',
      name: 'New Test User'
    };

    it('updateUserThunk.pending устанавливает loading в true', () => {
      newState = userReducer(
        newState,
        updateUserThunk.pending('', updatedUser)
      );
      expect(newState.loading).toBe(true);
    });

    it('updateUserThunk.fulfilled обновляет данные пользователя и отключает loading', () => {
      (updateUserApi as jest.Mock).mockResolvedValueOnce({
        user: updatedUser
      });

      newState = userReducer(
        newState,
        updateUserThunk.fulfilled(updatedUser, '', mockUser)
      );
      expect(newState.data).toEqual(updatedUser);
      expect(newState.loading).toBe(false);
    });

    it('updateUserThunk.rejected сохраняет ошибку и отключает loading', () => {
      // Мокаем ошибку
      (updateUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      newState = userReducer(
        newState,
        updateUserThunk.rejected(new Error(errorMessage), '', updatedUser)
      );
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
