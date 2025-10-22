import { Button, InputText, Toast } from '@/components/uiCore/index';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoShoes.png';
import { forgotPasswordApi } from '@/api/auth/forgotPasswordApi';
function ForgotPassword() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const toast = useRef(null);
  const [data, setData] = useState({});

  const handleSubmit = async () => {
    try {
      const res = await forgotPasswordApi(username);
      setData(res.data);
      console.log(res.data);
      if (res.data.success === false) showError();
    } catch (error) {
      console.error(error);
    }
  };

  const showError = () => {
    toast.current.show({ severity: 'error', summary: data?.message, detail: 'Message Content' });
  };

  return (
    <div className="bg-[var(--primary-blue)] flex items-center justify-center w-full h-screen">
      <Toast ref={toast} />
      <img className="w-20 h-20 absolute top-4 left-4" alt="logo" src={logo} />
      <form className="bg-[var(--light)] w-[26rem] flex flex-col gap-4 p-12 rounded-2xl items-center relative mx-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center justify-center gap-2 absolute top-2 left-4 hover:underline hover:cursor-pointer text-[var(--primary-blue)]"
        >
          <span className="pi pi-angle-left"></span>
          Log in
        </button>
        <span className="font-bold text-2xl text-[var(--primary-blue)] mb-4">Forgot password</span>
        <InputText
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
        />
        <Button
          onClick={handleSubmit}
          type="button"
          label="Submit"
          className="!bg-[var(--primary-yellow)] !border-none"
        />
      </form>
    </div>
  );
}

export default ForgotPassword;
