import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch({
          type: 'burgerConstructor/moveIngredient',
          payload: { fromIndex: index, toIndex: index + 1 }
        });
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch({
          type: 'burgerConstructor/moveIngredient',
          payload: { fromIndex: index, toIndex: index - 1 }
        });
      }
    };

    const handleClose = () => {
      dispatch({
        type: 'burgerConstructor/removeIngredient',
        payload: index
      });
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
