/* eslint-disable @typescript-eslint/no-explicit-any */

import * as types from './action-types';

const commonState = {
  sideModalState: {
    open: false,
    view: null,
  },
  centerModalState: {
    open: false,
    view: null,
  },
  confirmationModalState: {
    open: false,
    view: null,
    title: 'Confirmation',
    content: 'Are you sure you want to perform this action?',
    data: {},
    id: '',
  },
  responseModalState: {
    open: false,
    type: null,
    title: null,
    subtitle: null,
  },
  genericModalState: {
    open: false,
    type: null,
    title: null,
    content: null,
    data: {},
  },
  searchTerm: '',
  showSideNav: true,
  redirectTo: null,
};

const commonReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.SET_SIDE_MODAL_STATE:
      return {
        ...state,
        sideModalState: action.payload,
      };

    case types.SET_CENTER_MODAL_STATE:
      return {
        ...state,
        centerModalState: action.payload,
      };

    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case types.SET_SHOW_SIDE_NAV:
      return {
        ...state,
        showSideNav: action.payload,
      };

    case types.SET_REDIRECT:
      return {
        ...state,
        redirectTo: action.payload,
      };

    case types.SET_CONFIRMATION_MODAL_STATE:
      return {
        ...state,
        confirmationModalState: action?.payload,
      };

    case types.SET_RESPONSE_MODAL_STATE:
      return {
        ...state,
        responseModalState: action?.payload,
      };

    case types.SET_GENERIC_MODAL_STATE:
      return {
        ...state,
        genericModalState: action?.payload,
      };

    default:
      return state;
  }
};

export { commonReducer, commonState };
