import { getIsFeaturedShoes } from '@/api/homeApi';
import Footer from '@/components/base/Footer';
import Header from '@/components/base/Header';
import Sidebar from '@/components/base/SideBar';
import { Textz } from '@/components/base/Textz';
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
        const data = await getIsFeaturedShoes(axiosJWT, userInfo?.accessToken, filter);
        setAllShoes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [toggleSidebar, setToggleSidebar] = useState(true);

  const [filter, setFilter] = useState({
    isFeatured: true,
    gender: '',
    price: '',
    sale: '',
  });

  return (
    <div className={`flex flex-row`}>
      <Sidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} filter={filter} />
      <div className="flex flex-col w-full h-screen">
        <Header toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />
        <div
          className={`overflow-auto flex-1 ${toggleSidebar ? 'ml-[var(--width-sidebar)]' : 'ml-0'} transition-all duration-500 ease-in-out overflow-auto flex flex-col`}
        >
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
          <WrapperShoes>
            {allShoes?.data?.data?.length > 0 ? (
              allShoes.data.data.map((shoe) => <CardShoes key={shoe._id} shoe={shoe} />)
            ) : (
              <div className="w-full col-span-3 flex justify-center">
                <Textz>{allShoes?.data?.message}</Textz>
              </div>
            )}
          </WrapperShoes>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;

export const WrapperShoes = (props) => {
  const { className, ...prop } = props;
  return (
    <div className={`w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-8 pb-8 ${className}`} {...prop}>
      {props.children}
    </div>
  );
};
