export const getAirmaxShoes = async (axiosJWT, accessToken) => {
  try {
    const res = await axiosJWT.get('/api/shoes/getAirmaxShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
