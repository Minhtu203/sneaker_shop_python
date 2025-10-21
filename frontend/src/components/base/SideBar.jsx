import logo from '../../assets/logoShoes.png';
import { Sidebar as Sidebarz } from 'primereact/sidebar';
import Button, { ButtonSidebar } from '../uiCore/Button/Button';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar({ toggleSidebar }) {
  const navigate = useNavigate();
  const [sport, setSport] = useState(false);
  const location = useLocation();

  return (
    <div
      className={`border-r border-gray-300 bg-white h-screen flex flex-col overflow-auto items-center py-8 gap-4 
          fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out scrollbar-hide
          ${toggleSidebar ? 'w-[var(--width-sidebar)] translate-x-0' : 'w-[var(--width-sidebar)] -translate-x-full'}`}
    >
      <img alt="logo" src={logo} className="w-[8rem] h-[8rem]" />
      <div className="w-full flex flex-col gap-3">
        <ButtonSidebar
          noIcon={true}
          onClick={() => navigate('/')}
          className={`${location.pathname === '/' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Trang chủ
        </ButtonSidebar>
        <ButtonSidebar
          noIcon={true}
          className={`${location.pathname === '/jordan' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Jordan
        </ButtonSidebar>
        <ButtonSidebar
          noIcon={true}
          className={`${location.pathname === '/airmax' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Airmax
        </ButtonSidebar>
        <ButtonSidebar
          noIcon={true}
          className={`${location.pathname === '/nike' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          Nike
        </ButtonSidebar>
        <ButtonSidebar onClick={() => setSport(!sport)}>Thể thao</ButtonSidebar>
        <ShowNavSidebar
          show={sport}
          className={`${location.pathname === '/sport' ? 'text-[var(--primary-yellow)] !bg-[var(--primary-blue)]' : ''}`}
        >
          <ButtonV3>Bóng rổ</ButtonV3>
          <ButtonV3>Bóng đá</ButtonV3>
          <ButtonV3>Golf</ButtonV3>
          <ButtonV3>Tennis</ButtonV3>
        </ShowNavSidebar>
        {/* <ButtonV2 label="test" /> */}
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
      className={`${className} ml-4 w-9/10 flex flex-col gap-2 overflow-hidden transition-all duration-800 ease-in-out transform ${
        show ? 'opacity-100 translate-y-0 max-h-400' : 'opacity-0 translate-y-4 max-h-0'
      }`}
      {...prop}
    >
      {props.children}
    </div>
  );
};
