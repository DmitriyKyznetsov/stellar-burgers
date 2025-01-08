import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const navigate = useNavigate();

  const handleConstructorClick = () => navigate('/');
  const handleFeedClick = () => navigate('/feed');
  const handleProfileClick = () => navigate('/profile');

  return (
    <AppHeaderUI
      userName=''
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
    />
  );
};
