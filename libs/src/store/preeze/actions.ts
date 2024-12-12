/* eslint-disable @typescript-eslint/no-explicit-any */
import { CANCELLED_AXIOS } from '../../constants';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getPreezeBalance = (signal?: AbortSignal) => (dispatch: any, token?: string) => {
  dispatch({
    type: types.FETCH_PREEZE_BALANCE.baseType,
  });

  axiosInstance(token)
    .get('/api/payments/float-balance', { signal: signal })
    // .get('/api/v2/float-balance/', { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_PREEZE_BALANCE.SUCCESS,
        payload: response,
      });
    })
    .catch((error) => {
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_PREEZE_BALANCE.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_PREEZE_BALANCE.FAILED,
          payload: error,
        });
      }
    });
};

