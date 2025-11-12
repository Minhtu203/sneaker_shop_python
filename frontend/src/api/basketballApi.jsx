export const getBasketballShoesApi = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/shoes/getBasketballShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
