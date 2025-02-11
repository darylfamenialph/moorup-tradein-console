/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const usePreeze = () => {
  const { state, dispatch } = useContext(RootContext);
  const { token } = state.auth;

  const updatePrezzeeBalance = (signal?: AbortSignal) => {
    return actions.updatePrezzeeBalance(signal)(dispatch, token);
  };

  return {
    state: state.preeze,
    updatePrezzeeBalance,
  };
};
