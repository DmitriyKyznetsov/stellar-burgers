import loginReducer, {
  loginThunk,
  logoutThunk,
  registerThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  setError,
  setLoginLoading,
  unsetLoginLoading,
  initialState
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

  // Общая переменная состояния
  let newState: typeof initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    newState = { ...initialState }; // Сбрасываем состояние перед каждым тестом
  });

  describe('loginSlice редьюсеры', () => {
    it('setError редьюсер изменяет состояние ошибки', () => {
      newState = loginReducer(newState, setError('Test Error'));
      expect(newState.error).toBe('Test Error');
    });

    it('setLoginLoading редьюсер устанавливает состояние загрузки', () => {
      newState = loginReducer(newState, setLoginLoading());
      expect(newState.loading).toBe(true);
    });

    it('unsetLoginLoading редьюсер убирает состояние загрузки', () => {
      newState = loginReducer(
        { ...newState, loading: true },
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
      newState = loginReducer(newState, loginThunk.pending('', loginData));
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при loginThunk.fulfilled', () => {
      // Мокаем успешный ответ от API
      (loginUserApi as jest.Mock).mockResolvedValueOnce(mockLoginResponse);
      newState = loginReducer(
        newState,
        loginThunk.fulfilled(mockLoginResponse, '', loginData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при loginThunk.rejected', () => {
      (loginUserApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      newState = loginReducer(
        newState,
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
      newState = loginReducer(newState, logoutThunk.pending('', undefined));
      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при logoutThunk.fulfilled', () => {
      (logoutApi as jest.Mock).mockResolvedValueOnce(mockLogoutResponse);
      newState = loginReducer(
        newState,
        logoutThunk.fulfilled(undefined, '', undefined)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при logoutThunk.rejected', () => {
      (logoutApi as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      newState = loginReducer(
        newState,
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
      newState = loginReducer(
        newState,
        registerThunk.pending('', registerData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при registerThunk.fulfilled', () => {
      // Мокаем успешный ответ от API
      (registerUserApi as jest.Mock).mockResolvedValueOnce(mockLoginResponse);
      newState = loginReducer(
        newState,
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
      newState = loginReducer(
        newState,
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
      newState = loginReducer(
        newState,
        forgotPasswordThunk.pending('', emailData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при forgotPasswordThunk.fulfilled', async () => {
      (forgotPasswordApi as jest.Mock).mockResolvedValueOnce(
        mockResetPasswordResponse
      );
      newState = loginReducer(
        newState,
        forgotPasswordThunk.fulfilled(undefined, '', emailData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при forgotPasswordThunk.rejected', () => {
      (forgotPasswordApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      newState = loginReducer(
        newState,
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
      newState = loginReducer(
        newState,
        resetPasswordThunk.pending('', resetData)
      );

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Состояние при resetPasswordThunk.fulfilled', async () => {
      (resetPasswordApi as jest.Mock).mockResolvedValueOnce(
        mockResetPasswordResponse
      );
      newState = loginReducer(
        newState,
        resetPasswordThunk.fulfilled(undefined, '', resetData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('Состояние при resetPasswordThunk.rejected', () => {
      (resetPasswordApi as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );
      newState = loginReducer(
        newState,
        resetPasswordThunk.rejected(new Error(errorMessage), '', resetData)
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });
  });
});
