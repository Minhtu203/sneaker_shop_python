export const deleteShoesById = async (axiosJWT, accessToken, shoesId) => {
  try {
    const res = await axiosJWT.delete(`/api/shoes/deleteShoes/${shoesId}`, {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    if (error.response) return error.response;
  }
};

export const createShoesApi = async (axiosJWT, accessToken, data) => {
  try {
    return await axiosJWT.post('/api/shoes/createShoes', data, {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    if (error.response) return error.response;
  }
};
