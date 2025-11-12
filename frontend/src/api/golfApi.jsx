export const getGolfShoes = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/shoes/getGolfShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
