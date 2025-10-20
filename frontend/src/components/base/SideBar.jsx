import logo from '../../assets/logoShoes.png';
import { Sidebar as Sidebarz } from 'primereact/sidebar';
import Button, { ButtonSidebar } from '../uiCore/Button/Button';

function Sidebar({ toggleSidebar }) {
  return (
    <div
      className={`border border-gray-300 bg-white h-screen flex flex-col items-center py-8 gap-4 
          fixed top-0 left-0 z-50 transition-all duration-500 ease-in-out
          ${toggleSidebar ? 'w-[var(--width-sidebar)] translate-x-0' : 'w-[var(--width-sidebar)] -translate-x-full'}`}
    >
      <img alt="logo" src={logo} className="w-[8rem] h-[8rem]" />
      <div className="w-9/10 flex flex-col gap-3">
        <ButtonSidebar noIcon={true} onClick={() => console.log(988888)}>
          Home
        </ButtonSidebar>
        <ButtonSidebar>Jordan</ButtonSidebar>
        <ButtonSidebar>Golf</ButtonSidebar>
        <ButtonSidebar>Bóng rổ</ButtonSidebar>
        <ButtonSidebar>Training & Gym</ButtonSidebar>
        <ButtonSidebar>Thể thao</ButtonSidebar>
        <ButtonV2 label="asdf" />
      </div>
    </div>
  );
}

export default Sidebar;

const ButtonV2 = ({ className, ...props }) => {
  return (
    <Button
      className={`${className} hover:scale-110 !bg-gradient-to-r !from-[#274480] to-[#4C6AB0] !transition-all !duration-200`}
      {...props}
    />
  );
};
