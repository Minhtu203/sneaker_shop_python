export const getAdidasShoes = async (axiosJWT, accessToken) => {
  try {
    const res = await axiosJWT.get('/api/shoes/getAdidasShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
