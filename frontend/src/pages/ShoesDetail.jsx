/* eslint-disable react-hooks/exhaustive-deps */
import { getShoesById } from '@/api/auth/shoesDetailApi';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserState } from '@/store/userState';
import { CreateAxios } from '@/lib/axios';
import { Button, Dialog, Galleria, Rating } from '@/components/uiCore/index';
import { Textz } from '@/components/base/Textz';
import { SizeGuideIcon } from '@/assets/icon/sizeGuide';
import { addItemToCart } from '@/api/shoppingCartApi';
import { Toastz } from '@/utils/Toast';
import { addItemToFavourites } from '@/api/favourites/favouritesApi';

const ShoeGallery = ({ shoeImg, props }) => {
  const itemTemplate = (item) => {
    return (
      <img
        src={item}
        alt="Shoes"
        style={{ width: '30rem', height: '30rem', objectFit: 'cover', borderRadius: '2rem' }}
      />
    );
  };

  return (
    <div className="card">
      <Galleria
        value={shoeImg} //array
        item={itemTemplate}
        changeItemOnIndicatorHover
        showThumbnails={false}
        showIndicators
        {...props}
      />
    </div>
  );
};

export default function ShoesDetail({ toast }) {
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const { id } = useParams();
  const [data, setData] = useState({});
  const [selectedColor, setSelectedColor] = useState([]);
  const [rating, setRating] = useState(null);
  const [visibleSizeGuide, setVisibleSizeGuide] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shoe = await getShoesById(axiosJWT, id, userInfo?.accessToken);
        setData(shoe?.data?.data);
        setRating(shoe?.data?.data.rating.average);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    document.title = `${data?.name || 'Loading...'}`;
  }, [data]);

  // init selectedColor
  useEffect(() => {
    if (data && data.colors?.[0].img) {
      setSelectedColor(data.colors?.[0]);
    }
  }, [data]);

  const idScreenShoes = useParams();
  const [size, setSize] = useState(null);
  const handleAddToBag = async () => {
    const payload = {
      productId: idScreenShoes.id,
      color: selectedColor?.colorName,
      quantity: selectedColor?.quantity || 1,
      size: size?.size,
    };
    const res = await addItemToCart(axiosJWT, userInfo?.accessToken, payload);
    Toastz(res.data, toast);
  };

  const handleFavourites = async () => {
    const res = await addItemToFavourites(axiosJWT, userInfo?.accessToken, id);
    Toastz(res.data, toast);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-16 md:h-full">
      <div className="md:w-2/5 w-full md:sticky md:top-0 md:h-full">
        <ShoeGallery shoeImg={selectedColor?.img} />
      </div>
      <div className="md:w-3/5 w-full p-8 md:pr-50 pb-50 flex flex-col overflow-y-auto max-h-screen">
        <Textz className="text-2xl">{data.name}</Textz>
        <Textz className="mb-2">{data.gender}</Textz>
        <Textz className="mb-4 font-[600]">{data?.price?.toLocaleString('vi-VN')}₫</Textz>

        {/* color change */}
        <div className="flex flex-row gap-2 my-3 mb-12">
          {data?.colors?.map((d, index) => (
            <button
              onClick={() => setSelectedColor(d)}
              key={index}
              className="w-10 h-10 rounded-md hover:cursor-pointer"
              style={{ backgroundColor: d.color }}
            />
          ))}
        </div>

        <div className="flex flex-row justify-between">
          <Textz className="font-medium">Select Size</Textz>
          <button
            onClick={() => setVisibleSizeGuide(true)}
            className="font-medium flex flex-row gap-1 cursor-pointer text-[var(--primary-blue)]"
          >
            <SizeGuideIcon className="text-[var(--primary-blue)]" />
            Size Guide
          </button>
        </div>
        <span className="text-[0.9rem] my-2 text-gray-500">Fits small; we recommend ordering half a size up</span>
        <div className="grid grid-cols-3 gap-2">
          {selectedColor?.sizes?.map((s) => (
            <React.Fragment key={s._id}>
              {s?.stock === 0 ? (
                <Button
                  disabled
                  onClick={() => setSize(s)}
                  className={`${s?.stock === 0 ? '!text-gray-400' : '!text-[var(--primary-blue)]'}  !text-[var(--primary-blue)] !border-[var(--primary-blue)] justify-center focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]`}
                  outlined
                  label={s?.size}
                />
              ) : (
                <Button
                  onClick={() => setSize(s)}
                  className={`${s?.stock === 0 ? '!text-gray-400' : '!text-[var(--primary-blue)]'}  !text-[var(--primary-blue)] !border-[var(--primary-blue)] justify-center focus:!shadow-[0_0_0_0.2rem_rgba(99,102,241,0.5)]`}
                  outlined
                  label={s?.size}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {size && <Textz className="text-md mt-1">Stock: {size?.stock || 0}</Textz>}
        <div className="flex flex-col gap-3 mb-8 mt-6">
          <Button
            onClick={handleAddToBag}
            className="!rounded-[2rem] h-14 !bg-[var(--primary-blue)] !border-none"
            label="Add to Bag"
          />
          <Button
            className="!rounded-[2rem] h-14 !bg-[var(--light)] !border !border-[var(--primary-blue)] !text-[var(--primary-blue)] justify-center"
            label="Favourite"
            onClick={handleFavourites}
          >
            <span className="pi pi-heart" />
          </Button>
        </div>
        <Textz>{data?.description}</Textz>
        <Textz className="flex flex-row mt-10 text-2xl font-bold justify-between">
          Reviews({`${data?.rating?.count}`})
          <Rating
            cancel={false}
            value={rating}
            // onChange={(e) => setRating(e.value)}
          />
        </Textz>
      </div>
      <Dialog
        className="w-[80%] md:w-[50vw]"
        header="Size Guide"
        visible={visibleSizeGuide}
        onHide={() => {
          if (!visibleSizeGuide) return;
          setVisibleSizeGuide(false);
        }}
      >
        <div className="flex flex-col">
          <img
            className="rounded-2xl"
            alt="image"
            src="https://res.cloudinary.com/dw53er2wv/image/upload/v1761637091/Tieng-Anh_sekgpp.jpg"
          />
          <Textz className="font-bold text-xl my-4">How to measure foot length</Textz>
          <div className="pl-4 flex flex-col gap-4">
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">01</span>
              Tape a piece of paper to a hard, flat surface, ensuring the paper doesn't slip.
            </div>
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">02</span>
              Stand on the paper, feet shoulder width apart and weight evenly balanced (only one foot will be on the
              paper).
            </div>
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">03</span>
              With a pen or pencil pointed straight down, have a friend or partner assist you by marking the tip of the
              big toe and the outermost part of the heel.
            </div>
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">04</span>
              Once the marks are recorded, step off the paper and use a ruler or tape measure to measure the distance
              between the two points. This measurement represents the length of the foot.
            </div>
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">05</span>
              Repeat the process with the other foot. Please note that it is common for one foot to be a slightly
              different length to the other.
            </div>
            <div className="flex flex-row gap-3 font-bold">
              <span className="text-gray-400">06</span>
              Apply the longer of the two measurements to our size chart to find the right correlating size for the
              recorded foot length. If the measurement is between sizes, we recommend sizing up.
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
