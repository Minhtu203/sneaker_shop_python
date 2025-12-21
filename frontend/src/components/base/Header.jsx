import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { logoutApi } from '@/api/auth/logoutApi';
import userAvatar from '../../assets/userDefault.png';
import { ButtonSidebar } from '../uiCore/Button/Button';
import { InputIcon, InputTextz } from '../uiCore/Form/InputIcon ';
import { Button, Menu, OverlayPanel, IconField, AutoComplete } from '../uiCore/index';
import { getAllShoes } from '@/api/homeApi';
import { getItemsInCart } from '@/api/shoppingCartApi';
import { useCartStore } from '@/store/cartStore';

function Header({ toggleSidebar, setToggleSidebar }) {
  const { userInfo, clearUserInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const navigate = useNavigate();
  const [allShoes, setAllShoes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchShoes = async () => {
      const res = await getAllShoes(axiosJWT, userInfo?.accessToken);
      setAllShoes(res?.data?.data);
    };
    fetchShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filteredShoes, setFilteredShoes] = useState([]);

  const searchShoes = (event) => {
    let query = event.query;
    let filtered;
    if (!query || query.trim().length === 0) {
      filtered = allShoes.slice(0, 3);
    } else {
      filtered = allShoes.filter((s) => s.name.toLowerCase().includes(event.query.toLowerCase().trim()));
    }
    setFilteredShoes(filtered);
  };

  let items = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        navigate(`/user-profile`);
      },
    },
    {
      label: 'Cart',
      icon: 'pi pi-shopping-cart',
      command: () => {
        navigate('/shopping_cart');
      },
    },
    {
      label: 'Favourite',
      icon: 'pi pi-heart',
      command: () => {
        navigate('/favourites');
      },
    },
    {
      label: 'Log out',
      icon: 'pi pi-sign-out',
      command: () => {
        logoutApi(userInfo?._id, clearUserInfo, userInfo?.accessToken, axiosJWT, navigate);
      },
    },
  ];
  const menu = useRef(null);
  const op = useRef(null);

  const handleSearch = (item) => {
    navigate(`/shoes/${item?._id}`);
  };

  const { cartItems, setCartItems } = useCartStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItemsInCart(axiosJWT, userInfo?.accessToken);
        setCartItems(res.data?.cartItems?.items);
      } catch (error) {
        console.error(error.message || error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <div
      className={`h-[var(--height-header)] bg-white border-b border-b-gray-300 
      flex flex-row items-center justify-start px-8 gap-4 ${toggleSidebar ? 'hidden md:flex md:ml-[var(--width-sidebar)]' : 'ml-0'}
        transition-all duration-500 ease-in-out sticky z-50`}
    >
      <Button
        className="md:w-16 w-16 !bg-[var(--primary-blue)] hover:!bg-[var(--primary-blue-hover)]"
        icon="pi pi-align-justify"
        aria-label="Filter"
        onClick={() => setToggleSidebar(!toggleSidebar)}
      />
      {/* search box */}
      <div className="w-[20rem] relative items-center">
        <div className="absolute z-10 h-full w-9 flex items-center justify-center text-gray-500">
          <InputIcon className="pi pi-search z-10 " />
        </div>
        <AutoComplete
          className="!w-full"
          inputClassName="!w-full !pl-9"
          value={search}
          suggestions={filteredShoes}
          completeMethod={searchShoes}
          onChange={(e) => setSearch(e.value)}
          placeholder="Search shoes"
          field="name"
          itemTemplate={(item) => (
            <button onClick={() => handleSearch(item)} className="flex items-center gap-2 cursor-pointer">
              <img className="w-12 h-12 object-cover rounded-md" src={item?.colors?.[0]?.img?.[0]} alt="shoes" />
              <span className="text-md text-[var(--primary-blue)]">{item.name}</span>
            </button>
          )}
        />
      </div>

      <div className="flex gap-4 flex-row items-center ml-auto">
        <div className="relative">
          <Button
            className="!hidden md:!flex !text-[var(--primary-blue)] focus:!text-[var(--primary-blue)] !text-12 !p-[1.4rem] focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]"
            icon="pi pi-shopping-cart"
            rounded
            outlined
            onClick={() => navigate('/shopping_cart')}
          />
          <span className="hidden md:flex absolute left-0 bg-red-600 bottom-0 w-4 h-4 text-[0.6rem] text-white rounded-2xl items-center justify-center">
            {cartItems?.length || 0}
          </span>
        </div>

        <Button
          className="!hidden md:!flex !text-[var(--primary-blue)] focus:!text-[var(--primary-blue)] !text-12 !p-[1.4rem] focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]"
          icon="pi pi-heart"
          rounded
          outlined
          onClick={() => navigate('/favourites')}
        />
        <Button
          className="!text-[var(--primary-blue)] focus:!text-[var(--primary-blue)] !text-12 !p-[1.4rem] focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]"
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
          className="hidden md:flex w-12 h-12 object-cover rounded-[50%] hover:cursor-pointer"
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
