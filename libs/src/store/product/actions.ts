/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getProducts = (platform: string, includeVariants?: boolean) => (dispatch: any) => {
  dispatch({
    type: types.FETCH_PRODUCTS.baseType,
    payload: platform,
  });

  axiosInstance()
    .get(`/api/products?platform=${platform}${includeVariants ? `&include_variants=${includeVariants}` : ''}`)
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCTS.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_PRODUCTS.FAILED,
        payload: error,
      });
    });
};

export const clearProducts = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCTS,
    payload,
  });
};

export const getProductTypes = () => (dispatch: any) => {
  dispatch({
    type: types.FETCH_PRODUCT_TYPES.baseType,
    payload: {},
  });

  axiosInstance()
    .get('/api/products/types')
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_TYPES.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_PRODUCT_TYPES.FAILED,
        payload: error,
      });
    });
};

export const getProductCategories = (platform: string, payload: any) => (dispatch: any) => {
  dispatch({
    type: types.FETCH_PRODUCT_CATEGORIES.baseType,
    payload: {},
  });

  axiosInstance()
    .get(`/api/products/categories?platform=${platform}&type=${payload}`)
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_CATEGORIES.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_PRODUCT_CATEGORIES.FAILED,
        payload: error,
      });
    });
};

export const getProductBrands = (platform: string, payload: any) => (dispatch: any) => {
  dispatch({
    type: types.FETCH_PRODUCT_BRANDS.baseType,
    payload: platform,
  });

  axiosInstance()
    .get(`/api/products/brands?platform=${platform}&type=${payload}`)
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_BRANDS.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_PRODUCT_BRANDS.FAILED,
        payload: error,
      });
    });
};

export const getProductStatuses = () => (dispatch: any) => {
  dispatch({
    type: types.FETCH_PRODUCT_STATUSES.baseType,
    payload: {},
  });

  axiosInstance()
    .get('/api/products/status')
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_STATUSES.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: types.FETCH_PRODUCT_STATUSES.FAILED,
        payload: error,
      });
    });
};

export const setAddProductPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PRODUCT_PAYLOAD,
    payload,
  });
};

export const setIncludeProductVariant = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_INCLUDE_PRODUCT_VARIANT,
    payload,
  });
};

export const addProduct = (payload: any, activePlatform: any) => (dispatch: any) => {
  dispatch({
    type: types.ADD_PRODUCT.baseType,
    payload: payload,
  });

  axiosInstance()
    .post('/api/products', payload)
    .then((response) => {
      dispatch({
        type: types.ADD_PRODUCT.SUCCESS,
        payload: response?.data,
      });

      getProducts(activePlatform)(dispatch);
      toast.success('Product successfully added!');
    })
    .catch((error) => {
      dispatch({
        type: types.ADD_PRODUCT.FAILED,
        payload: error,
      });

      getProducts(activePlatform)(dispatch);
      toast.success('Failed to add product!');
    });
};
