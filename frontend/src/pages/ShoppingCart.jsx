/* eslint-disable react-hooks/exhaustive-deps */
import { getItemsInCart } from '@/api/shoppingCartApi';
import { Textz } from '@/components/base/Textz';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';

export default function ShoppingCart() {
  useEffect(() => {
    document.title = 'Cart';
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [allShoes, setAllShoes] = useState([]);

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
  });

  // console.log(222, allShoes);

  return (
    <div className="flex flex-row h-full w-full gap-2">
      <div className="w-6/10 p-4 flex flex-col gap-2">
        {allShoes?.items?.map((shoe, index) => (
          <CardCart key={index} data={shoe} index={index + 1} />
        ))}
      </div>
      <div className="w-4/10 h-full bg-black">asdf</div>
    </div>
  );
}

const CardCart = (props) => {
  const { className, data, index, ...prop } = props;
  // console.log(data);

  return (
    <div
      {...prop}
      className={`${className} h-42 w-full bg-white rounded-2xl flex flex-row items-center px-4 py-2 gap-4`}
    >
      <span className="text-gray-400">{index}</span>
      <img alt="Shoes" src={data?.color?.img?.[0]} className="w-32 h-32 rounded-2xl" />
      <div className="flex flex-col">
        <Textz>{data?.productId?.name}</Textz>
        <Textz className="text-xs">{data?.productId?.brand}</Textz>
      </div>
    </div>
  );
};
