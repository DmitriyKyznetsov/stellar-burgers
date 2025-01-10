import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { fetchUserOrdersThunk } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  //const orders: TOrder[] = [];

  const dispatch = useDispatch();

  const { userOrders, ordersLoading, loading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} ordersLoading={ordersLoading} />;
};
