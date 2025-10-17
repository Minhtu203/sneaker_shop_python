import { Button, InputText } from '@/components/uiCore/index';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoShoes.png';
function ForgotPassword() {
  const [account, setAccount] = useState('');
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--primary-blue)] flex items-center justify-center w-full h-screen">
      <img className="w-20 h-20 absolute top-4 left-4" alt="logo" src={logo} />
      <form className="bg-[var(--light)] w-[26rem] flex flex-col gap-4 p-12 rounded-2xl items-center relative mx-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 absolute top-2 left-4 hover:underline hover:cursor-pointer text-[var(--primary-blue)]"
        >
          <span className="pi pi-angle-left"></span>
          Đăng nhập
        </button>
        <span className="font-bold text-2xl text-[var(--primary-blue)]">Quên mật khẩu</span>
        <InputText value={account} onChange={(e) => setAccount(e.target.value)} label="Tài khoản" />
        <Button type="button" label="Xác nhận" className="bg-[var(--primary-yellow)]" />
      </form>
    </div>
  );
}

export default ForgotPassword;
