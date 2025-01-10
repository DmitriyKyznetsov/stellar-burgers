import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '@ui';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  // const orderData = {
  //   createdAt: '',
  //   ingredients: [],
  //   _id: '',
  //   status: '',
  //   name: '',
  //   updatedAt: 'string',
  //   number: 0
  // };
  //const ingredients: TIngredient[] = [];

  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const { currentOrder: orderData, loading: orderLoading } = useSelector(
    (state) => state.order
  );
  const ingredients = useSelector((state) => state.ingredients.items);

  useEffect(() => {
    if (number && (!orderData || orderData.number !== Number(number))) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || orderLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
