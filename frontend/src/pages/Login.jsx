import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FloatLabel } from 'primereact/floatlabel';

import shoesImg from '../assets/airmax97.jpg';
import logo from '../assets/logoShoes.png';
import { Button, InputText } from '@/components/uiCore/index';

function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-4/10 h-full flex items-center justify-center bg-[var(--light)]">
        <img alt="pic" src={shoesImg} />
      </div>
      <div className="w-6/10 h-full bg-[var(--light)] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-7 items-center rounded-2xl justify-center shadow-2xl w-1/2 px-12 py-15"
        >
          <img className="w-30 h-30" alt="logo" src={logo} />
          <InputText
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            label="Tài khoản"
          />
          <InputPassword value={password} setPassword={setPassword} type={'password'} />
          <Button
            type="submit"
            style={{ backgroundColor: 'var(--primary-blue)', color: 'var(--light)' }}
            label="Đăng nhập"
          />
          <div className="flex flex-row justify-between w-full">
            <Link to="/forgotpassword" className="hover:underline text-[var(--primary-blue)]">
              Quên mật khẩu
            </Link>
            <Link to="/register" className="hover:underline text-[var(--primary-blue)]">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

export const InputPassword = ({ password, setPassword, className }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const toggleHidePassword = () => {
    setTogglePassword(!togglePassword);
  };

  return (
    <div className={`${className} w-full h-12 relative flex items-center`}>
      <FloatLabel className="w-full">
        <InputText
          id="password"
          type={togglePassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            if (!/\s/.test(value)) {
              setPassword(value);
            }
          }}
          className="w-full h-12 rounded-md p-4 border-2 border-[var(--primary-blue)] outline-none"
        />
        <label htmlFor="password" className="text-[var(--primary-blue)] flex flex-row ml-2">
          Mật khẩu
        </label>
      </FloatLabel>

      {togglePassword ? (
        <i
          className="pi pi-eye absolute right-0 flex items-center text-[var(--primary-blue)] cursor-pointer mr-3"
          onClick={toggleHidePassword}
        />
      ) : (
        <i
          className="pi pi-eye-slash absolute right-0 flex items-center text-[var(--primary-blue)] cursor-pointer mr-3"
          onClick={toggleHidePassword}
        />
      )}
    </div>
  );
};
