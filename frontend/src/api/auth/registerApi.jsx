import { postData } from '@/lib/axios';

export const registerApi = async (data) => {
  try {
    await postData('/api/auth/register', data);
  } catch (error) {
    console.error(error);
  }
};
