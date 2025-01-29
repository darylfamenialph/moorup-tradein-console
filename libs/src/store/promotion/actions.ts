/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { CANCELLED_AXIOS } from '../../constants';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getPromotions = (payload: any, platform: string, signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PROMOTIONS.baseType,
    payload,
  });

  axiosInstance(token)
    .get(`/api/promotions?platform=${platform}`, { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PROMOTIONS.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PROMOTIONS.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PROMOTIONS.FAILED,
          payload: error,
        });
      }
    });
};

export const clearPromotions = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTIONS,
    payload,
  });
};

export const createPromotion = (payload: any, activePlatform: string, cardImageFile?: File, bannerImageFile?: File) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.CREATE_PROMOTION.baseType,
    payload,
  });

  const formData = new FormData();
  formData.append('body', JSON.stringify(payload));
  if (cardImageFile) formData.append('image_file', cardImageFile);
  if (bannerImageFile) formData.append('banner_image_file', bannerImageFile);

  axiosInstance(token)
    .post('/api/promotions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      dispatch({
        type: types.CREATE_PROMOTION.SUCCESS,
        payload: response?.data,
      });

      getPromotions({}, activePlatform)(dispatch);
      toast.success('Promotion successfully added!');
    })
    .catch((error) => {
      dispatch({
        type: types.CREATE_PROMOTION.FAILED,
        payload: error,
      });

      getPromotions({}, activePlatform)(dispatch);
      toast.error('Failed to add promotion.');
    });
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

export const getPromotionClaims = (payload: any, platform: string, signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PROMOTION_CLAIMS.baseType,
    payload,
  });

  axiosInstance(token)
    .get(`/api/claims?platform=${platform}`, { params: payload, signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PROMOTION_CLAIMS.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PROMOTION_CLAIMS.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PROMOTION_CLAIMS.FAILED,
          payload: error,
        });
      }
    });
};

export const clearPromotionClaims = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTION_CLAIMS,
    payload,
  });
};

export const getPromotionById = (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PROMOTION_BY_ID.baseType,
    payload,
  });

  axiosInstance(token)
    .get(`/api/promotions/${payload}`,  { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PROMOTION_BY_ID.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PROMOTION_BY_ID.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PROMOTION_BY_ID.FAILED,
          payload: error,
        });
      }
    });
};

export const clearPromotion = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PROMOTION,
    payload,
  });
};

