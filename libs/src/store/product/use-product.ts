/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const useProduct = () => {
  const { state, dispatch } = useContext(RootContext);
  const {
    activePlatform,
    userDetails,
    token,
  } = state.auth;

  const getProducts = (payload: any, signal: AbortSignal) => {
    actions.getProducts(activePlatform, payload, signal)(dispatch, token);
  }

  const clearProducts = (payload: any) => {
    actions.clearProducts(payload)(dispatch);
  }

  const getProductTypes = (signal: AbortSignal) => {
    actions.getProductTypes(signal)(dispatch, token);
  }

  const getProductCategories = (payload: any) => {
    actions.getProductCategories(activePlatform, payload)(dispatch, token);
  }

  const getProductBrands = (payload: any) => {
    actions.getProductBrands(activePlatform, payload)(dispatch, token);
  }

  const getProductStatuses = (signal: AbortSignal) => {
    actions.getProductStatuses(signal)(dispatch, token);
  }

  const setAddProductPayload = (payload: any) => {
    actions.setAddProductPayload(payload)(dispatch);
  }

  const setIncludeProductVariant = (payload: any) => {
    actions.setIncludeProductVariant(payload)(dispatch);
  }

  const addProduct = (payload: any) => {
    actions.addProduct(payload, activePlatform)(dispatch, token);
  }

  const getProduct = (payload: any, signal: AbortSignal) => {
    actions.getProduct(payload, signal)(dispatch, token);
  }

  const clearProduct = (payload: any) => {
    actions.clearProduct(payload)(dispatch);
  }

  const updateProduct = (id: string, payload: any) => {
    actions.updateProduct(id, payload)(dispatch, token);
  }

  const addProductVariant = (id: string, payload: any) => {
    actions.addProductVariant(id, payload)(dispatch, token);
  }

  const updateProductVariant = (id: string, productId: string, payload: any) => {
    actions.updateProductVariant(id, productId, payload)(dispatch, token);
  }

  const uploadProductsExcelFile = (payload: any) => {
    actions.uploadProductsExcelFile(payload, userDetails._id, activePlatform)(dispatch, token);
  }

  const clearUploadProductsErrors = (payload: any) => {
    actions.clearUploadProductsErrors(payload)(dispatch);
  }

  const downloadProductPricingRevisionTemplate = () => {
    actions.downloadProductPricingRevisionTemplate(activePlatform)(dispatch, token);
  }

  const uploadProductsPricingTemplate = (payload: any) => {
    actions.uploadProductsPricingTemplate(payload, userDetails._id, activePlatform)(dispatch, token);
  }

  const clearUploadProductsPricingTemplateErrors = (payload: any) => {
    actions.clearUploadProductsPricingTemplateErrors(payload)(dispatch);
  }

  const getProductUploadLogs = (payload: any, signal: AbortSignal) => {
    actions.getProductUploadLogs(payload, activePlatform, signal)(dispatch, token);
  }

  const clearProductUploadLogs = (payload: any) => {
    actions.clearProductUploadLogs(payload)(dispatch);
  }

  const downloadProductUploadTemplate = () => {
    actions.downloadProductUploadTemplate(activePlatform)(dispatch, token);
  }

  const getCategoriesByType = (payload: any, signal: AbortSignal) => {
    actions.getCategoriesByType(activePlatform, payload, signal)(dispatch, token);
  }


  const getModelsByCategory = (payload: any, signal: AbortSignal) => {
    actions.getModelsByCategory(activePlatform, payload, signal)(dispatch, token);
  }


  return {
    state: state.product,
    getProducts,
    clearProducts,
    getProductTypes,
    getProductCategories,
    getProductBrands,
    getProductStatuses,
    setAddProductPayload,
    setIncludeProductVariant,
    addProduct,
    getProduct,
    clearProduct,
    updateProduct,
    addProductVariant,
    updateProductVariant,
    uploadProductsExcelFile,
    downloadProductPricingRevisionTemplate,
    uploadProductsPricingTemplate,
    clearUploadProductsPricingTemplateErrors,
    getProductUploadLogs,
    clearProductUploadLogs,
    clearUploadProductsErrors,
    downloadProductUploadTemplate,
    getCategoriesByType,
    getModelsByCategory
  };
};
