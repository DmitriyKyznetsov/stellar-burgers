import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { setError } from '../../services/slices/loginSlice';
import { loginThunk } from '../../services/slices/loginSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const { loading, error } = useSelector((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
