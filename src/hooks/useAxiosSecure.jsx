import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();
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
    }, async (error) => {
      const statusCode = error.response?.status;
      if (statusCode === 403) {
        toast.error("You don’t have permission to access this page.");
        navigate('/forbidden');
      } else if (statusCode === 401) {
        toast.info("Your session has expired. Please log in again.");
        await signOutUser();
        navigate('/login');
      }
      // console.log('axios interceptor response error:', error);
      return Promise.reject(error);
    });

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    }
  }, [user, navigate, signOutUser])


  return axiosSecure;
};

export default useAxiosSecure;