/* eslint-disable react-hooks/exhaustive-deps */
import { createShoesApi, deleteShoesById, updateShoesApi } from '@/api/admin/shoesSectionApi';
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
  RadioButton,
  ToggleButtonz,
} from '@/components/uiCore/index';
import { CreateAxios } from '@/lib/axios';
import { useUserState } from '@/store/userState';
import { Toastz } from '@/utils/Toast';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateInput = () => {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <InputText label="Name" />
      <InputText label="Brand" />
      <InputText label="Price" />
    </div>
  );
};

export default function ShoesSection({ toast }) {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserState();
  let axiosJWT = CreateAxios(userInfo, setUserInfo);
  const [allShoes, setAllShoes] = useState([]);
  const [deleteShoes, setDeleteShoes] = useState('');
  const [updateShoes, setUpdateShoes] = useState('');

  const category = [
    { name: 'Training' },
    { name: 'Basketball' },
    { name: 'Football' },
    { name: 'Golf' },
    { name: 'Tennis' },
    { name: 'Running' },
    { name: 'Outdoor' },
    { name: 'Life style' },
  ];

  const brand = [{ name: 'Nike' }, { name: 'Adidas' }, { name: 'Airmax' }, { name: 'Jordan' }];

  const gender = [{ name: 'Men' }, { name: 'Women' }, { name: 'Unisex' }];

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

  const [idShoesFeatured, setIdShoesFeatured] = useState(null);
  //update shoes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (updateShoes) {
          const data = { isFeatured: idShoesFeatured };
          const res = await updateShoesApi(axiosJWT, userInfo?.accessToken, updateShoes, data);
          Toastz(res.data, toast);
          setUpdateShoes('');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [updateShoes]);

  const [visibleCreate, setVisibleCreate] = useState(false);
  const [numberColor, setNumberColor] = useState(null);

  //params
  const [data, setData] = useState({
    name: '',
    brand: '',
    description: '',
    price: 0,
    colors: [{ img: [], sizes: [] }],
    category: '',
    gender: '',
    isFeatured: 'false',
  });

  const handleCreateShoes = async (e) => {
    e.preventDefault();
    data.category = data.category.name;
    data.gender = data.gender.name;
    data.brand = data.brand.name;
    const res = await createShoesApi(axiosJWT, userInfo?.accessToken, data);
    setVisibleCreate(false);
    Toastz(res.data, toast);
  };

  const addInputSize = (colorIndex) => {
    setData((prev) => {
      const colors = [...prev.colors];
      const current = colors[colorIndex];
      const newSizes = [...current.sizes, { id: Date.now() + Math.random(), size: '', stock: '' }];
      colors[colorIndex] = { ...current, sizes: newSizes };
      return { ...prev, colors };
    });
  };

  const removeInputSize = (colorIndex, sizeIndex) => {
    setData((prev) => {
      if (!prev?.colors || !prev.colors[colorIndex]?.sizes) return prev;

      const colors = [...prev.colors];
      const current = colors[colorIndex];

      const newSizes = current.sizes.filter((_, i) => i !== sizeIndex);

      colors[colorIndex] = { ...current, sizes: newSizes };

      return { ...prev, colors };
    });
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
          body={(i) => (
            <button onClick={() => navigate(`/shoes/${i?._id}`)} className="cursor-pointer">
              <img src={i?.colors?.[0]?.img?.[0]} alt="shoes" className="w-20 h-20 object-cover rounded-2xl" />
            </button>
          )}
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
        {/* <Column header="Is featured" body={(i) => i.isFeatured} /> */}
        <Column header="Category" body={(i) => i.category} />
        <Column
          header="Is Featured"
          body={(i) => (
            <ToggleButtonz
              checked={i.isFeatured}
              onChange={(e) => {
                // handleToggleFeatured(e.value, i?._id);
                setIdShoesFeatured(e.value);
                setUpdateShoes(i?._id);
              }}
            />
          )}
        />
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
        <form onSubmit={handleCreateShoes} className="mt-8 flex flex-col gap-8">
          <InputText
            value={data?.name || ''}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            label="Shoes name"
          />
          <DropDown
            value={data?.brand}
            onChange={(e) => setData({ ...data, brand: e.value })}
            options={brand}
            optionLabel="name"
            placeholder="Brand"
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

          {/* radio button */}
          <div className="flex flex-row gap-6">
            <Textz className="font-bold">Number of colors:</Textz>
            <RadioButtonV1
              setNumberColor={setNumberColor}
              setData={setData}
              checked={numberColor === '1'}
              value="1"
              label="1"
              inputId="1"
            />
            <RadioButtonV1
              setNumberColor={setNumberColor}
              setData={setData}
              checked={numberColor === '2'}
              value="2"
              label="2"
              inputId="2"
            />
            <RadioButtonV1
              setNumberColor={setNumberColor}
              setData={setData}
              checked={numberColor === '3'}
              value="3"
              label="3"
              inputId="3"
            />
            <RadioButtonV1
              setNumberColor={setNumberColor}
              setData={setData}
              checked={numberColor === '4'}
              value="4"
              label="4"
              inputId="4"
            />
          </div>
          {numberColor &&
            [...Array(Number(numberColor))].map((c, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col gap-6 slide-down">
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
                  <InputLink value={data.colors[index]?.img?.[0] ?? ''} setData={setData} index={index} number="1" />
                  <InputLink value={data.colors[index]?.img?.[1] ?? ''} setData={setData} index={index} number="2" />
                  <InputLink value={data.colors[index]?.img?.[2] ?? ''} setData={setData} index={index} number="3" />
                  <InputLink value={data.colors[index]?.img?.[3] ?? ''} setData={setData} index={index} number="4" />
                  <InputLink value={data.colors[index]?.img?.[4] ?? ''} setData={setData} index={index} number="5" />

                  <i className="h-[1px] w-full bg-gray-300 mt-4" />
                </div>

                <div className="flex flex-row gap-4 items-center">
                  <Textz className="font-bold">Size:</Textz>

                  <Button
                    onClick={() => addInputSize(index)}
                    className="!bg-white !text-gray-500 flex justify-start !border-blue-800 hover:scale-105 !transform !transition-transform !duration-300 !ease-out"
                    type="button"
                    label="Add size"
                  />
                </div>
                {data?.colors?.[index]?.sizes.map((item, i) => (
                  <div key={item.id} className="flex flex-row gap-3 slide-down">
                    <InputGroup data={data} setData={setData} index={index} i={i} />
                    <Button
                      onClick={() => removeInputSize(index, i)}
                      type="button"
                      className="px-3 !bg-white !text-red-700 !border-none !text-xs !w-20 flex justify-center"
                      label="Remove"
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}

          <DropDown
            value={data?.category}
            onChange={(e) => setData({ ...data, category: e.value })}
            options={category}
            optionLabel="name"
            placeholder="Select category"
          />
          <DropDown
            value={data?.gender}
            onChange={(e) => setData({ ...data, gender: e.value })}
            options={gender}
            optionLabel="name"
            placeholder="Select gender"
          />
          <div className="flex flex-row gap-3 items-center">
            <Textz className="font-bold text-md">Is Featured: </Textz>
            <ToggleButtonz
              checked={data?.isFeatured}
              onChange={(e) => {
                // setIsFeatured(e.value)
                setData({ ...data, isFeatured: e.value });
              }}
            />
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
          updateImg[Number(number - 1)] = e.target.value;
          updatedColors[index] = { ...updatedColors[index], img: updateImg };
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

const InputGroup = ({ data, setData, index, i }) => {
  return (
    <div className="card flex flex-column md:flex-row gap-3">
      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="fa-solid fa-shoe-prints" />
        </span>
        <InputNumber
          value={data?.colors[index]?.sizes?.[i]?.size}
          onChange={(e) => {
            setData((prev) => {
              const colors = [...prev.colors];
              const currentColor = colors[index];
              const sizes = [...currentColor.sizes];

              sizes[i] = { ...sizes[i], size: e.value };

              colors[index] = { ...currentColor, sizes: sizes };
              return { ...prev, colors };
            });
          }}
          type="text"
          placeholder="Size"
        />
      </div>

      <div className="p-inputgroup flex-1">
        <span className="p-inputgroup-addon">
          <i className="fa-solid fa-warehouse" />
        </span>
        <InputNumber
          value={data?.colors[index]?.sizes?.[i]?.stock}
          onChange={(e) => {
            setData((prev) => {
              const colors = [...prev.colors];
              const currentColor = colors[index];
              const sizes = [...currentColor.sizes];

              sizes[i] = { ...sizes[i], stock: e.value };

              colors[index] = { ...currentColor, sizes: sizes };
              return { ...prev, colors };
            });
          }}
          type="text"
          placeholder="Stock"
        />
      </div>
    </div>
  );
};

const RadioButtonV1 = (props) => {
  const { setNumberColor, setData, ...prop } = props;
  return (
    <RadioButton
      {...prop}
      onChange={(e) => {
        const count = Number(e.value);
        setNumberColor(e.value);

        setData((prev) => {
          let colors = [...prev.colors];
          while (colors.length < count) {
            colors.push({
              img: [],
              sizes: [],
              colorName: '',
              color: '',
            });
          }
          colors = colors.slice(0, count);
          return { ...prev, colors };
        });
      }}
    />
  );
};
