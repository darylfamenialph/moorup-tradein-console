/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import { CANCELLED_AXIOS } from '../../constants';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getUsers = (payload: any, signal?: AbortSignal) => (dispatch: any) => {
  dispatch({
    type: types.FETCH_USERS.baseType,
    payload,
  });

  axiosInstance()
    .get('/api/admins', { signal: signal })
    .then((response) => {
      dispatch({
        type: types.FETCH_USERS.SUCCESS,
        payload: response?.data,
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
      if (error.code === CANCELLED_AXIOS) {
        dispatch({
          type: types.FETCH_USERS.CANCELLED,
          payload: error,
        });
      } else {
        dispatch({
          type: types.FETCH_USERS.FAILED,
          payload: error,
        });
      }
    });
};

export const clearUsers = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_USERS,
    payload,
  });
};

export const createUser = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CREATE_USER.baseType,
    payload,
  });

  axiosInstance()
    .post('/api/admins', payload)
    .then((response) => {
      dispatch({
        type: types.CREATE_USER.SUCCESS,
        payload: response?.data,
      });

      getUsers({})(dispatch);
      toast.success('User successfully added!');
    })
    .catch((error) => {
      dispatch({
        type: types.CREATE_USER.FAILED,
        payload: error,
      });

      toast.error('Failed to add user!');
    });
};

export const updateUser = (id: string, payload: any) => (dispatch: any) => {
  dispatch({
    type: types.UPDATE_USER.baseType,
    payload,
  });

  axiosInstance()
    .patch(`/api/admins/${id}`, payload)
    .then((response) => {
      dispatch({
        type: types.UPDATE_USER.SUCCESS,
        payload: response?.data,
      });

      getUsers({})(dispatch);
      toast.success('User successfully updated!');
    })
    .catch((error) => {
      dispatch({
        type: types.UPDATE_USER.FAILED,
        payload: error,
      });

      toast.error('Failed to update user!');
    });
};
