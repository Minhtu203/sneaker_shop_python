import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { logoutApi } from '@/api/auth/logoutApi';
import userAvatar from '../../assets/userDefault.png';
import { ButtonSidebar } from '../uiCore/Button/Button';
import { InputIcon, InputTextz } from '../uiCore/Form/InputIcon ';
import { Button, Menu, OverlayPanel, IconField } from '../uiCore/index';

function Header({ toggleSidebar, setToggleSidebar }) {
  const { userInfo, clearUserInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const navigate = useNavigate();

  let items = [
    {
      label: 'Hồ sơ',
      icon: 'pi pi-user',
      command: () => {
        navigate(`/user-profile`);
      },
    },
    {
      label: 'Đăng xuất',
      icon: 'pi pi-sign-out',
      command: () => {
        logoutApi(userInfo?._id, clearUserInfo, userInfo?.accessToken, axiosJWT);
        if (!userInfo) navigate('/login');
      },
    },
  ];
  const menu = useRef(null);
  const op = useRef(null);

  return (
    <div
      className={`h-[var(--height-header)] bg-white border-b border-b-gray-300 
      flex flex-row items-center justify-start px-8 gap-4 ${toggleSidebar ? 'ml-[var(--width-sidebar)]' : 'ml-0'}
        transition-all duration-500 ease-in-out sticky z-50`}
    >
      <Button
        className="!bg-[var(--primary-blue)] hover:!bg-[var(--primary-blue-hover)]"
        icon="pi pi-align-justify"
        aria-label="Filter"
        onClick={() => setToggleSidebar(!toggleSidebar)}
      />
      {/* search box */}
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputTextz placeholder="Search" />
      </IconField>

      <div className="flex gap-4 flex-row items-center ml-auto">
        <Button
          className="!text-[var(--primary-blue)] focus:!text-[var(--primary-blue)] !text-12 !p-[1.3rem] focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]"
          icon="pi pi-shopping-cart"
          rounded
          outlined
          onClick={() => navigate('/shopping_cart')}
        />
        <Button
          className="!text-[var(--primary-blue)] focus:!text-[var(--primary-blue)] !text-12 !p-[1.3rem] focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]"
          icon="pi pi-bell"
          rounded
          outlined
          onClick={(e) => op.current.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <img src={'https://primefaces.org/cdn/primereact/images/product/bamboo-watch.jpg'} alt="Bamboo Watch" />
        </OverlayPanel>
        <img
          alt="user"
          src={userInfo?.avatar ? userInfo?.avatar : userAvatar}
          className="w-12 h-12 object-cover rounded-[50%] hover:cursor-pointer"
          onClick={() => navigate('/user-profile')}
        />
        <ButtonSidebar
          onClick={(e) => menu.current.toggle(e)}
          label={userInfo?.username}
          className="text-[var(--primary-blue)] transform-none hover:bg-white flex gap-2"
        >
          {userInfo?.username}
        </ButtonSidebar>
      </div>
      <Menu model={items} popup ref={menu} />
    </div>
  );
}

export default Header;
