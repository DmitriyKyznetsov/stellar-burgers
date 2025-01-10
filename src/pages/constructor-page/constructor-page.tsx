import { useSelector } from '../../services/store';
import { FC } from 'react';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  // const isIngredientsLoading = false;

  const { loading: isIngredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
