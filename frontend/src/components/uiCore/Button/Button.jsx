import { Button as Buttons } from 'primereact/button';
import { useState } from 'react';

export const ButtonSidebar = (props) => {
  const [rotated, setRotated] = useState(false);
  const { className, onClick, ...prop } = props;

  const handleClick = (e) => {
    setRotated(!rotated);
    if (onClick) onClick(e);
  };
  return (
    <button
      onClick={handleClick}
      className={`${className} px-4 flex justify-between ml-auto items-center w-full h-12 rounded-md text-[var(--primary-blue)] bg-white hover:bg-blue-50
       hover:text-[var(--primary-yellow)] hover:scale-110 hover:cursor-pointer`}
      {...prop}
    >
      {props.children}
      <span
        className={`pi pi-angle-up transform transition-transform duration-300 ${
          rotated ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </button>
  );
};

const Button = ({ className, ...props }) => {
  return (
    <Buttons className={`${className} w-full h-12 rounded-md text-[var(--light)]`} {...props} />
  );
};

export default Button;
