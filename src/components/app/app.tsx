import '../../index.css';
import styles from './app.module.css';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchFeed } from '../../services/slices/feedSlice';
import { checkAuthThunk } from '../../services/slices/authSlice';

import { ProtectedRoute } from '../../utils/protected-route';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Роутинг модальных окон
  const state = location.state as { background?: Location };

  // Закрытие модального окна
  const closeModalHandler = () => {
    navigate(-1);
  };

  // Загрузка данных
  useEffect(() => {
    dispatch(checkAuthThunk()); // Проверка авторизован ли пользователь
    dispatch(fetchIngredients()); // Загрузка ингредиентов в конструктор
    dispatch(fetchFeed()); // Загрузка истории заказов всех пользователей
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* Основные маршруты */}
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Защищённые маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Модальные окна */}
      {state?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModalHandler}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={closeModalHandler}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='profile/orders/:number'
            element={
              <Modal title='Информация о заказе' onClose={closeModalHandler}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
