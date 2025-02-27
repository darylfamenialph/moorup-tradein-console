/* eslint-disable @typescript-eslint/no-explicit-any */
import * as types from './action-types';

export const setSideModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_SIDE_MODAL_STATE,
    payload,
  });
};

export const setCenterModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_CENTER_MODAL_STATE,
    payload,
  });
};

export const setSearchTerm = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_SEARCH_TERM,
    payload,
  });
};

export const setShowSideNav = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_SHOW_SIDE_NAV,
    payload,
  });
};


export const setRedirect = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_REDIRECT,
    payload,
  });
};

export const setConfirmationModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_CONFIRMATION_MODAL_STATE,
    payload,
  });
};

export const setResponseModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_RESPONSE_MODAL_STATE,
    payload,
  });
};

export const setGenericModalState = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_GENERIC_MODAL_STATE,
    payload,
  });
};
