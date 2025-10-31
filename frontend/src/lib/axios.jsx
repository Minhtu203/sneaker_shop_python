import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const postData = (url, params) => {
  return axiosInstance.post(url, params);
};

const refreshToken = async () => {
  try {
    const res = await postData(
      '/api/auth/refreshToken'
      // , { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error('Refresh failed:', err.response?.data || err.message);
  }
};

export const CreateAxios = (userInfo, setUserInfo) => {
  const newInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(userInfo?.accessToken);

      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...userInfo,
          accessToken: data.accessToken,
        };
        setUserInfo(refreshUser);
        config.headers['token'] = 'Bearer ' + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};
