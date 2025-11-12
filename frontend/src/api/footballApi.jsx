export const getFootballShoes = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/shoes/getFootballShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
