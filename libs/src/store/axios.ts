/* eslint-disable import/order */
import axios, { AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../constants';

const axiosInstance = (token?: string | undefined) => {
  const baseURL = `${BASE_URL}`;

  const headers: AxiosRequestConfig['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const instance = axios.create({
    baseURL,
    headers,
  });

  instance.interceptors.response.use(
    (response) =>
      new Promise((resolve) => {
        resolve(response);
      }),
  );
  return instance;
};

export default axiosInstance;
