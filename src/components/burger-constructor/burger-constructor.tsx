import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  placeOrder,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  // const constructorItems = {
  //   bun: {
  //     price: 0
  //   },
  //   ingredients: []
  // };

  //const orderRequest = false;
  //const orderModalData = null;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerConstructor
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) {
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(placeOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((s: number, v) => {
        if ('price' in v) {
          return s + v.price;
        }
        return 0;
      }, 0),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
