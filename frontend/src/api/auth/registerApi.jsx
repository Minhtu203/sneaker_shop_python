import { postData } from '@/lib/axios';

export const registerApi = async (data) => {
  try {
    return await postData('/api/auth/register', data);
  } catch (error) {
    if (error.response) return error.response;
  }
};
