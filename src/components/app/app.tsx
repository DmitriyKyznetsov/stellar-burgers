import '../../index.css';
import styles from './app.module.css';

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

//import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Импорт react-router-dom

const App = () => {
  {
    /*Тесты 
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);


  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };
    */
  }

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />

          {/* Модалки
          <Route
            path='/feed/:number'
            element={
              <>
                <Modal title={modalTitle} onClose={closeModal}>
                  {modalContent || <OrderInfo />}
                </Modal>
              </>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <>
                <Modal title={modalTitle} onClose={closeModal}>
                  {modalContent || <IngredientDetails />}
                </Modal>
              </>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <>
                <Modal title={modalTitle} onClose={closeModal}>
                  {modalContent || <OrderInfo />}
                </Modal>
              </>
            }
          />
          */}

          {/* Страница 404 */}
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

console.log('test');

export default App;
