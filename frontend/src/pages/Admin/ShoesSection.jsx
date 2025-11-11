/* eslint-disable react-hooks/exhaustive-deps */
import { deleteShoesById } from '@/api/admin/shoesSectionApi';
import { getAllShoes } from '@/api/homeApi';
import { Textz } from '@/components/base/Textz';
import { formattedDate } from '@/components/uiCore/Data/DataTable';
import {
  Button,
  Column,
  DataTable,
  Dialog,
  DropDown,
  InputNumber,
  InputText,
  InputTextarea,
  RadioButton,
  ToggleButton,
  ToggleButtonz,
} from '@/components/uiCore/index';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { Toastz } from '@/utils/Toast';
import React, { useEffect, useState } from 'react';

const UpdateInput = () => {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <InputText label="asdf" />
      <InputText label="asdf" />
      <InputText label="asdf" />
      <InputText label="asdf" />
      <InputText label="asdf" />
    </div>
  );
};

export default function ShoesSection({ toast }) {
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [allShoes, setAllShoes] = useState([]);
  const [deleteShoes, setDeleteShoes] = useState('');
  const [updateShoes, setUpdateShoes] = useState('');

  const [selectCategory, setSelectCategory] = useState(null);
  const category = [
    { name: 'Sneaker' },
    { name: 'Running' },
    { name: 'Basketball' },
    { name: 'Training' },
    { name: 'Outdoor' },
    { name: 'Life style' },
    { name: 'Formal' },
  ];

  const [selectGender, setSelectGender] = useState(null);
  const gender = [{ name: 'Men' }, { name: 'Women' }, { name: 'Unisex' }];

  const [isFeatured, setIsFeatured] = useState(true);

  // get all shoes
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
  }, [userInfo, deleteShoes, updateShoes]);

  // delete shoes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (deleteShoes) {
          const res = await deleteShoesById(axiosJWT, userInfo?.accessToken, deleteShoes);
          Toastz(res.data, toast);
          setDeleteShoes('');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [deleteShoes]);

  const [visibleCreate, setVisibleCreate] = useState(false);
  const [numberColor, setNumberColor] = useState(null);
  const [data, setData] = useState({ colors: [{ img: [] }] }); //params
  // const [colors, setColors] = useState(data?.colors || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setData({ ...data, colors: data.colors });
    console.log(1111, data);
  };

  const [inputSize, setInputSize] = useState([{ id: Date.now() }]);

  const addInputSize = () => {
    setInputSize((prev) => [...prev, { id: Date.now() + Math.random() }]);
  };

  const removeInputSize = (id) => {
    setInputSize((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-col-2 md:grid-cols-5">
        <Button
          onClick={() => setVisibleCreate(true)}
          className="!bg-[var(--primary-blue)] !border-none"
          label="Create new shoes"
        />
      </div>
      <DataTable
        toast={toast}
        setDelete={setDeleteShoes}
        setUpdate={setUpdateShoes}
        updateDataChildren={<UpdateInput />}
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
          body={(i) => <img src={i?.colors?.[0]?.img?.[0]} alt="shoes" className="w-20 h-20 rounded-2xl" />}
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
        <Column header="Created at" body={(i) => formattedDate(i?.createdAt)} />
        <Column header="Is featured" body={(i) => i.isFeatured} />
        <Column header="Category" body={(i) => i.category} />
      </DataTable>
      <Dialog
        header="Create new shoes"
        className="w-[80%] md:w-[50vw]"
        visible={visibleCreate}
        onHide={() => {
          if (!visibleCreate) return;
          setVisibleCreate(false);
        }}
      >
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8">
          <InputText
            value={data?.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            label="Shoes name"
          />
          <InputText
            value={data?.brand || ''}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
            label="Brand"
          />
          <InputText
            value={data?.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            label="Description"
          />
          <InputText
            value={data?.price || ''}
            onChange={(e) => setData({ ...data, price: e.target.value })}
            label="Price"
          />
          <div className="flex flex-row gap-6">
            <Textz className="font-bold">Number of colors:</Textz>
            <RadioButton
              onChange={(e) => setNumberColor(e.value)}
              checked={numberColor === '1'}
              value="1"
              label="1"
              inputId="1"
            />
            <RadioButton
              onChange={(e) => setNumberColor(e.value)}
              checked={numberColor === '2'}
              value="2"
              label="2"
              inputId="2"
            />
            <RadioButton
              onChange={(e) => setNumberColor(e.value)}
              checked={numberColor === '3'}
              value="3"
              label="3"
              inputId="3"
            />
            <RadioButton
              onChange={(e) => setNumberColor(e.value)}
              checked={numberColor === '4'}
              value="4"
              label="4"
              inputId="4"
            />
          </div>
          {numberColor &&
            [...Array(Number(numberColor))].map((c, index) => (
              <div key={index} className="flex flex-col gap-6 slide-down">
                <Textz className="font-bold text-xs">Color {index + 1}</Textz>
                <InputText
                  value={data?.colors?.[index]?.colorName || ''}
                  onChange={(e) => {
                    const updated = [...data.colors];
                    updated[index] = { ...updated[index], colorName: e.target.value };
                    setData({ ...data, colors: updated });
                  }}
                  label="Color name"
                />
                <InputText
                  value={data?.colors?.[index]?.color || ''}
                  onChange={(e) => {
                    const updated = [...data.colors];
                    updated[index] = { ...updated[index], color: e.target.value };
                    setData({ ...data, colors: updated });
                  }}
                  label="Color code (eg: #fffff)"
                />
                <InputLink value={data.colors[index].img?.[0] || ''} setData={setData} index={index} number="1" />
                <InputLink value={data.colors[index].img?.[1] || ''} setData={setData} index={index} number="2" />
                <InputLink value={data.colors[index].img?.[2] || ''} setData={setData} index={index} number="3" />
                <InputLink value={data.colors[index].img?.[3] || ''} setData={setData} index={index} number="4" />
                <InputLink value={data.colors[index].img?.[4] || ''} setData={setData} index={index} number="5" />

                <i className="h-[1px] w-full bg-gray-300 mt-4" />
              </div>
            ))}
          <div className="flex flex-row gap-4 items-center">
            <Textz className="font-bold">Size:</Textz>

            <Button
              onClick={addInputSize}
              className="!bg-white !text-gray-500 flex justify-start"
              type="button"
              label="+ Add size"
            />
          </div>
          {inputSize.map((item) => (
            <div key={item.id} className="flex flex-row gap-3">
              <InputGroup />
              <Button
                onClick={() => removeInputSize(item.id)}
                type="button"
                className="px-3 !bg-white !text-red-700 !border-none !text-xs !w-20 flex justify-center"
                label="Remove"
              />
            </div>
          ))}

          <DropDown
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.value)}
            options={category}
            optionLabel="name"
            placeholder="Select category"
          />
          <DropDown
            value={selectGender}
            onChange={(e) => setSelectGender(e.value)}
            options={gender}
            optionLabel="name"
            placeholder="Select gender"
          />
          <div className="flex flex-row gap-3 items-center">
            <Textz className="font-bold text-md">Is Featured: </Textz>
            <ToggleButtonz checked={isFeatured} onChange={(e) => setIsFeatured(e.value)} />
          </div>

          <Button type="submit" label="Create" className="!bg-[var(--primary-blue)] !border-none" />
        </form>
      </Dialog>
    </div>
  );
}

const InputLink = (props) => {
  const { number, index, setData, ...prop } = props;
  return (
    <InputText
      {...prop}
      onChange={(e) => {
        setData((prev) => {
          const updatedColors = [...prev.colors];
          const updateImg = [...updatedColors[index].img];
          updateImg[Number(number - 1)] = {
            ...updateImg[Number(number - 1)],
            img: [e.target.value],
          };
          updatedColors[index] = {
            ...updatedColors[index],
            img: updateImg,
          };

          return { ...prev, colors: updatedColors };
        });
      }}
      label={
        <div className="flex items-center gap-2">
          <i className="pi pi-link" /> {`URL image ${number}`}
        </div>
      }
    />
  );
};

const InputGroup = () => {
  return (
    <div className="card flex flex-column md:flex-row gap-3">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="fa-solid fa-shoe-prints"></i>
        </span>
        <InputNumber type="number" placeholder="Size" />
      </div>

      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="fa-solid fa-warehouse"></i>
        </span>
        <InputNumber type="number" placeholder="Stock" />
      </div>
    </div>
  );
};
