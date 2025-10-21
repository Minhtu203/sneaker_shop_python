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
