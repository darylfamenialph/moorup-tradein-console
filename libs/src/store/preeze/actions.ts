/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const updatePrezzeeBalance = () => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_PREEZE_BALANCE.baseType,
    () => axiosInstance(token).patch('/api/configurations/save-prezzee-balance'),
    { showErrorModal: true },
  )
};
