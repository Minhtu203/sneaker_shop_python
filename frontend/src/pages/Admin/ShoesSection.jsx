import { getAllShoes } from '@/api/homeApi';
import { Column, DataTable } from '@/components/uiCore/index';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import React, { useEffect, useState } from 'react';

export default function ShoesSection() {
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [allShoes, setAllShoes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllShoes(axiosJWT, userInfo?.accessToken);
        setAllShoes(data?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <div className="flex flex-col">
      {/* <Textz className="text-3xl font-bold mb-8">Users</Textz> */}
      <DataTable
        value={allShoes}
        paginator
        action
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRecords={allShoes?.length}
      >
        <Column sortable header="Brand" field="brand" />
        <Column sortable header="Name" field="name" />
        <Column
          header="Image"
          body={(i) => <img src={i?.img[0]} alt="shoes" className="w-20 h-20 rounded-2xl" />}
        />
        <Column
          sortable
          header="Price"
          body={(i) =>
            i?.price.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })
          }
        />
      </DataTable>
    </div>
  );
}
