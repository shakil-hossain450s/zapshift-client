import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const useAxiosSecure = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // add a request interceptor
    const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });

    // Add a response interceptor
    const responseInterceptor = axiosSecure.interceptors.response.use(response => {
      return response;
    }, error => {
      const statusCode = error.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        navigate('/forbidden');
        return Promise.reject(error);
      }
    });

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    }
  }, [user, navigate])


  return axiosSecure;
};

export default useAxiosSecure;