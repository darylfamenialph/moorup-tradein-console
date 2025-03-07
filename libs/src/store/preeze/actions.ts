/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import * as authTypes from '../auth/action-types';
import * as authActions from '../auth/actions';
import axiosInstance from '../axios';
import * as types from './action-types';

export const updatePrezzeeBalance = (platform?: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PREEZE_BALANCE.baseType,
    () => axiosInstance(token).patch('/api/configurations/save-prezzee-balance'),
    {},
    // Success callback
    () => {
      dispatch({
        type: authTypes.GET_PLATFORM_CONFIG.baseType,
      });

      setTimeout(() => {
        authActions.getPlatformConfig(platform)(dispatch, token);
      }, 2000);
    },
    // Error callback
    () => {
      dispatch({
        type: authTypes.GET_PLATFORM_CONFIG.baseType,
      });
      
      setTimeout(() => {
        authActions.getPlatformConfig(platform)(dispatch, token);
      }, 2000);
    },
  )
};
