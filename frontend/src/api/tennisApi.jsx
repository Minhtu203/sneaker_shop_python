export const getTennisShoes = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/shoes/getTennisShoes', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
