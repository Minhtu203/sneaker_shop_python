import React, { useState } from 'react';
import { useUserState } from '@/store/userState';
import { CreateAxios } from '@/lib/axios';
import defaultAvatar from '.././assets/userDefault.png';
import { Button, InputText } from '@/components/uiCore/index';
import { Textz } from '@/components/base/Textz';
import { updateUserApi } from '@/api/user/updateUser';
import { Toastz } from '@/utils/Toast';

export default function UserPage({ toast }) {
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);

  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      fullName,
      username,
      avatar,
    };
    const res = await updateUserApi(axiosJWT, userInfo?.accessToken, data);
    Toastz(res.data, toast);
  };

  const [fullName, setFullName] = useState(userInfo?.fullName || null);
  const [username, setUsername] = useState(userInfo?.username);

  return (
    <div className="w-full p-8">
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-4xl p-8 flex flex-col gap-9">
        <div className="w-full flex flex-col items-center">
          <img
            src={userInfo?.avatar || defaultAvatar}
            className="w-18 h-18 object-cover rounded-[50%] hover:cursor-pointer"
            alt="Avatar"
          />
          <Textz>{userInfo?.fullName ? userInfo?.fullName : userInfo?.username}</Textz>
        </div>

        <InputText value={fullName} onChange={(e) => setFullName(e.target.value)} label="FullName" />
        <InputText value={username} onChange={(e) => setUsername(e.target.value)} label="Username" />
        <InputText value={userInfo?.email} label="*Email" />
        <InputText value={userInfo?.role} label="*Role" />

        <div className="flex flex-col items-center gap-4 w-full">
          <label className="border border-gray-300 p-2 rounded-md w-full flex items-center justify-between">
            <span className={avatar ? 'text-gray-600 pl-2 truncate' : 'text-gray-400 flex gap-2 items-center pl-2'}>
              {!avatar && <i className="pi pi-link" />}
              {avatar || 'Paste avatar image link...'}
            </span>

            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="outline-none border-none bg-transparent text-gray-700 text-right w-[60%]"
            />
          </label>

          {avatar && <img src={avatar} alt="Preview" className="w-28 h-28 object-cover rounded-xl shadow-md" />}
        </div>
        <Button
          type="submit"
          className="!bg-[var(--primary-blue)] !border-none !mb-8 !w-20 ml-auto !mr-6"
          label="Save"
        />
      </form>
    </div>
  );
}
