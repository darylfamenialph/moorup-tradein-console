/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BAD_REQUEST,
  CONSOLE,
  ProductTypes
} from '../../constants';
import { makeApiRequest } from '../../helpers';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getOrderItems = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDER_ITEMS.baseType,
    () => axiosInstance(token).get(`/api/orders/items?platform=${platform}`, { params: payload, signal }),
    { showErrorModal: true },
  );
};

export const clearOrderItems = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER_ITEMS,
    payload,
  });
};

export const getAllOrders = (payload: any, platform: any, signal?: AbortSignal) => async (dispatch: any, token?: string, userDetails?: any) => {
  const params = userDetails?.role === CONSOLE ? { ...payload, product_type: ProductTypes.GAME_CONSOLES } : payload;
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDERS.baseType,
    () => axiosInstance(token, true).get(`/api/orders?platform=${platform}`, { params, signal }),
    { showErrorModal: true },
  )
};

export const getOrderShipments = (payload: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDER_SHIPMENTS.baseType,
    () => axiosInstance(token).get(`/api/orders/${payload}/shipments`, { signal }),
    { showErrorModal: true },
  )
};

export const getOrderById = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDER_BY_ID.baseType,
    () => axiosInstance(token).get(`/api/orders/${payload}`, { signal }),
    { showErrorModal: true },
  )
};

export const resendShipmentLabel = (orderItemId: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.RESEND_ITEM_SHIPMENT_LABEL.baseType,
    () => axiosInstance(token).post(`/api/orders/${orderItemId}/resend-label`),
    { showErrorModal: true, showSuccessModal: true },
  )
};

