import authReducer, {
  checkAuthThunk,
  setAuthentificated,
  unsetAuthentificated,
  setAuthLoading,
  unsetAuthLoading,
  initialState // Импортируем initialState
} from '../slices/authSlice';

// Мокаем API и функции
import { getCookie } from '../../utils/cookie';
import { refreshTokens } from '../../utils/token';

// Мокаем API
jest.mock('../../utils/burger-api');
jest.mock('../../utils/cookie');
jest.mock('../../utils/token');
jest.mock('../slices/userSlice');
import { getUserApi } from '../../utils/burger-api';

describe('authSlice', () => {
  // Ошибка
  const errorMessage = 'Ошибка авторизации';

  // Общая переменная состояния
  let newState: typeof initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    // Начальное состояние перед каждым тестом
    newState = { ...initialState };
  });

  describe('Редьюсеры', () => {
    it('setAuthentificated', () => {
      newState = authReducer(newState, setAuthentificated());
      expect(newState.isAuthenticated).toBe(true);
    });

    it('unsetAuthentificated', () => {
      newState = { ...newState, isAuthenticated: true };
      newState = authReducer(newState, unsetAuthentificated());
      expect(newState.isAuthenticated).toBe(false);
    });

    it('setAuthLoading', () => {
      newState = authReducer(newState, setAuthLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetAuthLoading', () => {
      newState = { ...newState, loading: true };
      newState = authReducer(newState, unsetAuthLoading());
      expect(newState.loading).toBe(false);
    });
  });

  describe('checkAuthThunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('checkAuthThunk.pending', () => {
      newState = authReducer(newState, checkAuthThunk.pending('', undefined));
      expect(newState.loading).toBe(true);
    });

    it('checkAuthThunk.fulfilled', async () => {
      const mockUser = {
        email: 'test@mail.ru',
        name: 'Test User'
      };

      // Мокаем вспомогательные функции
      (getCookie as jest.Mock).mockReturnValueOnce('mockAccessToken');
      (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

      newState = authReducer(
        newState,
        checkAuthThunk.fulfilled(true, '', undefined)
      );

      expect(newState.isAuthenticated).toBe(true);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('checkAuthThunk.rejected', async () => {
      // Мокаем ошибку при вызове refreshTokens
      (refreshTokens as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      newState = authReducer(
        newState,
        checkAuthThunk.rejected(new Error(errorMessage), '', undefined)
      );

      expect(newState.isAuthenticated).toBe(false);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
