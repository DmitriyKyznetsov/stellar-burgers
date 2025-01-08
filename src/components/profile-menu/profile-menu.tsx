import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutThunk } from '../../services/slices/loginSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk()).then(() => {
      navigate('/login');
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
