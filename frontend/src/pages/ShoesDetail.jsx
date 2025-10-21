/* eslint-disable react-hooks/exhaustive-deps */
import { getShoesById } from '@/api/auth/shoesDetailApi';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserState } from '@/store/userState';
import { CreateAxios } from '@/lib/axios';
import { Galleria } from '@/components/uiCore/index';

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
  // const thumbnailTemplate = (item) => {
  //   return (
  //     <img
  //       src={item}
  //       alt="Shoe thumbnail"
  //       style={{ width: '100%', height: '50px', objectFit: 'cover' }}
  //     />
  //   );
  // };
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
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
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
  }, [userInfo, id, axiosJWT]);

  return (
    <div className="flex flex-row p-4 gap-16">
      <div className="w-2/5">
        <ShoeGallery shoe={data} />
      </div>
      <div className=" w-3/5 p-8 flex flex-col">
        <span className="text-2xl ">{data.name}</span>
        <span className="text-md mb-2">{data.gender}</span>
        <span className="text-md font-[600] mb-4">{data?.price?.toLocaleString('vi-VN')}₫</span>
        <div className="flex flex-row gap-2">
          {data?.colors?.map((d, index) => (
            <span
              key={index}
              className={`w-10 h-10 rounded-md`}
              style={{ backgroundColor: d.color }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
