import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoShoes.png';
import { useEffect, useState } from 'react';
import { Button, InputText, Toast } from '@/components/uiCore/index';
import { registerApi } from '@/api/auth/registerApi';
import { InputPassword } from './Login';
import { Toastz } from '@/utils/Toast';

function Register({ toast }) {
  useEffect(() => {
    document.title = 'SneakerT - Register';
  }, []);

  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { username: account, password, email };
    const res = await registerApi(data);
    Toastz(res.data, toast);
    if (res.data.success === true) navigate('/login');
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
          Log in
        </button>
        <span className="font-bold text-2xl text-[var(--primary-blue)]">Register</span>
        <InputText value={account} onChange={(e) => setAccount(e.target.value)} label="Tài khoản" />
        <InputPassword password={password} setPassword={setPassword} label="Password" />
        <InputText value={email} onChange={(e) => setEmail(e.target.value)} label="Email" />
        <Button type="submit" label="Submit" className="!bg-[var(--primary-yellow)]" />
      </form>
    </div>
  );
}

export default Register;
