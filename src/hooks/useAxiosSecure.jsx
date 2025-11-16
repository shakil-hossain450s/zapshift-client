import axios from 'axios';
import useAuth from './useAuth';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const useAxiosSecure = () => {
  const { user } = useAuth();

  // add a request interceptor
  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  })


  return axiosSecure;
};

export default useAxiosSecure;