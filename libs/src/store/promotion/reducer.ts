/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ADD_ORDER_PROMOTION_CLAIM_PAYLOAD,
  ADD_PROMOTION_CLAIMS_PAYLOAD,
  ADD_PROMOTION_CONDITIONS_PAYLOAD,
  ADD_PROMOTION_DETAILS_PAYLOAD,
  ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  ADD_PROMOTION_STEPS_PAYLOAD
} from '../../constants';
import * as types from './action-types';

const promotionState = {
  promotions: [],
  isFetchingPromotions: true,
  isAddingPromotion: false,
  addPromotionDetailsPayload: ADD_PROMOTION_DETAILS_PAYLOAD,
  addPromotionClaimsPayload: ADD_PROMOTION_CLAIMS_PAYLOAD,
  addPromotionStepsPayload: ADD_PROMOTION_STEPS_PAYLOAD,
  addPromotionConditionPayload: ADD_PROMOTION_CONDITIONS_PAYLOAD,
  addPromotionEligibilityAndFaqsPayload: ADD_PROMOTION_ELIGIBILITY_AND_FAQS_PAYLOAD,
  addOrderPromotionClaimPayload: ADD_ORDER_PROMOTION_CLAIM_PAYLOAD,
  promotionClaims: [],
  isFetchingPromotionClaims: true,
  promotion: {},
  isFetchingPromotionById: true,
  isUpdatingPromotion: false,
  confirmationModalState: {
    open: false,
    view: null,
    title: 'Confirmation',
    content: 'Are you sure you want to perform this action?',
    data: {},
    id: '',
  },
  isUpdatingPromotionClaimMoorupStatus: false,
  isUpdatingPromotionClaimStatus: false,
  isProcessingPromotionClaimPayment: false,
  promotionCardImage: null,
  promotionBannerImage: null,
  isBulkProcessingPromotionClaimPayment: false,
  forProcessingClaimsPayment: (() => {
    const saved = sessionStorage.getItem('FPC');
    return saved ? JSON.parse(saved) : [];
  })(),
  resetForm: ''
};

const promotionReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.FETCH_PROMOTIONS.baseType: {
      return {
        ...state,
        isFetchingPromotions: true,
        promotions: [],
      };
    }
    case types.FETCH_PROMOTIONS.SUCCESS: {
      return {
        ...state,
        isFetchingPromotions: false,
        promotions: action.payload?.data,
      };
    }
    case types.FETCH_PROMOTIONS.FAILED: {
      return {
        ...state,
        isFetchingPromotions: false,
        promotions: [],
      };
    }
    case types.FETCH_PROMOTIONS.CANCELLED: {
      return {
        ...state,
        isFetchingPromotions: true,
        promotions: [],
      };
    }

    case types.CLEAR_PROMOTIONS:
      return {
        ...state,
        isFetchingPromotions: true,
        promotions: [],
      };

    case types.CREATE_PROMOTION.baseType: {
      return {
        ...state,
        isAddingPromotion: true,
      };
    }
    case types.CREATE_PROMOTION.SUCCESS: {
      return {
        ...state,
        isAddingPromotion: false,
      };
    }
    case types.CREATE_PROMOTION.FAILED: {
      return {
        ...state,
        isAddingPromotion: false,
      };
    }

    case types.SET_ADD_PROMOTION_DETAILS_PAYLOAD:
      return {
        ...state,
        addPromotionDetailsPayload: action.payload,
      };

    case types.SET_ADD_PROMOTION_CLAIMS_PAYLOAD:
      return {
        ...state,
        addPromotionClaimsPayload: action.payload,
      };

    case types.SET_ADD_PROMOTION_STEPS_PAYLOAD:
      return {
        ...state,
        addPromotionStepsPayload: action.payload,
      };

    case types.SET_ADD_PROMOTION_CONDITION_PAYLOAD:
      return {
        ...state,
        addPromotionConditionPayload: action.payload,
      };

    case types.SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS:
      return {
        ...state,
        addPromotionEligibilityAndFaqsPayload: action.payload,
      };

    case types.FETCH_PROMOTION_CLAIMS.baseType: {
      return {
        ...state,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.FETCH_PROMOTION_CLAIMS.SUCCESS: {
      return {
        ...state,
        isFetchingPromotionClaims: false,
        promotionClaims: action.payload?.data,
      };
    }
    case types.FETCH_PROMOTION_CLAIMS.FAILED: {
      return {
        ...state,
        isFetchingPromotionClaims: false,
        promotionClaims: [],
      };
    }
    case types.FETCH_PROMOTION_CLAIMS.CANCELLED: {
      return {
        ...state,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }

    case types.FETCH_PROMOTION_BY_ID.baseType: {
      return {
        ...state,
        isFetchingPromotionById: true,
        promotion: {},
      };
    }
    case types.FETCH_PROMOTION_BY_ID.SUCCESS: {
      return {
        ...state,
        isFetchingPromotionById: false,
        promotion: action.payload?.data,
      };
    }
    case types.FETCH_PROMOTION_BY_ID.FAILED: {
      return {
        ...state,
        isFetchingPromotionById: false,
        promotion: {},
      };
    }
    case types.FETCH_PROMOTION_BY_ID.CANCELLED: {
      return {
        ...state,
        isFetchingPromotionById: true,
        promotion: {},
      };
    }

    case types.CLEAR_PROMOTION:
      return {
        ...state,
        isUpdatingPromotion: false,
        promotion: {},
      };

    case types.UPDATE_PROMOTION.baseType: {
      return {
        ...state,
        isUpdatingPromotion: true,
        promotion: {},
      };
    }
    case types.UPDATE_PROMOTION.SUCCESS: {
      return {
        ...state,
        isUpdatingPromotion: false,
      };
    }
    case types.UPDATE_PROMOTION.FAILED: {
      return {
        ...state,
        isUpdatingPromotion: false,
      };
    }

    case types.SET_CONFIRMATION_MODAL_STATE:
      return {
        ...state,
        confirmationModalState: action?.payload,
      };

    case types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.baseType: {
      return {
        ...state,
        isUpdatingPromotionClaimMoorupStatus: true,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.SUCCESS: {
      return {
        ...state,
        isUpdatingPromotionClaimMoorupStatus: false,
      };
    }
    case types.UPDATE_PROMOTION_CLAIM_MOORUP_STATUS.FAILED: {
      return {
        ...state,
        isUpdatingPromotionClaimMoorupStatus: false,
      };
    }

    case types.UPDATE_PROMOTION_CLAIM_STATUS.baseType: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: true,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.UPDATE_PROMOTION_CLAIM_STATUS.SUCCESS: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: false,
      };
    }
    case types.UPDATE_PROMOTION_CLAIM_STATUS.FAILED: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: false,
      };
    }

    case types.BULK_UPDATE_PROMOTION_CLAIM_STATUS.baseType: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: true,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.BULK_UPDATE_PROMOTION_CLAIM_STATUS.SUCCESS: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: false,
      };
    }
    case types.BULK_UPDATE_PROMOTION_CLAIM_STATUS.FAILED: {
      return {
        ...state,
        isUpdatingPromotionClaimStatus: false,
      };
    }

    case types.PROCESS_PROMOTION_CLAIM_PAYMENT.baseType: {
      return {
        ...state,
        isProcessingPromotionClaimPayment: true,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.PROCESS_PROMOTION_CLAIM_PAYMENT.SUCCESS: {
      return {
        ...state,
        isProcessingPromotionClaimPayment: false,
      };
    }
    case types.PROCESS_PROMOTION_CLAIM_PAYMENT.FAILED: {
      return {
        ...state,
        isProcessingPromotionClaimPayment: false,
      };
    }

    case types.SET_PROMOTION_CARD_IMAGE:
      return {
        ...state,
        promotionCardImage: action?.payload,
      };

    case types.SET_PROMOTION_BANNER_IMAGE:
      return {
        ...state,
        promotionBannerImage: action?.payload,
      };

    case types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.baseType: {
      return {
        ...state,
        isBulkProcessingPromotionClaimPayment: true,
        isFetchingPromotionClaims: true,
        promotionClaims: [],
      };
    }
    case types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.SUCCESS: {
      return {
        ...state,
        isBulkProcessingPromotionClaimPayment: false,
        forProcessingClaimsPayment: [...state.forProcessingClaimsPayment, ...action.payload],
      };
    }
    case types.BULK_PROCESS_PROMOTION_CLAIM_PAYMENT.FAILED: {
      return {
        ...state,
        isBulkProcessingPromotionClaimPayment: false,
      };
    }

    case types.RESET_FORM: {
      return {
        ...state,
        resetForm: action.payload,
      };
    }

    default:
      return state;
  }
};

export { promotionReducer, promotionState };
