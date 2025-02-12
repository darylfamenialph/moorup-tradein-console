/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import { Dispatch } from 'react';
import { CANCELLED_AXIOS, GenericResponseMessages, GenericResponseTitles, GenericResponseTypes } from '../constants';
import * as commonTypes from '../store/common';

interface ApiResponse<T = any> {
  [x: string]: any;
  data: T;
  status: number;
  message?: string;
}

interface RequestOptions { 
  showSuccessModal?: boolean;
  showErrorModal?: boolean;
  successSubtitle?: string;
  errorSubtitle?: string;
}

export function handleSuccess(
  dispatch: Dispatch<any>, 
  type: string, 
  response: AxiosResponse<ApiResponse>,
  options: RequestOptions,
) {
  dispatch({
    type: `${type}_SUCCESS`,
    payload: response?.data,
  });

  if (options.showSuccessModal) {
    dispatch({
      type: commonTypes.SET_RESPONSE_MODAL_STATE,
      payload: {
        open: true,
        type: GenericResponseTypes.SUCCESS,
        title: GenericResponseTitles.SUCCESS,
        subtitle: options.successSubtitle || GenericResponseMessages.SUCCESS,
      },
    });
  }
}

export function handleError(
  dispatch: Dispatch<any>, 
  type: string, 
  error: any, 
  options: RequestOptions,
) {
  if (error.code === CANCELLED_AXIOS) {
    dispatch({
      type: `${type}_CANCELLED`,
      payload: error,
    });
    return;
  }

  dispatch({
    type: `${type}_FAILED`,
    payload: error,
  });

  if (options.showErrorModal) {
    dispatch({
      type: commonTypes.SET_RESPONSE_MODAL_STATE,
      payload: {
        open: true,
        type: GenericResponseTypes.FAILED,
        title: GenericResponseTitles.FAILED,
        subtitle: options.errorSubtitle || GenericResponseMessages.FAILED,
      },
    });
  }
}

// Create base API request handler
export async function makeApiRequest(
  dispatch: Dispatch<any>,
  actionType: string,
  apiCall: () => Promise<any>,
  options: RequestOptions,
  onSuccess?: (response: ApiResponse) => void,
  onError?: (error: any) => void,
) {
  dispatch({
    type: actionType,
  });

  try {
    const response = await apiCall();
    handleSuccess(dispatch, actionType, response, options);
    onSuccess?.(response);
  } catch (error) {
    handleError(dispatch, actionType, error, options);
    onError?.(error);
  }
}
