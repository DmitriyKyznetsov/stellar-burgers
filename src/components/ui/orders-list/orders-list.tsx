import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => (
  <div className={`${styles.content}`}>
    {orderByDate.length === 0 ? (
      <div className={`text text_type_main-medium pt-15 ${styles.noOrders}`}>
        Заказов пока нет
      </div>
    ) : (
      orderByDate.map((order) => <OrderCard order={order} key={order._id} />)
    )}
  </div>
);
