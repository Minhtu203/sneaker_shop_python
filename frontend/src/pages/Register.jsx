import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoShoes.png';
import { useState } from 'react';
import { Button, InputText } from '@/components/uiCore/index';

function Register() {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ account, password, email });
  };

  return (
    <div className="bg-[var(--primary-blue)] flex items-center justify-center w-full h-screen">
      <img className="w-20 h-20 absolute top-4 left-4" alt="logo" src={logo} />
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--light)] w-[26rem] flex flex-col gap-7 p-12 rounded-2xl items-center relative"
      >
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 absolute top-2 left-4 hover:underline hover:cursor-pointer text-[var(--primary-blue)]"
        >
          <span className="pi pi-angle-left"></span>
          Đăng nhập
        </button>
        <span className="font-bold text-2xl text-[var(--primary-blue)]">Đăng ký</span>
        <InputText value={account} onChange={(e) => setAccount(e.target.value)} label="Tài khoản" />
        <InputText
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Mật khẩu"
        />
        <InputText value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
        <Button type="submit" label="Xác nhận" className="bg-[var(--primary-yellow)]" />
      </form>
    </div>
  );
}

export default Register;
