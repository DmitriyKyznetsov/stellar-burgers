import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { setError } from '../../services/slices/loginSlice';
import { registerThunk } from '../../services/slices/loginSlice';

export const Register: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setError(null));
  }, [dispatch]);

  const { loading, error } = useSelector((state) => state.login);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerThunk({ name: userName, email, password }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
