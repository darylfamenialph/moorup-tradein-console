import { createActionTypes } from '../../helpers';

export const LOGIN_USER = createActionTypes('LOGIN_USER');
export const LOGOUT_USER = createActionTypes('LOGOUT_USER');
export const GET_USER_DETAILS = createActionTypes('GET_USER_DETAILS');
export const GET_PLATFORM_CONFIG = createActionTypes('GET_PLATFORM_CONFIG');
export const UPDATE_PLATFORM_CONFIG = createActionTypes(
  'UPDATE_PLATFORM_CONFIG',
);

export const SET_ACTIVE_PLATFORM = 'SET_ACTIVE_PLATFORM';
export const SET_LOADING = 'SET_LOADING';
export const CLEAR_PLATFORM_CONFIG = 'CLEAR_PLATFORM_CONFIG';

export const SEND_VERIFICATION_CODE = createActionTypes(
  'SEND_VERIFICATION_CODE',
);
export const VERIFY_CODE = createActionTypes('VERIFY_CODE');