export const updatePromotion = (payload: any, promotionId: string, activePlatform: string, cardImageFile?: File, bannerImageFile?: File ) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PROMOTION.baseType,
    payload,
  });

  const formData = new FormData();
  formData.append('body', JSON.stringify(payload));
  if (cardImageFile) formData.append('image_file', cardImageFile);
  if (bannerImageFile) formData.append('banner_image_file', bannerImageFile);

  axiosInstance(token)
    .patch(`/api/promotions/${promotionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      dispatch({
        type: types.UPDATE_PROMOTION.SUCCESS,
        payload: response?.data,
      });

      getPromotions({}, activePlatform)(dispatch);
      toast.success('Promotion successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PROMOTION.FAILED,
        payload: error,
      });

      getPromotions({}, activePlatform)(dispatch);
      toast.error('Failed to update promotion.');
    });
};

export const setConfirmationModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_CONFIRMATION_MODAL_STATE,
    payload,
  });
};

export const updatePromotionClaimMoorupStatus = (payload: any, promotionClaimId: string, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.baseType,
    payload,
  });

  axiosInstance(token)
    .patch(`/api/claims/${promotionClaimId}/moorup-status`, payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims({}, activePlatform)(dispatch);
      toast.success('Moorup status successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.FAILED,
        payload: error,
      });

      getPromotionClaims({}, activePlatform)(dispatch);
      toast.error('Failed to update moorup status.');
    });
};

export const updatePromotionClaimStatus = (payload: any, promotionClaimId: string, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PROMOTION_CLAIM_STATUS.baseType,
    payload,
  });

  axiosInstance(token)
    .patch(`/api/claims/${promotionClaimId}/status`, payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_STATUS.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Claim status successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_STATUS.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to update claim status.');
    });
};

export const bulkUpdatePromotionClaimStatus = (payload: any, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PROMOTION_CLAIM_STATUS.baseType,
    payload,
  });

  axiosInstance(token)
    .patch('/api/claims/status/bulk', payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_STATUS.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Claim status successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_STATUS.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to update claim status.');
    });
};

export const bulkUpdatePromotionClaimMoorupStatus = (payload: any, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.baseType,
    payload,
  });

  axiosInstance(token)
    .patch('/api/claims/moorup-status/bulk', payload)
    .then((response) => {
      dispatch({
        type: types.BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Moorup status successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to update moorup status.');
    });
};

export const submitOrderPromotionClaim = (payload: any, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.SUBMIT_ORDER_PROMOTION_CLAIM.baseType,
    payload,
  });

  axiosInstance(token)
    .post('/api/claims/submit-receipt', payload)
    .then((response) => {
      dispatch({
        type: types.SUBMIT_ORDER_PROMOTION_CLAIM.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Claim receipt successfully submitted!');
    })
    .catch((error) => {
      dispatch({
        type: types.SUBMIT_ORDER_PROMOTION_CLAIM.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to update claim status.');
    });
};

export const processPromotionClaimPayment = (payload: any, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.PROCESS_PROMOTION_CLAIM_PAYMENT.baseType,
    payload,
  });

  axiosInstance(token)
    .post('/api/claims/payment', payload)
    .then((response) => {
      dispatch({
        type: types.PROCESS_PROMOTION_CLAIM_PAYMENT.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Payment successfully processed!');
    })
    .catch((error) => {
      dispatch({
        type: types.PROCESS_PROMOTION_CLAIM_PAYMENT.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to process claim payment.');
    });
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

export const bulkProcessPromotionClaimPayment = (payload: any, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.baseType,
    payload,
  });

  axiosInstance(token)
    .post('/api/claims/payment/bulk', payload)
    .then(() => {
      const selectedIds = payload.map((item: any) => item.claimId);
      const savedIds = sessionStorage.getItem('FPC');
      const parsedIds = savedIds ? JSON.parse(savedIds) : [];

      sessionStorage.setItem('FPC', JSON.stringify([...parsedIds, selectedIds]));

      dispatch({
        type: types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.SUCCESS,
        payload: selectedIds,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Payment successfully processed!');
    })
    .catch((error) => {
      dispatch({
        type: types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to process claim payment.');
    });
};

export const setResetForm = (payload: string) => (dispatch: any) => {
  dispatch({
    type: types.RESET_FORM,
    payload,
  });
};

export const updatePromotionClaimReceiptNumber = (payload: any, promotionClaimId: string, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER.baseType,
    payload,
  });

  axiosInstance(token)
    .patch(`/api/claims/${promotionClaimId}/receipt`, payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Receipt number successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to update receipt number.');
    });
};

export const attachReceiptImage = (promotionClaimId: string, filter: any, activePlatform: string, imageFile?: File) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.ATTACH_RECEIPT_IMAGE.baseType,
    promotionClaimId,
  });

  const formData = new FormData();
  if (imageFile) formData.append('receipt_file', imageFile);

  axiosInstance(token)
    .patch(`/api/claims/${promotionClaimId}/attach-receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      dispatch({
        type: types.ATTACH_RECEIPT_IMAGE.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Successfully attached receipt image!');
    })
    .catch((error) => {
      dispatch({
        type: types.ATTACH_RECEIPT_IMAGE.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to attach receipt image.');
    });
};

export const removeReceiptImage = (promotionClaimId: string, filter: any, activePlatform: string) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.REMOVE_RECEIPT_IMAGE.baseType,
    promotionClaimId,
  });

  axiosInstance(token)
    .patch(`/api/claims/${promotionClaimId}/remove-receipt`)
    .then((response) => {
      dispatch({
        type: types.REMOVE_RECEIPT_IMAGE.SUCCESS,
        payload: response?.data,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.success('Successfully removed attachment!');
    })
    .catch((error) => {
      dispatch({
        type: types.REMOVE_RECEIPT_IMAGE.FAILED,
        payload: error,
      });

      getPromotionClaims(filter, activePlatform)(dispatch);
      toast.error('Failed to remove attachment.');
    });
};
