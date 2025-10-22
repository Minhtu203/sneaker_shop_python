export const logoutApi = async (userId, clearUserInfo, accessToken, axiosJWT) => {
  try {
    await axiosJWT.post(
      '/api/auth/logout',
      { userId },
      {
        headers: { token: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    );
    clearUserInfo();
  } catch (error) {
    console.log(error.message);
  }
};
