/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { BAD_REQUEST, CANCELLED_AXIOS } from '../../constants';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getProducts =
  (platform: string, includeVariants?: boolean, signal?: AbortSignal) =>
    (dispatch: any, token?: string) => {
      dispatch({
        type: types.FETCH_PRODUCTS.baseType,
        payload: platform,
      });

      axiosInstance(token)
        .get(
          `/api/products?platform=${platform}${includeVariants ? `&include_variants=${includeVariants}` : ''}`,
          { signal: signal },
        )
        .then((response) => {
          dispatch({
            type: types.FETCH_PRODUCTS.SUCCESS,
            payload: response?.data,
          });
        })
        .catch((error) => {
          if (error.code === CANCELLED_AXIOS) {
            dispatch({
              type: types.FETCH_PRODUCTS.CANCELLED,
              payload: error,
            });
          } else {
            dispatch({
              type: types.FETCH_PRODUCTS.FAILED,
              payload: error,
            });
          }
        });
    };

export const clearProducts = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCTS,
    payload,
  });
};

export const getProductTypes = (signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PRODUCT_TYPES.baseType,
    payload: {},
  });

  axiosInstance(token)
    .get('/api/products/types', { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_TYPES.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PRODUCT_TYPES.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PRODUCT_TYPES.FAILED,
          payload: error,
        });
      }
    });
};

export const getProductCategories =
  (platform: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_PRODUCT_CATEGORIES.baseType,
      payload: {},
    });

    axiosInstance(token)
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

export const getProductBrands =
  (platform: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_PRODUCT_BRANDS.baseType,
      payload: platform,
    });

    axiosInstance(token)
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

export const getProductStatuses = (signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PRODUCT_STATUSES.baseType,
    payload: {},
  });

  axiosInstance(token)
    .get('/api/products/status', { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PRODUCT_STATUSES.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PRODUCT_STATUSES.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PRODUCT_STATUSES.FAILED,
          payload: error,
        });
      }
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

export const addProduct =
  (payload: any, activePlatform: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.ADD_PRODUCT.baseType,
      payload: payload,
    });

    axiosInstance(token)
      .post('/api/products', payload)
      .then((response) => {
        dispatch({
          type: types.ADD_PRODUCT.SUCCESS,
          payload: response?.data,
        });

        getProducts(activePlatform, true)(dispatch);
        toast.success('Product successfully added!');
      })
      .catch((error) => {
        dispatch({
          type: types.ADD_PRODUCT.FAILED,
          payload: error,
        });

        getProducts(activePlatform, true)(dispatch);
        toast.error('Failed to add product!');
      });
  };

export const getProduct =
  (id: string, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_PRODUCT.baseType,
      payload: id,
    });

    axiosInstance(token)
      .get(`/api/products/${id}`, { signal: signal })
      .then((response) => {
        dispatch({
          type: types.FETCH_PRODUCT.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_PRODUCT.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_PRODUCT.FAILED,
            payload: error,
          });
        }
      });
  };

export const clearProduct = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCT,
    payload,
  });
};

export const updateProduct = (id: string, payload: any) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PRODUCT.baseType,
    payload: payload,
  });

  axiosInstance(token)
    .patch(`/api/products/${id}`, payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_PRODUCT.SUCCESS,
        payload: response?.data,
      });

      getProduct(id)(dispatch);
      toast.success('Product successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PRODUCT.FAILED,
        payload: error,
      });

      getProduct(id)(dispatch);
      toast.error('Failed to update product!');
    });
};

export const addProductVariant =
  (id: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.ADD_PRODUCT_VARIANT.baseType,
      payload: payload,
    });

    axiosInstance(token)
      .post(`/api/products/${id}/variants`, payload)
      .then((response) => {
        dispatch({
          type: types.ADD_PRODUCT_VARIANT.SUCCESS,
          payload: response?.data,
        });

        getProduct(id)(dispatch);
        toast.success('Product variant successfully added!');
      })
      .catch((error) => {
        dispatch({
          type: types.ADD_PRODUCT_VARIANT.FAILED,
          payload: error,
        });

        getProduct(id)(dispatch);
        toast.error('Failed to add product variant!');
      });
  };

export const updateProductVariant =
  (id: string, productId: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_PRODUCT_VARIANT.baseType,
      payload: payload,
    });

    axiosInstance(token)
      .patch(`/api/products/variants/${id}`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_PRODUCT_VARIANT.SUCCESS,
          payload: response?.data,
        });

        getProduct(productId)(dispatch);
        toast.success('Product variant successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_PRODUCT_VARIANT.FAILED,
          payload: error,
        });

        getProduct(productId)(dispatch);
        toast.error('Failed to update product variant!');
      });
  };

export const uploadProductsExcelFile =
  (file: File, userId: string, activePlatform: string) => async (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPLOAD_PRODUCTS_EXCEL.baseType,
      payload: {},
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    formData.append('platform', activePlatform);

    axiosInstance(token)
      .post('/api/products/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        dispatch({
          type: types.UPLOAD_PRODUCTS_EXCEL.SUCCESS,
          payload: {},
        });

        getProducts(activePlatform, true)(dispatch);
        toast.success('Products successfully imported!');
      })
      .catch((error) => {
        if (error.code === BAD_REQUEST) {
          dispatch({
            type: types.UPLOAD_PRODUCTS_EXCEL.BAD_REQUEST,
            payload: error?.response?.data?.data || {},
          });
        } else {
          dispatch({
            type: types.UPLOAD_PRODUCTS_EXCEL.FAILED,
            payload: error,
          });
        }

        getProducts(activePlatform, true)(dispatch);
        toast.error('Failed to update products pricing.');
      });
  };

