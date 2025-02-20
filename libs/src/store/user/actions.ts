/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getUsers = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_USERS.baseType,
    () => axiosInstance(token).get(`/api/admins?platform=${platform}&exclude=${payload}`, { signal }),
    { showErrorModal: true },
  )
};

export const clearUsers = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_USERS,
    payload,
  });
};

export const createUser = (payload: any, currentUserId: string, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.CREATE_USER.baseType,
    () => axiosInstance(token).post('/api/admins', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getUsers(currentUserId, platform)(dispatch),
    // Error callback
    () => getUsers(currentUserId, platform)(dispatch),
  )
};

export const updateUser = (id: string, currentUserId: string, platform: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_USER.baseType,
    () => axiosInstance(token).patch(`/api/admins/${id}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getUsers(currentUserId, platform)(dispatch),
    // Error callback
    () => getUsers(currentUserId, platform)(dispatch),
  )
};

export const setUpdateUserDetailsPayload = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_UPDATE_USER_DETAILS_PAYLOAD,
    payload,
  });
};
