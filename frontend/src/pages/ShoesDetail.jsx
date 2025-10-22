/* eslint-disable react-hooks/exhaustive-deps */
import { getShoesById } from '@/api/auth/shoesDetailApi';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserState } from '@/store/userState';
import { CreateAxios } from '@/lib/axios';
import { Galleria } from '@/components/uiCore/index';
import { Textz } from '@/components/base/Textz';

const ShoeGallery = ({ shoe, props }) => {
  const itemTemplate = (item) => {
    return (
      <img
        src={item}
        alt="Shoe"
        style={{ width: '30rem', height: '30rem', objectFit: 'cover', borderRadius: '2rem' }}
      />
    );
  };
  return (
    <div className="card">
      <Galleria
        value={shoe.img}
        item={itemTemplate}
        // thumbnail={thumbnailTemplate}
        changeItemOnIndicatorHover
        showThumbnails={false}
        showIndicators
        {...props}
      />
    </div>
  );
};

export default function ShoesDetail() {
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = useMemo(() => CreateAxios(userInfo, setUserInfo), [userInfo]);
  const { id } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shoe = await getShoesById(axiosJWT, id, userInfo?.accessToken);
        setData(shoe?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div className="flex flex-row p-4 gap-16 h-full">
      <div className="w-2/5 sticky top-0 h-full">
        <ShoeGallery shoe={data} />
      </div>
      <div className="w-3/5 p-8 flex flex-col overflow-y-auto h-full">
        <Textz className="text-2xl">{data.name}</Textz>
        <Textz className="mb-2">{data.gender}</Textz>
        <Textz className="mb-4 font-[600]">{data?.price?.toLocaleString('vi-VN')}₫</Textz>
        <div className="flex flex-row gap-2">
          {data?.colors?.map((d, index) => (
            <span
              key={index}
              className={`w-10 h-10 rounded-md hover:cursor-pointer`}
              style={{ backgroundColor: d.color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
