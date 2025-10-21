export const getShoesById = async (axiosJWT, shoesId, accessToken) => {
  try {
    return await axiosJWT.post(
      '/api/shoes/getShoesById',
      { id: shoesId },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
  } catch (error) {
    console.error(error);
  }
};
