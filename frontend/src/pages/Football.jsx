import React, { useEffect, useState } from 'react';
import { WrapperShoes } from './Home';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import CardShoes from '@/utils/CardShoes';
import { getFootballShoes } from '@/api/footballApi';
import Footer from '@/components/base/Footer';

export default function Basketball() {
  useEffect(() => {
    document.title = 'Football';
  }, []);

  const { userInfo, setUserInfo } = useUserState();
  const [allShoes, setAllShoes] = useState([]);
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const data = await getFootballShoes(axiosJWT, userInfo?.accessToken);
        setAllShoes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchShoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <WrapperShoes>
        {allShoes?.data?.data?.map((shoe) => (
          <CardShoes key={shoe._id} shoe={shoe} />
        ))}
      </WrapperShoes>
      <Footer />
    </div>
  );
}
