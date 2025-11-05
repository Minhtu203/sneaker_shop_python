import logo from '../../assets/logoShoes.png';
import Button, { ButtonSidebar } from '../uiCore/Button/Button';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserState } from '@/store/userState';

function Sidebar({ toggleSidebar, setToggleSidebar }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = useNavigate();
  const [sport, setSport] = useState(false);
  const location = useLocation();
  const { userInfo } = useUserState();

  return (
    <div
      className={`border-r border-gray-300 bg-white h-screen flex flex-col overflow-auto items-center py-8 gap-4 
          fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out scrollbar-hide
          ${toggleSidebar ? 'w-[100%] md:w-[var(--width-sidebar)] translate-x-0' : 'w-[100%] md:w-[var(--width-sidebar)] -translate-x-full'}`}
    >
      {windowWidth < 768 && (
        <button
          onClick={() => setToggleSidebar(!toggleSidebar)}
          className="absolute top-5 right-6 pi pi-times w-10 h-10 rounded-[50%] bg-[var(--primary-blue)] text-white cursor-pointer"
        />
      )}
      <img
        alt="logo"
        src={logo}
        className="w-[8rem] h-[8rem]"
        style={{
          animation: 'spin-slow 10s linear infinite',
        }}
      />
      <style>
        {`
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
      </style>

      <div className="w-full flex flex-col gap-3">
        <ButtonSidebar
          noIcon={true}
          onClick={() => navigate('/')}
          className={`${location.pathname === '/' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Home
        </ButtonSidebar>
        <ButtonSidebar
          onClick={() => navigate('/shoes/jordan')}
          noIcon={true}
          className={`${location.pathname === '/shoes/jordan' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Jordan
        </ButtonSidebar>
        <ButtonSidebar
          onClick={() => navigate('/shoes/airmax')}
          noIcon={true}
          className={`${location.pathname === '/shoes/airmax' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Airmax
        </ButtonSidebar>
        <ButtonSidebar
          onClick={() => navigate('/shoes/nike')}
          noIcon={true}
          className={`${location.pathname === '/shoes/nike' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Nike
        </ButtonSidebar>
        <ButtonSidebar onClick={() => setSport(!sport)}>Sport</ButtonSidebar>
        <ShowNavSidebar
          show={sport}
          className={`${location.pathname === '/sport' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          <ButtonV3 onClick={() => navigate('/shoes/basketball')}>Basketball</ButtonV3>
          <ButtonV3 onClick={() => navigate('/shoes/football')}>Football</ButtonV3>
          <ButtonV3 onClick={() => navigate('/shoes/golf')}>Golf</ButtonV3>
          <ButtonV3 onClick={() => navigate('/shoes/tennis')}>Tennis</ButtonV3>
        </ShowNavSidebar>

        {userInfo?.role === 'admin' && (
          <ButtonSidebar
            onClick={() => navigate('/shoes/onlyAdmin')}
            noIcon={true}
            className={`${location.pathname === '/shoes/onlyAdmin' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
          >
            Only Admin
          </ButtonSidebar>
        )}
      </div>
    </div>
  );
}
export default Sidebar;

const ButtonV2 = ({ className, ...props }) => {
  return (
    <Button
      className={`${className} hover:scale-105 !bg-gradient-to-r !from-[#274480] to-[#4C6AB0] !transition-all !duration-200`}
      {...props}
    />
  );
};

const ButtonV3 = ({ className, ...props }) => {
  return (
    <Button
      className={`${className} !border-none !bg-gradient-to-r !from-blue-200 !to-white p-6 !text-[var(--primary-blue)] 
      hover:scale-105 !transition-all !duration-200 focus:!bg-[var(--primary-yellow)] !font-bold`}
      {...props}
    />
  );
};

const ShowNavSidebar = (props) => {
  const { className, show, ...prop } = props;
  return (
    <div
      className={`${className} p-2 ml-4 w-9/10 flex flex-col gap-2 overflow-hidden transition-all duration-800 ease-in-out transform ${
        show ? 'opacity-100 translate-y-0 max-h-400' : 'opacity-0 translate-y-4 max-h-0'
      }`}
      {...prop}
    >
      {props.children}
    </div>
  );
};
