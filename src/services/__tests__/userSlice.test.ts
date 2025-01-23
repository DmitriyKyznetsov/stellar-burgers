import userReducer, {
  fetchUserDataThunk,
  fetchUserOrdersThunk,
  updateUserThunk,
  clearUser,
  setUser,
  setUserLoading,
  unsetUserLoading
} from '../slices/userSlice';

// Мокаем API
jest.mock('../../utils/burger-api');
import {
  getUserApi,
  getOrdersApi,
  updateUserApi
} from '../../utils/burger-api';

describe('userSlice', () => {
  const initialState = {
    data: null,
    userOrders: [],
    loading: true,
    ordersLoading: false,
    error: null
  };

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Редьюсеры', () => {
    it('clearUser очищает данные пользователя', () => {
      const stateWithUser = { ...initialState, data: mockUser };
      const newState = userReducer(stateWithUser, clearUser());
      expect(newState.data).toBeNull();
    });

    it('setUser устанавливает данные пользователя', () => {
      const newState = userReducer(initialState, setUser(mockUser));
      expect(newState.data).toEqual(mockUser);
    });

    it('setUserLoading устанавливает loading в true', () => {
      const newState = userReducer(initialState, setUserLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetUserLoading устанавливает loading в false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const newState = userReducer(stateWithLoading, unsetUserLoading());
      expect(newState.loading).toBe(false);
    });
  });

  describe('fetchUserDataThunk', () => {
    it('fetchUserDataThunk.pending устанавливает loading в true', () => {
      const newState = userReducer(
        initialState,
        fetchUserDataThunk.pending('', undefined)
      );
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchUserDataThunk.fulfilled обновляет данные пользователя и отключает loading', () => {
      (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

      const newState = userReducer(
        initialState,
        fetchUserDataThunk.fulfilled(mockUser, '', undefined)
      );
      expect(newState.loading).toBe(false);
      expect(newState.data).toEqual(mockUser);
    });

    it('fetchUserDataThunk.rejected сохраняет ошибку и отключает loading', () => {
      const errorMessage = 'Ошибка загрузки данных пользователя';
      // Мокаем ошибку
      (getUserApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const newState = userReducer(
        initialState,
        fetchUserDataThunk.rejected(new Error(errorMessage), '', undefined)
      );
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('fetchUserOrdersThunk', () => {
    it('fetchUserOrdersThunk.pending устанавливает ordersLoading в true', () => {
      const newState = userReducer(
        initialState,
        fetchUserOrdersThunk.pending('', undefined)
      );
      expect(newState.ordersLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fetchUserOrdersThunk.fulfilled обновляет заказы пользователя и отключает ordersLoading', () => {
      (getOrdersApi as jest.Mock).mockResolvedValueOnce(mockOrders);

      const newState = userReducer(
        initialState,
        fetchUserOrdersThunk.fulfilled(mockOrders, '', undefined)
      );
      expect(newState.ordersLoading).toBe(false);
      expect(newState.userOrders).toEqual(mockOrders);
    });

    it('fetchUserOrdersThunk.rejected сохраняет ошибку и отключает ordersLoading', () => {
      const errorMessage = 'Ошибка загрузки заказов';
      (getOrdersApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = userReducer(
        initialState,
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
      const newState = userReducer(
        initialState,
        updateUserThunk.pending('', mockUser)
      );
      expect(newState.loading).toBe(true);
    });

    it('updateUserThunk.fulfilled обновляет данные пользователя и отключает loading', () => {
      (updateUserApi as jest.Mock).mockResolvedValueOnce({
        user: updatedUser
      });

      const newState = userReducer(
        initialState,
        updateUserThunk.fulfilled(updatedUser, '', mockUser)
      );
      expect(newState.data).toEqual(updatedUser);
      expect(newState.loading).toBe(false);
    });

    it('updateUserThunk.rejected сохраняет ошибку и отключает loading', () => {
      const errorMessage = 'Ошибка обновления пользователя';
      // Мокаем ошибку
      (updateUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = userReducer(
        initialState,
        updateUserThunk.rejected(new Error(errorMessage), '', mockUser)
      );
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
