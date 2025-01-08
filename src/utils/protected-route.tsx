import { useSelector } from '../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { userDataSelector } from '../services/slices/userSlice';
import { authLoadingCheckSelector } from '../services/slices/authSlice';

import { RouteConfig, ProtectedRouteProps } from '@utils-types';

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authLoadingCheck = useSelector(authLoadingCheckSelector); // Статус проверки авторизации
  const user = useSelector(userDataSelector); // Получаем данные о пользователе
  const location = useLocation();

  // Конфигурация маршрутов
  const routeConfig: RouteConfig = {
    '/profile': { onlyUnAuth: false },
    '/profile/orders': { onlyUnAuth: false },
    '/login': { onlyUnAuth: true },
    '/register': { onlyUnAuth: true },
    '/forgot-password': { onlyUnAuth: true },
    '/reset-password': { onlyUnAuth: true }
  };

  if (authLoadingCheck === true) {
    return <Preloader />;
  }

  const currentRoute = location.pathname;
  const routeProtection = routeConfig[currentRoute];

  // Только для неавторизованных
  if (routeProtection?.onlyUnAuth && user) {
    return <Navigate replace to='/profile' />;
  }

  // Только для авторизованных
  if (!routeProtection?.onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  return children;
};
