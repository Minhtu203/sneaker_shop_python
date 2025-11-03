export const updateUserApi = async (axiosJWT, accessToken, data) => {
  try {
    return await axiosJWT.post('/api/user/updateUserInfo', data, {
      headers: { token: `Bearer ${accessToken}` },
    });
  } catch (error) {
    if (error.response) return error.response;
  }
};
