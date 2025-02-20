/* eslint-disable @typescript-eslint/no-explicit-any */
import { BAD_REQUEST } from '../../constants';
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getProducts = (platform: string, includeVariants?: boolean, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCTS.baseType,
    () => axiosInstance(token).get(`/api/products?platform=${platform}${includeVariants ? `&include_variants=${includeVariants}` : ''}`, { signal }),
    { showErrorModal: true },
  )
};

export const clearProducts = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCTS,
    payload,
  });
};

export const getProductTypes = (signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT_TYPES.baseType,
    () => axiosInstance(token).get('/api/products/types', { signal }),
    { showErrorModal: true },
  )
};

export const getProductCategories = (platform: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT_CATEGORIES.baseType,
    () => axiosInstance(token).get(`/api/products/categories?platform=${platform}&type=${payload}`),
    { showErrorModal: true },
  )
};

export const getProductBrands = (platform: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT_BRANDS.baseType,
    () => axiosInstance(token).get(`/api/products/brands?platform=${platform}&type=${payload}`),
    { showErrorModal: true },
  )
};

export const getProductStatuses = (signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT_STATUSES.baseType,
    () => axiosInstance(token).get('/api/products/status', { signal }),
    { showErrorModal: true },
  )
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

export const addProduct = (payload: any, activePlatform: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.ADD_PRODUCT.baseType,
    () => axiosInstance(token).post('/api/products', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProducts(activePlatform, true)(dispatch),
    // Error callback
    () => getProducts(activePlatform, true)(dispatch),
  )
};

export const getProduct = (id: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT.baseType,
    () => axiosInstance(token).get(`/api/products/${id}`, { signal }),
    { showErrorModal: true },
  )
};

export const clearProduct = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCT,
    payload,
  });
};

export const updateProduct = (id: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PRODUCT.baseType,
    () => axiosInstance(token).patch(`/api/products/${id}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProduct(id)(dispatch),
    // Error callback
    () => getProduct(id)(dispatch),
  )
};

export const addProductVariant = (id: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.ADD_PRODUCT_VARIANT.baseType,
    () => axiosInstance(token).post(`/api/products/${id}/variants`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProduct(id)(dispatch),
    // Error callback
    () => getProduct(id)(dispatch),
  )
};

export const updateProductVariant = (id: string, productId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PRODUCT_VARIANT.baseType,
    () => axiosInstance(token).patch(`/api/products/variants/${id}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProduct(productId)(dispatch),
    // Error callback
    () => getProduct(productId)(dispatch),
  )
};

export const uploadProductsExcelFile = (file: File, userId: string, activePlatform: string) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  formData.append('platform', activePlatform);

  await makeApiRequest(
    dispatch,
    types.UPLOAD_PRODUCTS_EXCEL.baseType,
    () =>  axiosInstance(token).post('/api/products/import/excel', formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProducts(activePlatform, true)(dispatch),
    // Error callback
    (error) => {
      if (error.code === BAD_REQUEST) {
        dispatch({
          type: types.UPLOAD_PRODUCTS_EXCEL.BAD_REQUEST,
          payload: error?.response?.data?.data || {},
        });
      }

      getProducts(activePlatform, true)(dispatch);
    },
  )
};

export const clearUploadProductsErrors = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_UPLOAD_PRODUCTS_ERRORS,
    payload,
  });
};

export const downloadProductPricingRevisionTemplate = (platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.DOWNLOAD_PRODUCT_PRICING_REVISION_TEMPLATE.baseType,
    () => axiosInstance(token).get('/api/products/pricing/download-template', { params: { platform }, responseType: 'blob' }),
    { showErrorModal: true },
    // Success callback
    (response) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'update-pricing-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  )
};

export const downloadProductUploadTemplate = (platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.DOWNLOAD_PRODUCT_UPLOAD_TEMPLATE.baseType,
    () => axiosInstance(token).get('/api/products/import/download-template', { params: { platform }, responseType: 'blob' }),
    { showErrorModal: true },
    // Success callback
    (response) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'import-products-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  )
};

export const uploadProductsPricingTemplate = (file: File, userId: string, activePlatform: string) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  formData.append('platform', activePlatform);

  await makeApiRequest(
    dispatch,
    types.UPLOAD_PRODUCT_PRICING_REVISION.baseType,
    () => axiosInstance(token).post('/api/products/pricing/bulk', formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getProducts(activePlatform, true)(dispatch),
    // Error callback
    (error) => {
      if (error.code === BAD_REQUEST) {
        dispatch({
          type: types.UPLOAD_PRODUCT_PRICING_REVISION.BAD_REQUEST,
          payload: error?.response?.data?.data?.invalid_entries || [],
        });
      }
    },
  )
};

export const clearUploadProductsPricingTemplateErrors = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_UPLOAD_PRODUCT_PRICING_REVISION_ERRORS,
    payload,
  });
};

export const getProductUploadLogs = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PRODUCT_UPLOAD_LOGS.baseType,
    () => axiosInstance(token).get('/api/products/upload-logs', { signal, params: { platform } }),
    { showErrorModal: true },
  )
};

export const clearProductUploadLogs = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCT_UPLOAD_LOGS,
    payload,
  });
};

export const getCategoriesByType = (platform: string, type: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_CATEGORIES_BY_TYPE.baseType,
    () => axiosInstance(token).get(`/api/products/categories-by-type?type=${type}&platform=${platform}`, { signal }),
    { showErrorModal: true },
  )
};

export const getModelsByCategory = (platform: string, category: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_MODEL_BY_CATEGORY.baseType,
    () => axiosInstance(token).get(`/api/products/get-by-category?category=${category}&platform=${platform}&status=active`, { signal }),
    { showErrorModal: true },
  )
};
