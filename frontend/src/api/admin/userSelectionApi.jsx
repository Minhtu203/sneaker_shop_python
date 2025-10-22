export const getAllUsers = async (axiosJWT, accessToken) => {
  try {
    return await axiosJWT.get('/api/user/allusers', {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteUserApi = async (axiosJWT, accessToken, userId) => {
  try {
    return await axiosJWT.delete(`/api/user/${userId}`, {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
  } catch (error) {
    console.error(error);
  }
};
