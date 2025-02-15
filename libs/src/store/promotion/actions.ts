/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getPromotions = (_payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PROMOTIONS.baseType,
    () => axiosInstance(token).get(`/api/promotions?platform=${platform}`, { signal }),
    { showErrorModal: true },
  )
};

export const clearPromotions = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTIONS,
    payload,
  });
};

export const createPromotion = (payload: any, activePlatform: string, cardImageFile?: File, bannerImageFile?: File) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  formData.append('body', JSON.stringify(payload));
  if (cardImageFile) formData.append('image_file', cardImageFile);
  if (bannerImageFile) formData.append('banner_image_file', bannerImageFile);

  await makeApiRequest(
    dispatch,
    types.CREATE_PROMOTION.baseType,
    () => axiosInstance(token).post('/api/promotions', formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotions({}, activePlatform)(dispatch),
    // Error callback
    () => getPromotions({}, activePlatform)(dispatch),
  )
};

export const setAddPromotionDetailsPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PROMOTION_DETAILS_PAYLOAD,
    payload,
  });
};

export const setAddPromotionClaimsPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PROMOTION_CLAIMS_PAYLOAD,
    payload,
  });
};

export const setAddPromotionStepsPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PROMOTION_STEPS_PAYLOAD,
    payload,
  });
};

export const setAddOrderPromotionClaimPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ORDER_PROMOTION_CLAIM_PAYLOAD,
    payload,
  });
};

export const setAddPromotionConditionPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PROMOTION_CONDITION_PAYLOAD,
    payload,
  });
};

export const setAddPromotionEligibilityAndFaqsPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS,
    payload,
  });
};

export const getPromotionClaims = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PROMOTION_CLAIMS.baseType,
    () => axiosInstance(token).get(`/api/claims?platform=${platform}`, { params: payload, signal }),
    { showErrorModal: true },
  )
};

export const clearPromotionClaims = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTION_CLAIMS,
    payload,
  });
};

export const getPromotionById = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_PROMOTION_BY_ID.baseType,
    () => axiosInstance(token).get(`/api/promotions/${payload}`,  { signal }),
    { showErrorModal: true },
  )
};

export const clearPromotion = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTION,
    payload,
  });
};

export const updatePromotion = (payload: any, promotionId: string, activePlatform: string, cardImageFile?: File, bannerImageFile?: File ) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  formData.append('body', JSON.stringify(payload));
  if (cardImageFile) formData.append('image_file', cardImageFile);
  if (bannerImageFile) formData.append('banner_image_file', bannerImageFile);

  await makeApiRequest(
    dispatch,
    types.UPDATE_PROMOTION.baseType,
    () => axiosInstance(token).patch(`/api/promotions/${promotionId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotions({}, activePlatform)(dispatch),
    // Error callback
    () => getPromotions({}, activePlatform)(dispatch),
  )
};

export const updatePromotionClaimMoorupStatus = (payload: any, promotionClaimId: string, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/claims/${promotionClaimId}/moorup-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims({}, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims({}, activePlatform)(dispatch),
  )
};

export const updatePromotionClaimStatus = (payload: any, promotionClaimId: string, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PROMOTION_CLAIM_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/claims/${promotionClaimId}/status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims({}, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims({}, activePlatform)(dispatch),
  )
};

export const bulkUpdatePromotionClaimStatus = (payload: any, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PROMOTION_CLAIM_STATUS.baseType,
    () => axiosInstance(token).patch('/api/claims/status/bulk', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const bulkUpdatePromotionClaimMoorupStatus = (payload: any, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.baseType,
    () => axiosInstance(token).patch('/api/claims/moorup-status/bulk', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const submitOrderPromotionClaim = (payload: any, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.SUBMIT_ORDER_PROMOTION_CLAIM.baseType,
    () => axiosInstance(token).post('/api/claims/submit-receipt', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const processPromotionClaimPayment = (payload: any, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.PROCESS_PROMOTION_CLAIM_PAYMENT.baseType,
    () => axiosInstance(token).post('/api/claims/payment', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const setPromotionCardImage = (payload?: File) => (dispatch: any) => {
  dispatch({
    type: types.SET_PROMOTION_CARD_IMAGE,
    payload,
  });
};

export const setPromotionBannerImage = (payload?: File) => (dispatch: any) => {
  dispatch({
    type: types.SET_PROMOTION_BANNER_IMAGE,
    payload,
  });
};

export const bulkProcessPromotionClaimPayment = (payload: any, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.baseType,
    () => axiosInstance(token).post('/api/claims/payment/bulk', payload),
    { showErrorModal: true, showSuccessModal: true, payload },
    // Success callback
    () => {
      const selectedIds: string[] = payload.map((item: any) => item.claimId);
      const savedIds: string | null = sessionStorage.getItem('FPC');
      const parsedIds: string[] = savedIds ? JSON.parse(savedIds) : [];

      sessionStorage.setItem('FPC', JSON.stringify([...parsedIds, ...selectedIds]));

      getPromotionClaims(filter, activePlatform)(dispatch)
    },
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const setResetForm = (payload: string) => (dispatch: any) => {
  dispatch({
    type: types.RESET_FORM,
    payload,
  });
};

export const updatePromotionClaimReceiptNumber = (payload: any, promotionClaimId: string, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER.baseType,
    () => axiosInstance(token).patch(`/api/claims/${promotionClaimId}/receipt`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const attachReceiptImage = (promotionClaimId: string, filter: any, activePlatform: string, imageFile?: File) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  if (imageFile) formData.append('receipt_file', imageFile);

  await makeApiRequest(
    dispatch,
    types.ATTACH_RECEIPT_IMAGE.baseType,
    () => axiosInstance(token).patch(`/api/claims/${promotionClaimId}/attach-receipt`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};

export const removeReceiptImage = (promotionClaimId: string, filter: any, activePlatform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REMOVE_RECEIPT_IMAGE.baseType,
    () => axiosInstance(token).patch(`/api/claims/${promotionClaimId}/remove-receipt`),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
    // Error callback
    () => getPromotionClaims(filter, activePlatform)(dispatch),
  )
};
