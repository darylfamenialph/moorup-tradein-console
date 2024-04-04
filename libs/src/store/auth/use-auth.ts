/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const useAuth = () => {
  const { state, dispatch } = useContext(RootContext);
  const {
    activePlatform,
  } = state.auth;

  const loginUser = (payload: any) => {
    actions.loginUser(payload)(dispatch);
  }

  const logoutUser = () => {
    actions.logoutUser({})(dispatch);
  }

  const getUserDetailsById = (payload: any) => {
    actions.getUserDetailsById(payload)(dispatch);
  }

  const getPlatformConfig = (payload: any, signal?: AbortSignal) => {
    actions.getPlatformConfig(payload, signal)(dispatch);
  }

  const setActivePlatform = (payload: any) => {
    actions.setActivePlatform(payload)(dispatch);
  }

  const setLoading = (payload: any) => {
    actions.setLoading(payload)(dispatch);
  }

  const clearPlatformConfig = (payload: any) => {
    actions.clearPlatformConfig(payload)(dispatch);
  }

  const updatePlatformConfig = (id: string, payload: any) => {
    actions.updatePlatformConfig(id, activePlatform, payload)(dispatch);
  }

  return {
    state: state.auth,
    loginUser,
    logoutUser,
    getUserDetailsById,
    getPlatformConfig,
    setActivePlatform,
    setLoading,
    clearPlatformConfig,
    updatePlatformConfig,
  };
};
