/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const useCommon = () => {
  const { state, dispatch } = useContext(RootContext);

  const setSideModalState = (payload: any) => {
    actions.setSideModalState(payload)(dispatch);
  }

  const setCenterModalState = (payload: any) => {
    actions.setCenterModalState(payload)(dispatch);
  }

  const setSearchTerm = (payload: any) => {
    actions.setSearchTerm(payload)(dispatch);
  }

  const setShowSideNav = (payload: any) => {
    actions.setShowSideNav(payload)(dispatch);
  }

  const setRedirect = (payload: any) => {
    actions.setRedirect(payload)(dispatch);
  }

  const setConfirmationModalState = (payload: any) => {
    actions.setConfirmationModalState(payload)(dispatch);
  }

  return {
    state: state.common,
    setSideModalState,
    setCenterModalState,
    setSearchTerm,
    setShowSideNav,
    setRedirect,
    setConfirmationModalState,
  };
};
