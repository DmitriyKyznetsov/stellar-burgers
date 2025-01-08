import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => (
  <div className={styles.wrap}>
    {/* Первая строка: номер заказа */}
    <h3 className={`text text_type_main-medium pt-10 ${styles.number}`}>
      #{orderInfo.number}
    </h3>

    {/* Вторая строка: название бургера */}
    <h3 className={`text text_type_main-medium pt-10 pb-3`}>
      {orderInfo.name}
    </h3>

    {/* Третья строка: статус заказа с подсветкой */}
    <div className={styles.statusContainer}>
      <OrderStatus status={orderInfo.status} />
    </div>

    {/* Состав */}
    <p className={`text text_type_main-medium pt-15 pb=6`}>Состав:</p>
    <ul className={`${styles.list} mb-8`}>
      {Object.values(orderInfo.ingredientsInfo).map((item, index) => (
        <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
          <div className={styles.img_wrap}>
            <div className={styles.border}>
              <img
                className={styles.img}
                src={item.image_mobile}
                alt={item.name}
              />
            </div>
          </div>
          <span className='text text_type_main-default pl-4'>{item.name}</span>
          <span
            className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
          >
            {item.count} x {item.price}
          </span>
          <CurrencyIcon type={'primary'} />
        </li>
      ))}
    </ul>

    {/* Общая сумма и дата */}
    <div className={styles.bottom}>
      <p className='text text_type_main-default text_color_inactive'>
        <FormattedDate date={orderInfo.date} />
      </p>
      <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
        {orderInfo.total}
      </span>
      <CurrencyIcon type={'primary'} />
    </div>
  </div>
));
