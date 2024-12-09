/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const usePreeze = () => {
  const { state, dispatch } = useContext(RootContext);
  const {
    token,
  } = state.auth;

  const getPreezeBalance = (signal: AbortSignal) => {
    actions.getPreezeBalance(signal)(dispatch, token);
  }

  return {
    state: state.preeze,
    getPreezeBalance,
  };
};