export const updateOrderItemById = (orderItemId: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_ITEM_BY_ID.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => {
      getOrderById(orderId)(dispatch, token)
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
    // Error callback
    () => {
      getOrderById(orderId)(dispatch, token)
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
  )
};

export const receiveOrderItemById = (orderItemId: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.RECEIVE_ORDER_ITEM_BY_ID.baseType,
    () => axiosInstance(token).patch(`/api/orders/receive/${orderItemId}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => {
      getOrderById(orderId)(dispatch, token)
      getOrderShipments(orderId)(dispatch, token);
    },
    // Error callback
    () => {
      getOrderById(orderId)(dispatch, token)
      getOrderShipments(orderId)(dispatch, token);
    },
  )
};

export const evaluateOrderItemById = (orderItemId: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.EVALUATE_ORDER_ITEM_BY_ID.baseType,
    () => axiosInstance(token).post(`/api/orders/${orderItemId}/evaluate`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
    // Error callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
  )
};

export const reviseOfferByItemId = (orderItemNumber: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REVISE_OFFER_BY_ITEM_ID.baseType,
    () => axiosInstance(token).post(`/api/orders/${orderItemNumber}/revise-offer`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
    // Error callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
  )
};

export const cancelOrderItemById = (orderItemId: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.CANCEL_ORDER_ITEM_BY_ID.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
    // Error callback
    () => {
      getOrderById(orderId)(dispatch, token);
      getOrderShipments(orderId)(dispatch, token);
      setToggleModal(false)(dispatch);
    },
  )
};

export const updateShipmentStatus = (shipmentId: string, orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_SHIPPING_STATUS_BY_ID.baseType,
    () => axiosInstance(token).patch(`/api/shipments/status/${shipmentId}`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderShipments(orderId)(dispatch, token),
    // Error callback
    () => getOrderShipments(orderId)(dispatch, token),
  )
};

export const updateSendinDeadline = (orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_SENDIN_DEADLINE.baseType,
    () => axiosInstance(token).patch('/api/orders/items/sendin-deadline', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const bulkCancelOrderItems = (orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.BULK_CANCEL_ORDER_ITEMS.baseType,
    () => axiosInstance(token).patch('/api/orders/items/cancel-bulk', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const updateOrderFollowups = (orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_FOLLOWUP.baseType,
    () => axiosInstance(token).post('/api/orders/follow-up', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const updateOrderItemLockType = (orderItemId: any, orderId: any, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_ITEM_LOCK_TYPE.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/lock-devices/${orderItemId}/lock-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const logCustomerNonContact = (orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.LOG_CUSTOMER_NONCONTACT.baseType,
    () => axiosInstance(token).patch(`/api/orders/${orderId}/non-contact`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const updateDeviceInventoryStatus = (orderItemId: any, payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_INVENTORY_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/inventory-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderItems(filter, platform)(dispatch, token),
    // Error callback
    () => getOrderItems(filter, platform)(dispatch, token),
  )
};

export const setToggleModal = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_TOGGLE_MODAL,
    payload,
  });
};

export const setActiveOrderItem = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ACTIVE_ORDER_ITEM,
    payload,
  });
};

export const setActiveOrder = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.SET_ACTIVE_ORDER,
    payload,
  });
};

export const clearOrders = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDERS,
    payload,
  });
};

export const generateLabels = (payload: any, reloadData?: boolean) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.GENERATE_LABELS.baseType,
    () => axiosInstance(token).post('/api/shipments/generate-labels?label=return,outbound&update_status=true', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    (response) => {
      const { data = {} } = response?.data || {};
        if (data?.return?.label) window.open(data?.return?.label, '_blank');
        if (data?.outbound?.label) window.open(data?.outbound?.label, '_blank');
        if (reloadData) getOrderShipments(payload.item_id)(dispatch, token);
    },
    // Error callback
    () => {
      if (reloadData) getOrderShipments(payload.item_id)(dispatch, token);
    }
  )
};

export const generateOutboundLabel = (payload: any, platform: string, filter?: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.GENERATE_OUTBOUND_LABEL.baseType,
    () => axiosInstance(token).post('/api/shipments/generate-labels?label=outbound', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    (response) => {
      const { data = {} } = response?.data || {};
      if (data?.outbound?.label) window.open(data?.outbound?.label, '_blank');

      if (filter) getOrderItems(filter, platform)(dispatch, token);
    },
    // Error callback
    () => {
      if (filter) getOrderItems(filter, platform)(dispatch, token);
    }
  )
};

export const updateOrderItemImeiSerial = (orderItemId: string, orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_ITEM_IMEI_SERIAL.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/imei`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const getGiftCardStatus = (orderId: any, payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_GIFT_CARD_STATUS.baseType,
    () => axiosInstance(token).post(`/api/payments/refresh-voucher/${orderId}?voucherOrderNumber=${payload?.voucherOrderNumber}`),
    { showErrorModal: true },
  )
};

export const cancelGiftCard = (orderId: any, voucherPan: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.CANCEL_GIFT_CARD.baseType,
    () => axiosInstance(token).patch(`/api/payments/cancel-voucher-by-query/${orderId}?voucherPan=${voucherPan}`),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const updateOrderItemsStatus = (orderItemId: any, payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_ITEM_BY_ID.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderItems(filter, platform)(dispatch, token),
    // Error callback
    () => getOrderItems(filter, platform)(dispatch, token),
  )
};

export const getAllOrderPayments = (platform: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDER_PAYMENTS.baseType,
    () => axiosInstance(token).get(`/api/orders/flat-file-data?platform=${platform}`, { signal }),
    { showErrorModal: true },
  )
};

export const getOrderPaymentById = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_ORDER_PAYMENT_BY_ID.baseType,
    () => axiosInstance(token).get(`/api/orders/flat-file-data/${payload}`, { signal }),
    { showErrorModal: true },
  )
};

export const downloadOrderPaymentFile = (payload: any, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.DOWNLOAD_ORDER_PAYMENT_FILE.baseType,
    () => axiosInstance(token).get('/api/orders/download-flat-file', { signal, params: payload, responseType: 'blob'}),
    { showErrorModal: true },
    // Success callback
    (response) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flat-file.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  )
};

export const downloadOrderPaymentFileRange = (payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.DOWNLOAD_ORDER_PAYMENT_FILE_RANGE.baseType,
    () => axiosInstance(token).get('/api/orders/download-flat-file-date-range', { params: payload, responseType: 'blob'}),
    { showErrorModal: true },
    // Success callback
    (response) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flat-file.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  )
};

export const clearOrderPaymentItems = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER_PAYMENT_ITEMS,
    payload,
  });
};

export const clearOrder = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER,
    payload,
  });
};