export const clearUploadProductsErrors =
  (payload: any) => (dispatch: any) => {
    dispatch({
      type: types.CLEAR_UPLOAD_PRODUCTS_ERRORS,
      payload,
    });
  };

export const downloadProductPricingRevisionTemplate =
  (platform: string) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.DOWNLOAD_PRODUCT_PRICING_REVISION_TEMPLATE.baseType,
      payload: platform,
    });

    axiosInstance(token)
      .get('/api/products/pricing/download-template', {
        params: { platform: platform },
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'update-pricing-template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
          type: types.DOWNLOAD_PRODUCT_PRICING_REVISION_TEMPLATE.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.DOWNLOAD_PRODUCT_PRICING_REVISION_TEMPLATE.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.DOWNLOAD_PRODUCT_PRICING_REVISION_TEMPLATE.FAILED,
            payload: error,
          });
          toast.error('Failed to export product pricing upload template.');
        }
      });
  };

export const downloadProductUploadTemplate =
  (platform: string) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.DOWNLOAD_PRODUCT_UPLOAD_TEMPLATE.baseType,
      payload: platform,
    });

    axiosInstance(token)
      .get('/api/products/import/download-template', {
        params: { platform: platform },
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'import-products-template.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
          type: types.DOWNLOAD_PRODUCT_UPLOAD_TEMPLATE.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.DOWNLOAD_PRODUCT_UPLOAD_TEMPLATE.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.DOWNLOAD_PRODUCT_UPLOAD_TEMPLATE.FAILED,
            payload: error,
          });
          toast.error('Failed to export product upload template.');
        }
      });
  };

export const uploadProductsPricingTemplate =
  (file: File, userId: string, activePlatform: string) =>
    async (dispatch: any, token?: string) => {
      dispatch({
        type: types.UPLOAD_PRODUCT_PRICING_REVISION.baseType,
        payload: {},
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);
      formData.append('platform', activePlatform);

      axiosInstance(token)
        .post('/api/products/pricing/bulk', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          dispatch({
            type: types.UPLOAD_PRODUCT_PRICING_REVISION.SUCCESS,
            payload: {},
          });

          getProducts(activePlatform, true)(dispatch);
          toast.success('Products pricing successfully updated!');
        })
        .catch((error) => {
          if (error.code === BAD_REQUEST) {
            dispatch({
              type: types.UPLOAD_PRODUCT_PRICING_REVISION.BAD_REQUEST,
              payload: error?.response?.data?.data?.invalid_entries || [],
            });
          } else {
            dispatch({
              type: types.UPLOAD_PRODUCT_PRICING_REVISION.FAILED,
              payload: error,
            });
          }

          getProducts(activePlatform, true)(dispatch);
          toast.error('Failed to update products pricing.');
        });
    };

export const clearUploadProductsPricingTemplateErrors =
  (payload: any) => (dispatch: any) => {
    dispatch({
      type: types.CLEAR_UPLOAD_PRODUCT_PRICING_REVISION_ERRORS,
      payload,
    });
  };

export const getProductUploadLogs =
  (payload: any, platform: string, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_PRODUCT_UPLOAD_LOGS.baseType,
      payload,
    });

    axiosInstance(token)
      .get('/api/products/upload-logs', { signal: signal, params: { platform } })
      .then((response) => {
        dispatch({
          type: types.FETCH_PRODUCT_UPLOAD_LOGS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_PRODUCT_UPLOAD_LOGS.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_PRODUCT_UPLOAD_LOGS.FAILED,
            payload: error,
          });
        }
      });
  };

export const clearProductUploadLogs = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PRODUCT_UPLOAD_LOGS,
    payload,
  });
};

export const getCategoriesByType =
  (platform: string, type: string, signal?: AbortSignal) =>
    (dispatch: any, token?: string) => {
      dispatch({
        type: types.FETCH_CATEGORIES_BY_TYPE.baseType,
      });

      axiosInstance(token)
        .get(
          `/api/products/categories-by-type?type=${type}&platform=${platform}`,
          { signal: signal },
        )
        .then((response) => {
          dispatch({
            type: types.FETCH_CATEGORIES_BY_TYPE.SUCCESS,
            payload: response?.data,
          });
        })
        .catch((error) => {
          if (error.code === CANCELLED_AXIOS) {
            dispatch({
              type: types.FETCH_CATEGORIES_BY_TYPE.CANCELLED,
              payload: error,
            });
          } else {
            dispatch({
              type: types.FETCH_PRODUCTS.FAILED,
              payload: error,
            });
          }
        });
    };

export const getModelsByCategory =
  (platform: string, category: string, signal?: AbortSignal) =>
    (dispatch: any, token?: string) => {
      dispatch({
        type: types.FETCH_MODEL_BY_CATEGORY.baseType,
      });

      axiosInstance(token)
        .get(
          `api/products/get-by-category?category=${category}&platform=${platform}&status=active`,
          { signal: signal },
        )
        .then((response) => {
          dispatch({
            type: types.FETCH_MODEL_BY_CATEGORY.SUCCESS,
            payload: response?.data,
          });
        })
        .catch((error) => {
          if (error.code === CANCELLED_AXIOS) {
            dispatch({
              type: types.FETCH_MODEL_BY_CATEGORY.CANCELLED,
              payload: error,
            });
          } else {
            dispatch({
              type: types.FETCH_PRODUCTS.FAILED,
              payload: error,
            });
          }
        });
    };
