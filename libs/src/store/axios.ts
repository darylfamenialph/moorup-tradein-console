/* eslint-disable import/order */
import axios, { AxiosRequestConfig } from 'axios';
import { API_KEY, BASE_URL, BASE_URL_OLD } from '../constants';

const axiosInstance = (
  token?: string | undefined,
  useOldAPIDomain?: boolean,
) => {
  const baseURL = useOldAPIDomain ? BASE_URL_OLD : BASE_URL;

  const headers: AxiosRequestConfig['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    'x-api-key': API_KEY,
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
