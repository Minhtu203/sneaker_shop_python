import { postData } from '@/lib/axios';

export const forgotPasswordApi = async (username) => {
  try {
    const res = await postData('/api/auth/forgotPassword', { username: username });
    return res;
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    return {
      data: { success: false, message: error.message || 'Something went wrong' },
    };
  }
};
