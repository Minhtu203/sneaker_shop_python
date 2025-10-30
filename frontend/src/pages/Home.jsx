import { getAllShoes } from '@/api/homeApi';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import CardShoes from '@/utils/CardShoes';
import { useEffect, useState } from 'react';

function Home() {
  useEffect(() => {
    document.title = 'Home - SneakerT';
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const [allShoes, setAllShoes] = useState([]);

  let axiosJWT = CreateAxios(userInfo, setUserInfo);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const data = await getAllShoes(axiosJWT, userInfo?.accessToken);
        setAllShoes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full p-20 shadow-2xl bg-black relative items-center justify-center">
        <video
          autoPlay
          muted
          loop
          className="font-[BebasNeue] w-full h-100 object-center rounded-2xl"
          src="https://res.cloudinary.com/dw53er2wv/video/upload/v1761040405/Cinematic_Sports_Video_Basketball_-_Shoot_on_RED_-_LA_Clippers_-_Edit_mathiskinny8361_ebfupy.mp4"
        />

        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   text-7xl font-bold text-[var(--light)] drop-shadow-lg"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          JUST DO IT
        </span>
      </div>
      <div className="w-full grid grid-cols-3 gap-4 p-8 pb-8">
        {allShoes?.data?.data?.map((shoe) => (
          <CardShoes key={shoe._id} shoe={shoe} />
        ))}
      </div>
    </div>
  );
}

export default Home;
