import { setCookie, deleteCookie } from './cookie';
import { refreshToken as refreshTokenApi } from '@api';

// Установка токенов
export const handleTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Удаление токенов
export const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};

// Обновление токенов
export const refreshTokens = async (): Promise<void> => {
  const response = await refreshTokenApi();
  handleTokens(response.accessToken, response.refreshToken);
};
