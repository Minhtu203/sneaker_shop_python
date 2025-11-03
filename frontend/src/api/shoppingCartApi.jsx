import { CreateAxios } from '@/lib/axios';

export const getItemsInCart = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/cart/getAllItems', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    if (error.response) return error.response;
  }
};

export const deleteItemFromCart = async (axiosJWT, accessToken, data) => {
  try {
    return await axiosJWT.post('/api/cart/deleteItem', data, {
      headers: { token: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (error.response) return error.response;
  }
};

export const addItemToCart = async (axiosJWT, accessToken, data) => {
  try {
    return await axiosJWT.post('/api/cart/add', data, {
      headers: { token: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (error.response) return error.response;
  }
};
