import React, { FC, useState, useEffect } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const pathToTabMap: Record<string, string> = {
  '/': 'constructor',
  '/feed': 'feed',
  '/login': 'profile',
  '/register': 'profile',
  '/profile': 'profile',
  '/forgot-password': 'profile',
  '/reset-password': 'profile',
  '/profile/orders': 'profile'
};

const useActiveTab = () => {
  const [activeTab, setActiveTab] = React.useState<string>('constructor');

  React.useEffect(() => {
    const path = window.location.pathname;
    setActiveTab(pathToTabMap[path] || '');
  }, [window.location.pathname]);

  return activeTab;
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick
}) => {
  const activeTab = useActiveTab();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div
            onClick={onConstructorClick}
            className={`${styles.link} ${activeTab === 'constructor' ? styles.link_active : ''}`}
          >
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>

          <div
            onClick={onFeedClick}
            className={`${styles.link} ${activeTab === 'feed' ? styles.link_active : ''}`}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>

        <div
          onClick={onProfileClick}
          className={`${styles.link} ${activeTab === 'profile' ? styles.link_active : ''}`}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
