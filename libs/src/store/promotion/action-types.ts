import { createActionTypes } from '../../helpers';

export const FETCH_PROMOTIONS = createActionTypes('FETCH_PROMOTIONS');
export const CREATE_PROMOTION = createActionTypes('CREATE_PROMOTION');
export const UPDATE_PROMOTION = createActionTypes('UPDATE_PROMOTION');
export const FETCH_PROMOTION_CLAIMS = createActionTypes('FETCH_PROMOTION_CLAIMS');
export const FETCH_PROMOTION_BY_ID = createActionTypes('FETCH_PROMOTION_BY_ID');
export const UPDATE_PROMOTION_CLAIM_STATUS = createActionTypes('UPDATE_PROMOTION_CLAIM_STATUS');
export const UPDATE_PROMOTION_CLAIM_MOORUP_STATUS = createActionTypes('UPDATE_PROMOTION_CLAIM_MOORUP_STATUS');

export const CLEAR_PROMOTIONS = 'CLEAR_PROMOTIONS';
export const SET_ADD_PROMOTION_DETAILS_PAYLOAD = 'SET_ADD_PROMOTION_DETAILS_PAYLOAD';
export const SET_ADD_PROMOTION_CLAIMS_PAYLOAD = 'SET_ADD_PROMOTION_CLAIMS_PAYLOAD';
export const SET_ADD_PROMOTION_STEPS_PAYLOAD = 'SET_ADD_PROMOTION_STEPS_PAYLOAD';
export const SET_ADD_PROMOTION_CONDITION_PAYLOAD = 'SET_ADD_PROMOTION_CONDITION_PAYLOAD';
export const SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS = 'SET_ADD_PROMOTION_ELIGIBILITY_AND_FAQS';
export const CLEAR_PROMOTION_CLAIMS = 'CLEAR_PROMOTION_CLAIMS';
export const CLEAR_PROMOTION = 'CLEAR_PROMOTION';
export const SET_CONFIRMATION_MODAL_STATE = 'SET_CONFIRMATION_MODAL_STATE';
