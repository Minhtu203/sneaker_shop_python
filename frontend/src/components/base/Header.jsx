import { useRef, useState } from 'react';
import { Button, Menu } from '../uiCore/index';
import { useUserState } from '@/store/userState';
import { ButtonSidebar } from '../uiCore/Button/Button';
import { CreateAxios } from '@/lib/axios';
import { logoutApi } from '@/api/auth/logoutApi';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { userInfo, clearUserInfo } = useUserState();
  let axiosJWT = CreateAxios();
  const navigate = useNavigate();

  let items = [
    {
      label: 'Hồ sơ',
      icon: 'pi pi-user',
      command: () => {
        console.log(11111);
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
  const [toggleUser, setToggleUser] = useState(false);
  const menu = useRef(null);

  return (
    <div className="h-[var(--height-header)] w-full bg-white border-b border-b-gray-400 flex flex-row items-center justify-start px-8">
      <div className="w-[6rem] ml-auto">
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
