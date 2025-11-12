import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import CardShoes from '@/utils/CardShoes';
import { useEffect, useState } from 'react';
import { WrapperShoes } from './Home';
import { getAirmaxShoes } from '@/api/airmaxApi';

export default function Airmax() {
  useEffect(() => {
    document.title = 'Airmax';
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const [allShoes, setAllShoes] = useState([]);
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const data = await getAirmaxShoes(axiosJWT, userInfo?.accessToken);
        setAllShoes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WrapperShoes>
      {allShoes?.data?.data?.map((shoe) => (
        <CardShoes key={shoe._id} shoe={shoe} />
      ))}
    </WrapperShoes>
  );
}
