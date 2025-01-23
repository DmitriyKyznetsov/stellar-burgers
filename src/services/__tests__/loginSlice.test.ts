import loginReducer, {
  loginThunk,
  logoutThunk,
  registerThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  setError,
  setLoginLoading,
  unsetLoginLoading
} from '../slices/loginSlice';

// Мокаем API
jest.mock('../../utils/burger-api');
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  forgotPasswordApi,
  resetPasswordApi
} from '../../utils/burger-api';

describe('loginSlice', () => {
  // Начальное состояние слайса
  const initialState = {
    loading: false,
    error: null
  };

  // Данные для мока
  const mockLoginResponse = {
    success: true,
    accessToken: 'testAccessToken',
    refreshToken: 'testRefreshToken',
    user: {
      name: 'test',
      email: 'test@mail.com'
    }
  };

  const mockResetPasswordResponse = {
    success: true,
    message: 'Password successfully reset'
  };

  describe('loginSlice редьюсеры', () => {
    it('setError редьюсер изменяет состояние ошибки', () => {
      const newState = loginReducer(initialState, setError('Test Error'));
      expect(newState.error).toBe('Test Error');
    });

    it('setLoginLoading редьюсер устанавливает состояние загрузки', () => {
      const newState = loginReducer(initialState, setLoginLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetLoginLoading редьюсер убирает состояние загрузки', () => {
      const newState = loginReducer(
        { ...initialState, loading: true },
        unsetLoginLoading()
      );
      expect(newState.loading).toBe(false);
    });
  });

  describe('LoginThunk', () => {
    // Данные для авторизации
    const loginData = { email: 'test@mail.com', password: 'password123' };

    // Данные для ошибки
    const errorMessage = 'Ошибка при авторизации';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Состояние при loginThunk.pending', () => {
      // Передаем их в pending
      const newState = loginReducer(
        initialState,
        loginThunk.pending('', loginData)
      );

      // Проверяем состояние
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при loginThunk.fulfilled', () => {
      // Мокаем успешный ответ от API
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      const newState = loginReducer(
        initialState,
        loginThunk.fulfilled(mockLoginResponse, '', loginData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при loginThunk.rejected', () => {
      (loginUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = loginReducer(
        initialState,
        loginThunk.rejected(new Error(errorMessage), '', loginData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('logoutThunk', () => {
    const mockLogoutResponse = {
      ok: true,
      json: jest.fn().mockResolvedValueOnce({})
    };

    const errorMessage = 'Ошибка при выходе из системы';

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('Состояние при logoutThunk.pending', () => {
      const newState = loginReducer(
        initialState,
        logoutThunk.pending('', undefined)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при logoutThunk.fulfilled', () => {
      (logoutApi as jest.Mock).mockResolvedValueOnce(mockLogoutResponse);

      const newState = loginReducer(
        initialState,
        logoutThunk.fulfilled(undefined, '', undefined)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при logoutThunk.rejected', () => {
      (logoutApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const newState = loginReducer(
        initialState,
        logoutThunk.rejected(new Error(errorMessage), '', undefined)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('registerThunk', () => {
    // Данные для регистрации
    const registerData = {
      email: 'test@mail.com',
      password: 'password123',
      name: 'Test User'
    };

    // Сообщение об ошибке
    const errorMessage = 'Ошибка при регистрации';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Состояние при registerThunk.pending', () => {
      const newState = loginReducer(
        initialState,
        registerThunk.pending('', registerData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при registerThunk.fulfilled', () => {
      // Мокаем успешный ответ от API
      (registerUserApi as jest.Mock).mockResolvedValueOnce(mockLoginResponse);

      const newState = loginReducer(
        initialState,
        registerThunk.fulfilled(mockLoginResponse.user, '', registerData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при registerThunk.rejected', () => {
      // Мокаем ошибку от API
      (registerUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = loginReducer(
        initialState,
        registerThunk.rejected(new Error(errorMessage), '', registerData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('forgotPasswordThunk', () => {
    const emailData = { email: 'test@mail.com' };
    const errorMessage = 'Ошибка при отправке email для восстановления пароля';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Состояние при forgotPasswordThunk.pending', () => {
      const newState = loginReducer(
        initialState,
        forgotPasswordThunk.pending('', emailData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при forgotPasswordThunk.fulfilled', async () => {
      (forgotPasswordApi as jest.Mock).mockResolvedValueOnce(
        mockResetPasswordResponse
      );

      const newState = loginReducer(
        initialState,
        forgotPasswordThunk.fulfilled(undefined, '', emailData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при forgotPasswordThunk.rejected', () => {
      (forgotPasswordApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = loginReducer(
        initialState,
        forgotPasswordThunk.rejected(new Error(errorMessage), '', emailData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });

  describe('resetPasswordThunk', () => {
    const resetData = { password: 'newPassword123', token: 'resetToken123' };
    const errorMessage = 'Ошибка при сбросе пароля';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Состояние при resetPasswordThunk.pending', () => {
      const newState = loginReducer(
        initialState,
        resetPasswordThunk.pending('', resetData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при resetPasswordThunk.fulfilled', async () => {
      (resetPasswordApi as jest.Mock).mockResolvedValueOnce(
        mockResetPasswordResponse
      );

      const newState = loginReducer(
        initialState,
        resetPasswordThunk.fulfilled(undefined, '', resetData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при resetPasswordThunk.rejected', () => {
      (resetPasswordApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const newState = loginReducer(
        initialState,
        resetPasswordThunk.rejected(new Error(errorMessage), '', resetData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
