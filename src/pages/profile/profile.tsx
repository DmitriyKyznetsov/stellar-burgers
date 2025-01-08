import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '../../services/store';
import { updateUserThunk } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  // const user = {
  //   name: '',
  //   email: ''
  // };

  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: data?.name || '',
    email: data?.email || '',
    password: ''
  });

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
    password: false,
    message: ''
  });

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errors = {
      name: formValue.name.length < 1,
      email: !emailRegex.test(formValue.email),
      password: formValue.password.length > 0 && formValue.password.length < 6,
      message: ''
    };

    const invalidFields = [];
    if (errors.name) invalidFields.push('имя');
    if (errors.email) invalidFields.push('email');
    if (errors.password) invalidFields.push('пароль');

    if (invalidFields.length > 0) {
      errors.message = `Неправильные поля: ${invalidFields.join(', ')}`;
    }

    setValidationErrors(errors);

    return invalidFields.length === 0;
  };

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: data?.name || '',
      email: data?.email || ''
    }));
  }, [data]);

  const isFormChanged =
    formValue.name !== data?.name ||
    formValue.email !== data?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedData = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    };
    dispatch(updateUserThunk(updatedData));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: data?.name || '',
      email: data?.email || '',
      password: ''
    });
    setValidationErrors({
      name: false,
      email: false,
      password: false,
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={validationErrors.message}
      validationErrors={validationErrors}
    />
  );
  // return null;
};
