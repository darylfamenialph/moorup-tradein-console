/* eslint-disable @typescript-eslint/no-explicit-any */

import { ADD_PRODUCT_PAYLOAD } from '../../constants';
import * as types from './action-types';

const productState = {
  products: [],
  isFetchingProducts: true,
  productBrands: [],
  isFetchingProductBrands: true,
  productTypes: [],
  isFetchingProductTypes: true,
  productCategories: [],
  isFetchingProductCategories: true,
  productStatuses: [],
  isFetchingProductStatuses: true,
  addProductPayload: ADD_PRODUCT_PAYLOAD,
  includeProductVariant: false,
  isAddingProduct: false,
};

const productReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.FETCH_PRODUCTS.baseType: {
      return {
        ...state,
        isFetchingProducts: true,
        products: [],
      };
    }
    case types.FETCH_PRODUCTS.SUCCESS: {
      return {
        ...state,
        isFetchingProducts: false,
        products: action.payload?.data,
      };
    }
    case types.FETCH_PRODUCTS.FAILED: {
      return {
        ...state,
        isFetchingProducts: false,
        products: [],
      };
    }

    case types.CLEAR_PRODUCTS:
      return {
        ...state,
        products: [],
      };

    case types.FETCH_PRODUCT_TYPES.baseType: {
      return {
        ...state,
        isFetchingProductTypes: true,
        productTypes: [],
      };
    }
    case types.FETCH_PRODUCT_TYPES.SUCCESS: {
      return {
        ...state,
        isFetchingProductTypes: false,
        productTypes: action.payload?.data,
      };
    }
    case types.FETCH_PRODUCT_TYPES.FAILED: {
      return {
        ...state,
        isFetchingProductTypes: false,
        productTypes: [],
      };
    }

    case types.FETCH_PRODUCT_CATEGORIES.baseType: {
      return {
        ...state,
        isFetchingProductCategories: true,
        productCategories: [],
      };
    }
    case types.FETCH_PRODUCT_CATEGORIES.SUCCESS: {
      return {
        ...state,
        isFetchingProductCategories: false,
        productCategories: action.payload?.data,
      };
    }
    case types.FETCH_PRODUCT_CATEGORIES.FAILED: {
      return {
        ...state,
        isFetchingProductCategories: false,
        productCategories: [],
      };
    }

    case types.FETCH_PRODUCT_BRANDS.baseType: {
      return {
        ...state,
        isFetchingProductBrands: true,
        productBrands: [],
      };
    }
    case types.FETCH_PRODUCT_BRANDS.SUCCESS: {
      return {
        ...state,
        isFetchingProductBrands: false,
        productBrands: action.payload?.data,
      };
    }
    case types.FETCH_PRODUCT_BRANDS.FAILED: {
      return {
        ...state,
        isFetchingProductBrands: false,
        productBrands: [],
      };
    }

    case types.FETCH_PRODUCT_STATUSES.baseType: {
      return {
        ...state,
        isFetchingProductStatuses: true,
        productStatuses: [],
      };
    }
    case types.FETCH_PRODUCT_STATUSES.SUCCESS: {
      return {
        ...state,
        isFetchingProductStatuses: false,
        productStatuses: action.payload?.data,
      };
    }
    case types.FETCH_PRODUCT_STATUSES.FAILED: {
      return {
        ...state,
        isFetchingProductStatuses: false,
        productStatuses: [],
      };
    }

    case types.SET_ADD_PRODUCT_PAYLOAD:
      return {
        ...state,
        addProductPayload: action.payload,
      };

    case types.SET_INCLUDE_PRODUCT_VARIANT:
      return {
        ...state,
        includeProductVariant: action.payload,
      };

    case types.ADD_PRODUCT.baseType: {
      return {
        ...state,
        isAddingProduct: true,
      };
    }
    case types.ADD_PRODUCT.SUCCESS: {
      return {
        ...state,
        isAddingProduct: false,
        products: [],
        isFetchingProducts: true,
      };
    }
    case types.ADD_PRODUCT.FAILED: {
      return {
        ...state,
        isAddingProduct: false,
        products: [],
        isFetchingProducts: true,
      };
    }

    default:
      return state;
  }
};

export { productReducer, productState };
