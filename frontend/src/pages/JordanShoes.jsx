import { getAllJordanShoes } from '@/api/jordanApi';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import CardShoes from '@/utils/CardShoes';
import { useEffect, useState } from 'react';

function JordanShoes() {
  useEffect(() => {
    document.title = 'Jordan';
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [jordanShoes, setJordanShoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllJordanShoes(axiosJWT, userInfo?.accessToken);
        setJordanShoes(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4 p-4">
      {jordanShoes?.data?.data?.map((shoe) => (
        <CardShoes key={shoe._id} shoe={shoe} />
      ))}
    </div>
  );
}

export default JordanShoes;
