/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY,
  ACTIVE_PLATFORM,
  ANNOUNCEMENT_MODAL,
  IS_VERIFIED,
} from './../../constants';
import * as types from './action-types';

export const loginUser = (payload: any) => async (dispatch: any) => {
  await makeApiRequest(
    dispatch,
    types.LOGIN_USER.baseType,
    () => axiosInstance().post('/api/auth/omc-login', payload),
    {},
  );
};

export const logoutUser = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.LOGOUT_USER.baseType,
    payload,
  });

  try {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRY);
    localStorage.removeItem(ACTIVE_PLATFORM);
    localStorage.removeItem(IS_VERIFIED);
    sessionStorage.removeItem(ANNOUNCEMENT_MODAL);

    dispatch({
      type: types.LOGOUT_USER.SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: types.LOGOUT_USER.FAILED,
      payload,
    });
  }
};

export const getUserDetailsById = (payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.GET_USER_DETAILS.baseType,
    () => axiosInstance(token).get(`/api/admins/${payload}`),
    {},
  );
};

export const getPlatformConfig = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.GET_PLATFORM_CONFIG.baseType,
    () => axiosInstance(token).get(`/api/configurations?platform=${payload}`, { signal }),
    {},
  );
};

export const setActivePlatform = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ACTIVE_PLATFORM,
    payload,
  });
};

export const setLoading = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_LOADING,
    payload,
  });
};

export const clearPlatformConfig = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_PLATFORM_CONFIG,
    payload,
  });
};

export const updatePlatformConfig = (id: string, activePlatform: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PLATFORM_CONFIG.baseType,
    () => axiosInstance(token).patch(`/api/configurations/${id}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getPlatformConfig(activePlatform)(dispatch, token),
    // Error callback
    () => getPlatformConfig(activePlatform)(dispatch, token),
  );
};

export const sendVerificationCode = (payload: any) => async (dispatch: any) => {
  await makeApiRequest(
    dispatch,
    types.SEND_VERIFICATION_CODE.baseType,
    () => axiosInstance().post('/api/notifications/verification', payload),
    {},
  );
};

export const verifyVerificationCode = (payload: any) => async (dispatch: any) => {
  await makeApiRequest(
    dispatch,
    types.VERIFY_CODE.baseType,
    () => axiosInstance().post('/api/notifications/verify-code', payload),
    {},
  );
};
