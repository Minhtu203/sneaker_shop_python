import { Button as Buttons } from 'primereact/button';

const Button = ({ className, ...props }) => {
  return (
    <Buttons className={`${className} w-full h-12 rounded-md text-[var(--light)]`} {...props} />
  );
};

export default Button;
