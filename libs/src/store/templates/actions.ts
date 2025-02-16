/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getTemplates = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_TEMPLATES.baseType,
    () => axiosInstance(token).get(`/api/template?platform=${platform}&type=${payload}`, { signal }),
    { showErrorModal: true },
  )
};

export const requestTemplateChange = (currentTemplateId: string, payload: any, type: string, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REQUEST_TEMPLATE_CHANGE.baseType,
    () => axiosInstance(token).patch(`/api/template/request-change/${currentTemplateId}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getTemplates(type, platform)(dispatch),
    // Error callback
    () => getTemplates(type, platform)(dispatch),
  )
};

export const clearTemplates = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_TEMPLATES,
    payload,
  });
};

export const requestTemplatePreview = (payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REQUEST_TEMPLATE_PREVIEW.baseType,
    () => axiosInstance(token).post('/api/template/request-change-preview', payload),
    { showErrorModal: true },
  )
};

export const clearTemplatePreview = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_TEMPLATE_PREVIEW,
    payload,
  });
};

export const setActivePill = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ACTIVE_PILL,
    payload,
  });
};

export const getTemplateApprovals = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_TEMPLATE_APPROVALS.baseType,
    () => axiosInstance(token).get('/api/template/approvals', { params: payload, signal }),
    { showErrorModal: true },
  )
};

export const clearTemplateApprovals = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_TEMPLATE_APPROVALS,
    payload,
  });
};

export const getTemplateApprovalById = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_TEMPLATE_APPROVAL_BY_ID.baseType,
    () => axiosInstance(token).get(`/api/template/request-change/${payload}`,  { signal }),
    { showErrorModal: true },
  )
};

export const clearTemplateApproval = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_TEMPLATE_APPROVAL,
    payload,
  });
};

export const processTemplateApproval = (payload: any, approvalId: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.PROCESS_TEMPLATE_APPROVAL.baseType,
    () => axiosInstance(token).patch(`/api/template/approvals/${approvalId}/update-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
  )
};
