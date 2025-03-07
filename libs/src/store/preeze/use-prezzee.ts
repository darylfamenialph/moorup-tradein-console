/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const usePrezzee = () => {
  const { state, dispatch } = useContext(RootContext);
  const { token, activePlatform } = state.auth;

  const updatePrezzeeBalance = () => {
    return actions.updatePrezzeeBalance(activePlatform)(dispatch, token);
  };

  return {
    state: state.prezzee,
    updatePrezzeeBalance,
  };
};
