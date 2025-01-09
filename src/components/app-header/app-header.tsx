import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { authLoadingCheckSelector } from '../../services/slices/authSlice';
import { userDataSelector } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const userName = useSelector(userDataSelector)?.name;

  const handleConstructorClick = () => navigate('/');
  const handleFeedClick = () => navigate('/feed');
  const handleProfileClick = () => navigate('/profile');

  return (
    <AppHeaderUI
      userName={userName}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
      onProfileClick={handleProfileClick}
    />
  );
};
