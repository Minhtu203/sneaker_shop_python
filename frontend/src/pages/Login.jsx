import { Button, InputTextz } from '@/components/uiCore/index';
import shoesImg from '../assets/airmax97.jpg';
import { useState } from 'react';

function Login() {
  const [account, setAccount] = useState('');

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-4/10 h-full flex items-center justify-center bg-[var(--light)]">
        <img alt="pic" src={shoesImg} />
      </div>
      <div className="w-6/10 h-full bg-[var(--light)] flex items-center justify-center">
        <form className="flex flex-col gap-7 items-center rounded-2xl justify-center shadow-2xl w-1/2 h-2/3 px-12 ">
          <InputTextz
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            label="Tài khoản"
          />
          <InputTextz
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            label="Mật khẩu"
          />
          <Button className="bg-[var(--primary-blue)] text-xl">asdf</Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
