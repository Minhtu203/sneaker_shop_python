/* eslint-disable react-hooks/exhaustive-deps */
import { deleteItemFromCart, getItemsInCart } from '@/api/shoppingCartApi';
import { Textz } from '@/components/base/Textz';
import { formattedDate } from '@/components/uiCore/Data/DataTable';
import { Button } from '@/components/uiCore/index';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { Toastz } from '@/utils/Toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ShoppingCart({ toast }) {
  useEffect(() => {
    document.title = 'SneakerT - Cart';
  }, []);
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);

  const [allShoes, setAllShoes] = useState([]);
  const [updateCart, setUpdateCart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItemsInCart(axiosJWT, userInfo?.accessToken);
        setAllShoes(res.data?.cartItems);
      } catch (error) {
        console.error(error.message || error);
      }
    };
    fetchData();
  }, [updateCart]);

  const handleRemoveItem = async (payload) => {
    const res = await deleteItemFromCart(axiosJWT, userInfo?.accessToken, payload);
    Toastz(res.data, toast);
    setUpdateCart(res.data);
  };

  const handleCheckout = () => {
    console.log(2222);
  };

  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-6/10 p-4 flex flex-col gap-2">
        <Textz className="font-bold">Total: {allShoes?.items?.length || 0} items</Textz>
        {allShoes?.items?.map((shoe, index) => (
          <CardCart key={index} data={shoe} handleRemoveItem={handleRemoveItem} handleCheckout={handleCheckout} />
        ))}
      </div>
      <div className="w-4/10 p-4 h-full pt-12">
        <div className="bg-white w-full h-full rounded-2xl p-12">asdf</div>
      </div>
    </div>
  );
}

const CardCart = (props) => {
  const { className, data, handleRemoveItem, handleCheckout, ...prop } = props;
  const navigate = useNavigate();
  console.log(111, data);

  return (
    <div
      {...prop}
      className={`${className} h-42 w-full bg-white rounded-2xl grid grid-cols-9 items-center px-4 py-2 gap-4`}
    >
      <img
        onClick={() => navigate(`/shoes/${data?.productId?._id}`)}
        alt="Shoes"
        src={data?.color?.img?.[0]}
        className="w-32 h-32 col-span-2 object-cover rounded-2xl cursor-pointer"
      />
      <div className="flex flex-col">
        <Textz>{data?.productId?.name}</Textz>
        <Textz className="text-xs">{data?.productId?.brand}</Textz>
      </div>
      <Textz className="text-[0.9rem] col-span-2">
        Price: {` `}
        {Number(data?.price)?.toLocaleString('vi-VN', {
          style: 'currency',
          currency: 'VND',
        })}
      </Textz>
      <Textz className="text-[0.9rem]">Size: {data?.size}</Textz>
      <Textz className="text-[0.9rem] ml-2 flex">Quantity: {data?.quantity}</Textz>
      <Textz className="text-[0.9rem] ml-2 flex">Date added: {formattedDate(data?.createdAt, 'day/month')}</Textz>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleCheckout}
          className="!h-10 !text-xs !flex !justify-center !bg-[var(--primary-blue)] !border-none"
          label="Checkout"
        />
        <Button
          onClick={() => {
            handleRemoveItem({
              productId: data?.productId?._id,
              color: data?.color?.colorName,
              size: data?.size,
            });
          }}
          severity="danger"
          className="!h-10 !text-xs !flex !justify-center"
          label="Remove"
        />
      </div>
    </div>
  );
};
