import { createActionTypes } from '../../helpers';

export const FETCH_PROMOTIONS = createActionTypes('FETCH_PROMOTIONS');
export const CREATE_PROMOTION = createActionTypes('CREATE_PROMOTION');
export const UPDATE_PROMOTION = createActionTypes('UPDATE_PROMOTION');
export const FETCH_PROMOTION_CLAIMS = createActionTypes('FETCH_PROMOTION_CLAIMS');
export const FETCH_PROMOTION_BY_ID = createActionTypes('FETCH_PROMOTION_BY_ID');
export const UPDATE_PROMOTION_CLAIM_STATUS = createActionTypes('UPDATE_PROMOTION_CLAIM_STATUS');
export const BULK_UPDATE_PROMOTION_CLAIM_STATUS = createActionTypes('BULK_UPDATE_PROMOTION_CLAIM_STATUS');
export const UPDATE_PROMOTION_CLAIM_MOORUP_STATUS = createActionTypes('UPDATE_PROMOTION_CLAIM_MOORUP_STATUS');
export const BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS = createActionTypes('BULK_UPDATE_PROMOTION_CLAIM_MOORUP_STATUS');
export const PROCESS_PROMOTION_CLAIM_PAYMENT = createActionTypes('PROCESS_PROMOTION_CLAIM_PAYMENT');
export const SUBMIT_ORDER_PROMOTION_CLAIM = createActionTypes('SUBMIT_ORDER_PROMOTION_CLAIM');
export const BULK_PROCESS_PROMOTION_CLAIM_PAYMENT = createActionTypes('BULK_PROCESS_PROMOTION_CLAIM_PAYMENT');
export const UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER = createActionTypes('UPDATE_PROMOTION_CLAIM_RECEIPT_NUMBER');
export const ATTACH_RECEIPT_IMAGE = createActionTypes('ATTACH_RECEIPT_IMAGE');
export const REMOVE_RECEIPT_IMAGE = createActionTypes('REMOVE_RECEIPT_IMAGE');

export const CLEAR_PROMOTIONS = 'CLEAR_PROMOTIONS';
export const SET_ADD_PROMOTION_DETAILS_PAYLOAD = 'SET_ADD_PROMOTION_DETAILS_PAYLOAD';
export const SET_ADD_PROMOTION_CLAIMS_PAYLOAD = 'SET_ADD_PROMOTION_CLAIMS_PAYLOAD';
export const SET_ADD_PROMOTION_STEPS_PAYLOAD = 'SET_ADD_PROMOTION_STEPS_PAYLOAD';
export const SET_ADD_PROMOTION_CONDITION_PAYLOAD = 'SET_ADD_PROMOTION_CONDITION_PAYLOAD';
export const SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS = 'SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS';
export const CLEAR_PROMOTION_CLAIMS = 'CLEAR_PROMOTION_CLAIMS';
export const CLEAR_PROMOTION = 'CLEAR_PROMOTION';
export const SET_PROMOTION_CARD_IMAGE = 'SET_PROMOTION_CARD_IMAGE';
export const SET_PROMOTION_BANNER_IMAGE = 'SET_PROMOTION_BANNER_IMAGE';
export const SET_ORDER_PROMOTION_CLAIM_PAYLOAD = 'SET_ORDER_PROMOTION_CLAIM_PAYLOAD';
export const RESET_FORM = 'RESET_FORM';
