import authReducer, {
  checkAuthThunk,
  setAuthentificated,
  unsetAuthentificated,
  setAuthLoading,
  unsetAuthLoading
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
  // Начальное состояние
  const initialState = {
    isAuthenticated: false,
    loading: true,
    error: null
  };

  // Ошибка
  const errorMessage = 'Ошибка авторизации';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Редьюсеры', () => {
    it('setAuthentificated', () => {
      const newState = authReducer(initialState, setAuthentificated());
      expect(newState.isAuthenticated).toBe(true);
    });

    it('unsetAuthentificated', () => {
      const newState = authReducer(
        { ...initialState, isAuthenticated: true },
        unsetAuthentificated()
      );
      expect(newState.isAuthenticated).toBe(false);
    });

    it('setAuthLoading', () => {
      const newState = authReducer(initialState, setAuthLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetAuthLoading', () => {
      const newState = authReducer(
        { ...initialState, loading: true },
        unsetAuthLoading()
      );
      expect(newState.loading).toBe(false);
    });
  });

  describe('checkAuthThunk', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('checkAuthThunk.pending', () => {
      const newState = authReducer(
        initialState,
        checkAuthThunk.pending('', undefined)
      );
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

      const newState = authReducer(
        initialState,
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

      const newState = authReducer(
        initialState,
        checkAuthThunk.rejected(new Error(errorMessage), '', undefined)
      );

      expect(newState.isAuthenticated).toBe(false);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
