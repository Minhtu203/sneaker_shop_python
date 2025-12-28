import { Textz } from '@/components/base/Textz';
import React, { useEffect, useState } from 'react';
import { useUserState } from '@/store/userState';
import { CreateAxios } from '@/lib/axios';
import { deleteItemsFromFavourites, getItemsFromFavourites } from '@/api/favourites/favouritesApi';
import CardShoes from '@/utils/CardShoes';
import { Toastz } from '@/utils/Toast';

export default function Favourites({ toast }) {
  useEffect(() => {
    document.title = 'Favourite';
  }, []);
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [shoesFav, setShoesFav] = useState([]);
  const [updateFav, setUpdateFav] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getItemsFromFavourites(axiosJWT, userInfo?.accessToken);
        setShoesFav(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [updateFav]);

  const handleUnLike = async (id) => {
    const res = await deleteItemsFromFavourites(axiosJWT, userInfo?.accessToken, id);
    Toastz(res.data, toast);
    setUpdateFav(res.data);
  };

  return (
    <div className="flex flex-col p-8 bg-white min-h-full">
      <Textz className="text-2xl font-[600] pb-8">Favourites</Textz>
      {shoesFav?.fav?.length === 0 && (
        <div className="w-full pt-25 flex justify-center">
          <Textz>Items added to your Favourites will be saved here.</Textz>
        </div>
      )}
      {shoesFav?.fav && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
          {shoesFav?.fav?.map((s) => (
            <CardShoes
              heartClick={() => handleUnLike(s?.productId?._id)}
              heart={true}
              shoe={s?.productId}
              key={s?._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
