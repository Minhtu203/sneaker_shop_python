import { Button, Dialog, InputOtp, InputText, Toast } from '@/components/uiCore/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logoShoes.png';
import { forgotPasswordApi, resetPasswordApi } from '@/api/auth/forgotPasswordApi';
import { InputPassword } from './Login';
import { Textz } from '@/components/base/Textz';
import { Toastz } from '@/utils/Toast';
function ForgotPassword({ toast }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPasswordApi(username);
      Toastz(res.data, toast);
      if (res.data?.success === true) setShowOtp(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChargePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPasswordApi(username, otp, password);
      Toastz(res.data, toast);
      setShowOtp(false);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showOtp) {
      setOtp(''); // reset mỗi khi mở dialog
    }
  }, [showOtp]);

  return (
    <div className="bg-[var(--primary-blue)] flex items-center justify-center w-full h-screen">
      <img className="w-20 h-20 absolute top-4 left-4" alt="logo" src={logo} />
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--light)] w-[26rem] flex flex-col gap-4 p-12 rounded-2xl items-center relative mx-4"
      >
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
        <Button type="submit" label="Submit" className="!bg-[var(--primary-yellow)] !border-none" />
      </form>
      <Dialog
        header="Confirm OTP & new password"
        visible={showOtp}
        style={{ width: '30%' }}
        onHide={() => {
          if (!showOtp) return;
          setShowOtp(false);
        }}
      >
        <form
          onSubmit={handleChargePassword}
          autoComplete="off"
          className="flex flex-col gap-6 items-center justify-center"
        >
          <Textz className="font-bold text-2xl">OTP</Textz>
          <InputOtp
            value={otp}
            onChange={(e) => setOtp(e.value)}
            length={6}
            integerOnly
            autoComplete="off"
          />
          <InputPassword className="mt-4" password={password} setPassword={setPassword} />
          <Button
            type="submit"
            label="Charge password"
            className="!bg-[var(--primary-blue)] !border-none"
          />
        </form>
      </Dialog>
    </div>
  );
}

export default ForgotPassword;
