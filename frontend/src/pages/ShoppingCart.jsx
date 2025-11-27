import { deleteItemFromCart } from '@/api/shoppingCartApi';
import { Textz } from '@/components/base/Textz';
import { formattedDate } from '@/components/uiCore/Data/DataTable';
import { Button } from '@/components/uiCore/index';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { Toastz } from '@/utils/Toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

export default function ShoppingCart({ toast }) {
  useEffect(() => {
    document.title = 'Cart';
  }, []);
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState([]);
  const { cartItems, removeLocal } = useCartStore();

  const handleRemoveItem = async (payload) => {
    const res = await deleteItemFromCart(axiosJWT, userInfo?.accessToken, payload);

    if (res.data.success === true) removeLocal(payload);
    Toastz(res.data, toast);
  };

  const handleCheckout = () => {
    console.log(2222);
  };

  const total = checkout?.reduce((sum, item) => sum + Number(item?.price) * Number(item?.quantity), 0);
  const [delivery, setDelivery] = useState(0);
  useEffect(() => {
    if (total < 5000000 && total > 0) setDelivery(30000);
    else if (total === 0) setDelivery(0);
    else setDelivery(0);
  }, [total]);

  return (
    <div className="flex flex-col md:flex-row w-full pb-8">
      <div className="md:w-6/10 p-4 flex flex-col gap-2">
        <Textz className="font-bold">Total: {cartItems?.length || 0} items</Textz>
        {cartItems?.map((shoe, index) => (
          <CardCart
            key={index}
            data={shoe}
            handleRemoveItem={handleRemoveItem}
            checkout={checkout}
            setCheckout={setCheckout}
          />
        ))}
      </div>
      <div className="w-full md:w-4/10 p-4 pt-12 h-full">
        <div className="bg-white w-full rounded-2xl p-12 flex flex-col gap-4 overflow-y-auto">
          <Textz className="text-2xl font-bold pb-4">Summary</Textz>

          <AnimatePresence>
            {checkout?.map((item, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  // className="bg-white p-4 rounded-lg"
                >
                  <div
                    className={`md:h-26 w-full bg-[var(--light)] rounded-2xl flex flex-row  items-center px-4 py-6 md:py-2 gap-4 relative hover:z-10 cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out`}
                  >
                    <Button
                      onClick={() => setCheckout((prev) => prev.filter((_, i) => i !== index))}
                      icon="pi pi-times"
                      rounded
                      text
                      aria-label="Close"
                      className="!absolute !top-[-1rem] !right-[-1rem] !bg-gray-100 !text-gray-500 text-[30rem]"
                    />
                    <img
                      onClick={() => navigate(`/shoes/${item?.productId?._id}`)}
                      alt="Shoes"
                      src={item?.color?.img?.[0]}
                      className="w-16 h-16 col-span-2 object-cover rounded-2xl cursor-pointer"
                    />
                    <Textz className="">{item?.name}</Textz>
                    <Textz className="">Q: {item?.quantity}</Textz>
                    <Textz className="ml-auto">
                      Price:{` `}
                      {formatPrice(item?.price)}
                    </Textz>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="flex flex-row justify-between">
            <Textz>Subtotal</Textz>
            <Textz>{formatPrice(total)}</Textz>
          </div>

          <div className="flex flex-row justify-between">
            <Textz>Estimated Delivery & Handling</Textz>
            {delivery === 0 ? <Textz>Free</Textz> : <Textz>{formatPrice(delivery)}</Textz>}
          </div>
          <i className="h-[1px] w-full bg-gray-200 my-2" />

          <div className="flex flex-row justify-between">
            <Textz className="font-bold">Total</Textz>
            <Textz className="font-bold">{formatPrice(total + delivery)}</Textz>
          </div>

          <i className="h-[1px] w-full bg-gray-200 my-2" />
          <Button onClick={handleCheckout} className="!bg-[var(--primary-blue)] !border-none" label="Check out" />
        </div>
      </div>
    </div>
  );
}

const CardCart = (props) => {
  const { className, data, handleRemoveItem, setCheckout, ...prop } = props;
  const navigate = useNavigate();

  // console.log(111111, data?.name);

  return (
    <div
      {...prop}
      className={`${className} md:h-42 w-full bg-white rounded-2xl grid grid-cols-9 items-center px-4 py-4 md:py-2 gap-4`}
    >
      <img
        onClick={() => navigate(`/shoes/${data?.productId?._id ? data?.productId?._id : data?.productId}`)}
        alt="Shoes"
        src={data?.color?.img?.[0]}
        className="w-32 h-32 col-span-2 object-cover rounded-2xl cursor-pointer"
      />
      <div className="flex flex-col">
        <Textz>{data?.name}</Textz>
        <Textz className="text-xs">{data?.productId?.brand}</Textz>
      </div>
      <Textz className="text-[0.9rem] col-span-2">
        Price: {` `}
        {formatPrice(data?.price)}
      </Textz>
      <Textz className="text-[0.9rem]">Size: {data?.size}</Textz>
      <Textz className="text-[0.9rem] ml-2 hidden md:flex">Quantity: {data?.quantity}</Textz>
      <Textz className="text-[0.9rem] ml-2 md:hidden">Q: {data?.quantity}</Textz>
      <Textz className="text-[0.9rem] ml-2 flex">Date added: {formattedDate(data?.createdAt, 'day/month')}</Textz>

      <br className="md:hidden flex" />
      <div className="flex flex-row md:flex-col md:col-span-1 col-span-4 gap-2">
        <Button
          onClick={() => setCheckout((prev) => [...prev, data])}
          className="!h-10  !text-xs !flex !justify-center !bg-[var(--primary-blue)] !border-none"
          label="Checkout"
        />
        <Button
          onClick={() => {
            handleRemoveItem({
              productId: data?.productId,
              color: data?.color?.colorName,
              size: data?.size,
            });
          }}
          severity="danger"
          className="!h-10  !text-xs !flex !justify-center"
          label="Remove"
        />
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const formatPrice = (data) => {
  return Number(data)?.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};
