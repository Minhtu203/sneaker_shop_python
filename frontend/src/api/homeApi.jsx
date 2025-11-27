export const getAllShoes = async (axiosJWT, accessToken) => {
  try {
    const res = await axiosJWT.get('/api/shoes/getAllShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getIsFeaturedShoes = async (axiosJWT, accessToken, filter) => {
  try {
    const res = await axiosJWT.get('/api/shoes/getIsFeaturedShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
      params: filter,
    });
    return res;
  } catch (error) {
    if (error.response) return error.response;
  }
};