export const addOrderNote = (orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.ADD_ORDER_NOTE.baseType,
    () => axiosInstance(token).post('/api/orders/notes', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const upsertZendeskLink = (orderId: string, payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPSERT_ZENDESK_LINK.baseType,
    () => axiosInstance(token).patch(`/api/orders/${orderId}/insert-zendesk-link`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderById(orderId)(dispatch, token),
    // Error callback
    () => getOrderById(orderId)(dispatch, token),
  )
};

export const importPaymentsFlatFile = (file: File, _userId: string, activePlatform: string) => async (dispatch: any, token?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('platform', activePlatform);

  await makeApiRequest(
    dispatch,
    types.IMPORT_PAYMENTS_FLAT_FILE.baseType,
    () => axiosInstance(token).post('/api/payments/bulk-manual-payment', formData, { headers: { 'Content-Type': 'multipart/form-data' }}),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getAllOrderPayments(activePlatform)(dispatch, token),
    // Error callback
    (error) => {
      if (error.code === BAD_REQUEST) {
        dispatch({
          type: types.IMPORT_PAYMENTS_FLAT_FILE.BAD_REQUEST,
          payload: error?.response?.data?.data?.invalidEntries || [],
        });
      }

      getAllOrderPayments(activePlatform)(dispatch, token);
    },
  )
};

export const clearUploadPaymentErrors = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER_PAYMENT_ERRORS,
    payload,
  });
};

export const getLockedDevices = (payload: any, platform: string, signal?: AbortSignal) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.FETCH_LOCKED_DEVICES.baseType,
    () => axiosInstance(token).get(`/api/orders/items/lock-devices?platform=${platform}`, { params: payload, signal }),
    { showErrorModal: true },
  )
};

export const clearLockedDevices = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_LOCKED_DEVICES,
    payload,
  });
};

export const setLockedDeviceLockStatus = (orderItemId: string, payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.SET_LOCKED_DEVICE_LOCK_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/lock-devices/${orderItemId}/lock-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getLockedDevices(filter, platform)(dispatch, token),
    // Error callback
    () => getLockedDevices(filter, platform)(dispatch, token),
  )
};

export const setLockedDeviceStatus = (orderItemId: string, payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.SET_LOCKED_DEVICE_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/lock-devices/${orderItemId}/device-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getLockedDevices(filter, platform)(dispatch, token),
    // Error callback
    () => getLockedDevices(filter, platform)(dispatch, token),
  )
};

export const updateOrderItemsPaymentStatus = (orderItemId: any, payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.UPDATE_ORDER_ITEM_PAYMENT_STATUS.baseType,
    () => axiosInstance(token).patch(`/api/orders/items/${orderItemId}/payment-status`, payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderItems(filter, platform)(dispatch, token),
    // Error callback
    () => getOrderItems(filter, platform)(dispatch, token),
  )
};

export const requestOrderItemPayment = (payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REQUEST_ORDER_ITEM_PAYMENT.baseType,
    () => axiosInstance(token).post('/api/stripe/capture-payment-intent', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderItems(filter, platform)(dispatch, token),
    // Error callback
    () => getOrderItems(filter, platform)(dispatch, token),
  )
};

export const resendEmail = (payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.RESEND_EMAIL.baseType,
    () => axiosInstance(token).post('/api/orders/resend-email/', payload),
    { showErrorModal: true, showSuccessModal: true },
  )
};

export const resendEmailv2 = (payload: any) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.RESEND_EMAIL_V2.baseType,
    () => axiosInstance(token).post('/api/orders/resend-email-v2/', payload),
    { showErrorModal: true, showSuccessModal: true },
  )
};

export const requestGiftCardPayment = (payload: string[]) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.REQUEST_GIFTCARD_PAYMENT.baseType,
    () => axiosInstance(token).post('api/payments/send-voucher', payload),
    { showErrorModal: true, showSuccessModal: true },
  )
};


export const overridePaymentStatus = (payload: any, filter: any, platform: string) => async (dispatch: any, token?: string) => {
  await makeApiRequest(
    dispatch,
    types.OVERRIDE_PAYMENT_STATUS.baseType,
    () => axiosInstance(token).post('api/payments/manual-payment-override', payload),
    { showErrorModal: true, showSuccessModal: true },
    // Success callback
    () => getOrderItems(filter, platform)(dispatch, token),
    // Error callback
    () => getOrderItems(filter, platform)(dispatch, token),
  )
};