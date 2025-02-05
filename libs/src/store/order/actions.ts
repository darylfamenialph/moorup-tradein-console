/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from 'react-toastify';
import {
  BAD_REQUEST,
  CANCELLED_AXIOS,
  CONSOLE,
  ProductTypes,
  StripeErrorCodes,
} from '../../constants';
import axiosInstance from '../axios';
import * as types from './action-types';

export const getOrderItems =
  (payload: any, platform: string, signal?: AbortSignal) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_ITEMS.baseType,
      payload,
    });

    axiosInstance(token)
      .get(`/api/orders/items?platform=${platform}`, {
        params: payload,
        signal: signal,
      })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_ITEMS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_ITEMS.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_ITEMS.FAILED,
            payload: error,
          });
        }
      });
  };

export const clearOrderItems = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER_ITEMS,
    payload,
  });
};

export const getAllOrders =
  (payload: any, platform: any, signal?: AbortSignal) =>
  (dispatch: any, token?: string, userDetails?: any) => {
    dispatch({
      type: types.FETCH_ORDERS.baseType,
      payload,
    });

    let params = payload;
    switch (userDetails?.role) {
      case CONSOLE:
        params = {
          ...payload,
          product_type: ProductTypes.GAME_CONSOLES,
        };
        break;

      default:
        break;
    }

    axiosInstance(token)
      .get(`/api/orders?platform=${platform}`, {
        signal: signal,
        params: params,
      })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDERS.SUCCESS,
          payload: response?.data,
        });
        dispatch({
          type: types.FETCH_ORDER_PAYMENTS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDERS.CANCELLED,
            payload: error,
          });
          dispatch({
            type: types.FETCH_ORDER_PAYMENTS.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_PAYMENTS.FAILED,
            payload: error,
          });
        }
      });
  };

export const getOrderShipments =
  (payload: string, signal?: AbortSignal) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_SHIPMENTS.baseType,
      payload,
    });

    axiosInstance(token)
      .get(`/api/orders/${payload}/shipments`, { signal: signal })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_SHIPMENTS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_SHIPMENTS.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_SHIPMENTS.FAILED,
            payload: error,
          });
        }
      });
  };

export const getOrderById =
  (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .get(`/api/orders/${payload}`, { signal: signal })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_BY_ID.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_BY_ID.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_BY_ID.FAILED,
            payload: error,
          });
        }
      });
  };

export const updateOrderById =
  (orderId: any, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/${orderId}`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Order successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_BY_ID.FAILED,
          payload: error,
        });

        getOrderById(orderId)(dispatch, token);
        toast.error('Failed to update order details.');
      });
  };

export const cancelOrderById =
  (orderId: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.CANCEL_ORDER_BY_ID.baseType,
    });

    axiosInstance(token)
      .patch(`/api/orders/${orderId}/cancel`)
      .then((response) => {
        dispatch({
          type: types.CANCEL_ORDER_BY_ID.SUCCESS,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Order successfully cancelled!');
      })
      .catch((error) => {
        dispatch({
          type: types.CANCEL_ORDER_BY_ID.FAILED,
          payload: error,
        });

        getOrderById(orderId)(dispatch, token);
        toast.error('Failed to cancel order.');
      });
  };

export const resendShipmentLabel =
  (id: any, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.RESEND_SHIPMENT_LABEL.baseType,
      id,
    });

    axiosInstance(token)
      .post(`/api/shipment/resend-label/${id}`, payload)
      .then((response) => {
        dispatch({
          type: types.RESEND_SHIPMENT_LABEL.SUCCESS,
          payload: response?.data,
        });

        toast.success('Order label successfully resent!');
      })
      .catch((error) => {
        dispatch({
          type: types.RESEND_SHIPMENT_LABEL.FAILED,
          payload: error,
        });

        toast.error('Failed to resend order label.');
      });
  };

export const resendOrderItemShipmentLabel =
  (orderId: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.RESEND_ITEM_SHIPMENT_LABEL.baseType,
      orderId,
    });

    axiosInstance(token)
      .post(`/api/orders/${orderId}/resend-label`)
      .then((response) => {
        dispatch({
          type: types.RESEND_ITEM_SHIPMENT_LABEL.SUCCESS,
          payload: response?.data,
        });

        toast.success('Order label successfully resent!');
      })
      .catch((error) => {
        dispatch({
          type: types.RESEND_ITEM_SHIPMENT_LABEL.FAILED,
          payload: error,
        });

        toast.error('Failed to resend order label.');
      });
  };

export const updateOrderItemById =
  (orderItemId: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_ITEM_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/status`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        getOrderShipments(orderId)(dispatch, token);
        setToggleModal(false)(dispatch);
        toast.success('Order item status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_BY_ID.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const receiveOrderItemById =
  (orderItemId: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.RECEIVE_ORDER_ITEM_BY_ID.baseType,
      orderItemId,
    });

    axiosInstance(token)
      .patch(`/api/orders/receive/${orderItemId}`, payload)
      .then((response) => {
        dispatch({
          type: types.RECEIVE_ORDER_ITEM_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        getOrderShipments(orderId)(dispatch, token);
        toast.success('Order item successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.RECEIVE_ORDER_ITEM_BY_ID.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const evaluateOrderItemById =
  (orderItemId: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.EVALUATE_ORDER_ITEM_BY_ID.baseType,
      orderItemId,
    });

    axiosInstance(token)
      .post(`/api/orders/${orderItemId}/evaluate`, payload)
      .then((response) => {
        dispatch({
          type: types.EVALUATE_ORDER_ITEM_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        getOrderShipments(orderId)(dispatch, token);
        setToggleModal(false)(dispatch);
        toast.success('Order item successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.EVALUATE_ORDER_ITEM_BY_ID.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const reviseOfferByItemId =
  (orderItemNumber: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.REVISE_OFFER_BY_ITEM_ID.baseType,
      orderItemNumber,
    });

    axiosInstance(token)
      .post(`/api/orders/${orderItemNumber}/revise-offer`, payload)
      .then((response) => {
        dispatch({
          type: types.REVISE_OFFER_BY_ITEM_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        getOrderShipments(orderId)(dispatch, token);
        setToggleModal(false)(dispatch);
        toast.success('Order item successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.REVISE_OFFER_BY_ITEM_ID.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const cancelOrderItemById =
  (orderItemId: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.CANCEL_ORDER_ITEM_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/status`, payload)
      .then((response) => {
        dispatch({
          type: types.CANCEL_ORDER_ITEM_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        getOrderShipments(orderId)(dispatch, token);
        setToggleModal(false)(dispatch);
        toast.success('Order item status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.CANCEL_ORDER_ITEM_BY_ID.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const updateShipmentStatus =
  (shipmentId: string, orderId: string, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_SHIPPING_STATUS_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/shipments/status/${shipmentId}`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_SHIPPING_STATUS_BY_ID.SUCCESS,
          payload: response?.data,
        });
        getOrderShipments(orderId)(dispatch, token);
        toast.success('Shipment status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_SHIPPING_STATUS_BY_ID.FAILED,
          payload: error,
        });
      });
  };

export const updateSendinDeadline =
  (orderId: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_SENDIN_DEADLINE.baseType,
      payload,
    });

    axiosInstance(token)
      .patch('/api/orders/items/sendin-deadline', payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_SENDIN_DEADLINE.SUCCESS,
          payload: response?.data,
        });
        getOrderById(orderId)(dispatch, token);
        toast.success('Send-in Deadline extended!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_SENDIN_DEADLINE.FAILED,
          payload: error,
        });
      });
  };

export const bulkCancelOrderItems =
  (orderId: any, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.BULK_CANCEL_ORDER_ITEMS.baseType,
      payload,
    });

    axiosInstance(token)
      .patch('/api/orders/items/cancel-bulk', payload)
      .then((response) => {
        dispatch({
          type: types.BULK_CANCEL_ORDER_ITEMS.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Order items successfully cancelled!');
      })
      .catch((error) => {
        dispatch({
          type: types.BULK_CANCEL_ORDER_ITEMS.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const getOrderFollowups =
  (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_FOLLOWUP.baseType,
      payload,
    });

    axiosInstance(token)
      .get('/api/orders/follow-up', { params: payload, signal: signal })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_FOLLOWUP.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_FOLLOWUP.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_FOLLOWUP.FAILED,
            payload: error,
          });
        }
      });
  };

export const updateOrderFollowups =
  (orderId: any, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_FOLLOWUP.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/orders/follow-up', payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_FOLLOWUP.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Order items successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_FOLLOWUP.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item status.');
      });
  };

export const updateOrderItemLockType =
  (orderItemId: any, orderId: any, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_ITEM_LOCK_TYPE.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(
        `/api/orders/items/lock-devices/${orderItemId}/lock-status`,
        payload,
      )
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_LOCK_TYPE.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Order items lock type successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_LOCK_TYPE.FAILED,
          payload: error,
        });

        toast.error('Failed to update order item lock type.');
      });
  };

export const logCustomerNonContact =
  (orderId: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.LOG_CUSTOMER_NONCONTACT.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/${orderId}/non-contact`, payload)
      .then((response) => {
        dispatch({
          type: types.LOG_CUSTOMER_NONCONTACT.SUCCESS,
          payload: response?.data,
        });
        getOrderById(orderId)(dispatch, token);
        toast.success('Customer contact logged!');
      })
      .catch((error) => {
        dispatch({
          type: types.LOG_CUSTOMER_NONCONTACT.FAILED,
          payload: error,
        });
      });
  };

export const updateDeviceInventoryStatus =
  (orderItemId: any, payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_INVENTORY_STATUS.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/inventory-status`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_INVENTORY_STATUS.SUCCESS,
          payload: response?.data,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.success('Device inventory status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_INVENTORY_STATUS.FAILED,
          payload: error,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.error('Failed to update device inventory status.');
      });
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

export const generateLabels =
  (payload: any, onSuccess: any = false) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.GENERATE_LABELS.baseType,
      payload,
    });

    axiosInstance(token)
      .post(
        '/api/shipments/generate-labels?label=return,outbound&update_status=true',
        payload,
      )
      .then((response) => {
        dispatch({
          type: types.GENERATE_LABELS.SUCCESS,
          payload: response?.data,
        });

        const { data = {} } = response?.data || {};
        if (data?.return?.label) {
          window.open(data?.return?.label, '_blank');
        }
        if (data?.outbound?.label) {
          window.open(data?.outbound?.label, '_blank');
        }

        if (onSuccess && typeof onSuccess == 'function') {
          onSuccess(data);
        }
      })
      .catch((error) => {
        dispatch({
          type: types.GENERATE_LABELS.FAILED,
          payload: error,
        });

        toast.error('Failed to generate labels.');
      });
  };

export const generateOutboundLabel =
  (payload: any, onSuccess: any = false) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.GENERATE_LABELS.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/shipments/generate-labels?label=outbound', payload)
      .then((response) => {
        dispatch({
          type: types.GENERATE_OUTBOUND_LABEL.SUCCESS,
          payload: response?.data,
        });

        const { data = {} } = response?.data || {};
        if (data?.outbound?.label) {
          window.open(data?.outbound?.label, '_blank');
        }

        if (onSuccess && typeof onSuccess == 'function') {
          onSuccess(data);
        }
      })
      .catch((error) => {
        dispatch({
          type: types.GENERATE_OUTBOUND_LABEL.FAILED,
          payload: error,
        });

        toast.error('Failed to generate labels.');
      });
  };

export const updateOrderItemImeiSerial =
  (orderItemId: string, orderId: string, payload: any) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_ITEM_IMEI_SERIAL.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/imei`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_IMEI_SERIAL.SUCCESS,
          payload: response,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('IMEI/Serial successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_IMEI_SERIAL.FAILED,
          payload: error,
        });

        toast.error('Failed to update IMEI/Serial.');
      });
  };

export const getGiftCardStatus =
  (orderId: any, payload: any, signal?: AbortSignal) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_GIFT_CARD_STATUS.baseType,
    });

    axiosInstance(token)
      .post(
        `/api/payments/refresh-voucher/${orderId}?voucherOrderNumber=${payload?.voucherOrderNumber}`,
      )
      .then((response) => {
        dispatch({
          type: types.FETCH_GIFT_CARD_STATUS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: types.FETCH_GIFT_CARD_STATUS.FAILED,
          payload: error,
        });

        toast.error('Failed to check gift card status.');
      });
  };

export const cancelGiftCard =
  (orderId: any, voucherPan: any, signal?: AbortSignal) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.CANCEL_GIFT_CARD.baseType,
    });

    axiosInstance(token)
      .patch(
        `/api/payments/cancel-voucher-by-query/${orderId}?voucherPan=${voucherPan}`,
        { signal: signal },
      )
      .then((response) => {
        dispatch({
          type: types.CANCEL_GIFT_CARD.SUCCESS,
          payload: response?.data,
        });
        getOrderById(orderId)(dispatch, token);
        toast.success('Gift card successfully cancelled!');
      })
      .catch((error) => {
        dispatch({
          type: types.CANCEL_GIFT_CARD.FAILED,
          payload: error,
        });

        toast.error('Failed to check gift card status.');
      });
  };

export const updateOrderItemsStatus =
  (orderItemId: any, payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_ITEM_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/status`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_BY_ID.SUCCESS,
          payload: response?.data,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.success('Order item status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_BY_ID.FAILED,
          payload: error,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.error('Failed to update Order item status!');
      });
  };

export const getAllOrderPayments =
  (platform: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_PAYMENTS.baseType,
      platform,
    });

    axiosInstance(token)
      .get(`/api/orders/flat-file-data?platform=${platform}`, {
        signal: signal,
      })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_PAYMENTS.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_PAYMENTS.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_PAYMENTS.FAILED,
            payload: error,
          });
        }
      });
  };

export const getOrderPaymentById =
  (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_ORDER_PAYMENT_BY_ID.baseType,
      payload,
    });

    axiosInstance(token)
      .get(`/api/orders/flat-file-data/${payload}`, { signal: signal })
      .then((response) => {
        dispatch({
          type: types.FETCH_ORDER_PAYMENT_BY_ID.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_ORDER_PAYMENT_BY_ID.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_ORDER_PAYMENT_BY_ID.FAILED,
            payload: error,
          });
        }
      });
  };

export const downloadOrderPaymentFile =
  (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.DOWNLOAD_ORDER_PAYMENT_FILE.baseType,
      payload,
    });

    axiosInstance(token)
      .get('/api/orders/download-flat-file', {
        signal: signal,
        params: payload,
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);

        // let filename:string = response.headers['Content-Disposition'].split('=')[1];

        const link = document.createElement('a');
        link.href = url;
        link.download = 'flat-file.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
          type: types.DOWNLOAD_ORDER_PAYMENT_FILE.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.CANCELLED,
            payload: error,
          });
        } else if (error.code === BAD_REQUEST) {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.FAILED,
            payload: error,
          });

          toast.error(
            'No data available for the selected date; no file generated for export. Please choose another date.',
          );
        } else {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.FAILED,
            payload: error,
          });

          toast.error('Failed to download file.');
        }
      });
  };

export const downloadOrderPaymentFileRange =
  (payload: any, signal?: AbortSignal) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.DOWNLOAD_ORDER_PAYMENT_FILE_RANGE.baseType,
      payload,
    });

    axiosInstance(token)
      .get('/api/orders/download-flat-file-date-range', {
        signal: signal,
        params: payload,
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);

        // let filename:string = response.headers['Content-Disposition'].split('=')[1];

        const link = document.createElement('a');
        link.href = url;
        link.download = 'flat-file.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch({
          type: types.DOWNLOAD_ORDER_PAYMENT_FILE.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.CANCELLED,
            payload: error,
          });
        } else if (error.code === BAD_REQUEST) {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.FAILED,
            payload: error,
          });

          toast.error(
            'No data available for the selected date; no file generated for export. Please choose another date.',
          );
        } else {
          dispatch({
            type: types.DOWNLOAD_ORDER_PAYMENT_FILE.FAILED,
            payload: error,
          });

          toast.error('Failed to download file.');
        }
      });
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

export const addOrderNote =
  (orderId: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.ADD_ORDER_NOTE.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/orders/notes', payload)
      .then((response) => {
        dispatch({
          type: types.ADD_ORDER_NOTE.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Note added successfully!');
      })
      .catch((error) => {
        dispatch({
          type: types.ADD_ORDER_NOTE.FAILED,
          payload: error,
        });

        getOrderById(orderId)(dispatch, token);
        toast.error('Failed to add note.');
      });
  };

export const upsertZendeskLink =
  (orderId: string, payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPSERT_ZENDESK_LINK.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/${orderId}/insert-zendesk-link`, payload)
      .then((response) => {
        dispatch({
          type: types.UPSERT_ZENDESK_LINK.SUCCESS,
          payload: response?.data,
        });

        getOrderById(orderId)(dispatch, token);
        toast.success('Successfully saved zendesk link!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPSERT_ZENDESK_LINK.FAILED,
          payload: error,
        });

        getOrderById(orderId)(dispatch, token);
        toast.error('Failed to save zendesk link.');
      });
  };

export const importPaymentsFlatFile =
  (file: File, userId: string, activePlatform: string) =>
  async (dispatch: any, token?: string) => {
    dispatch({
      type: types.IMPORT_PAYMENTS_FLAT_FILE.baseType,
      payload: {},
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('platform', activePlatform);

    axiosInstance(token)
      .post('/api/payments/bulk-manual-payment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        dispatch({
          type: types.IMPORT_PAYMENTS_FLAT_FILE.SUCCESS,
          payload: {},
        });

        getAllOrderPayments(activePlatform)(dispatch, token);
        toast.success('Payments successfully updated!');
      })
      .catch((error) => {
        if (error.code === BAD_REQUEST) {
          dispatch({
            type: types.IMPORT_PAYMENTS_FLAT_FILE.BAD_REQUEST,
            payload: error?.response?.data?.data?.invalidEntries || [],
          });
        } else {
          dispatch({
            type: types.IMPORT_PAYMENTS_FLAT_FILE.FAILED,
            payload: error,
          });
        }

        getAllOrderPayments(activePlatform)(dispatch, token);
        toast.error('Failed to import flat file.');
      });
  };

export const clearUploadPaymentErrors = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_ORDER_PAYMENT_ERRORS,
    payload,
  });
};

export const getLockedDevices =
  (payload: any, platform: string, signal?: AbortSignal) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.FETCH_LOCKED_DEVICES.baseType,
      payload,
    });

    axiosInstance(token)
      .get(`/api/orders/items/lock-devices?platform=${platform}`, {
        params: payload,
        signal: signal,
      })
      .then((response) => {
        dispatch({
          type: types.FETCH_LOCKED_DEVICES.SUCCESS,
          payload: response?.data,
        });
      })
      .catch((error) => {
        if (error.code === CANCELLED_AXIOS) {
          dispatch({
            type: types.FETCH_LOCKED_DEVICES.CANCELLED,
            payload: error,
          });
        } else {
          dispatch({
            type: types.FETCH_LOCKED_DEVICES.FAILED,
            payload: error,
          });
        }
      });
  };

export const clearLockedDevices = (payload: any) => (dispatch: any) => {
  dispatch({
    type: types.CLEAR_LOCKED_DEVICES,
    payload,
  });
};

export const setLockedDeviceLockStatus =
  (orderItemId: string, payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.SET_LOCKED_DEVICE_LOCK_STATUS.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(
        `/api/orders/items/lock-devices/${orderItemId}/lock-status`,
        payload,
      )
      .then((response) => {
        dispatch({
          type: types.SET_LOCKED_DEVICE_LOCK_STATUS.SUCCESS,
          payload: response?.data,
        });

        getLockedDevices(filter, platform)(dispatch, token);
        toast.success('Successfully updated device lock status!');
      })
      .catch((error) => {
        dispatch({
          type: types.SET_LOCKED_DEVICE_LOCK_STATUS.FAILED,
          payload: error,
        });

        getLockedDevices(filter, platform)(dispatch, token);
        toast.error('Failed to update device lock status.');
      });
  };

export const setLockedDeviceStatus =
  (orderItemId: string, payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.SET_LOCKED_DEVICE_STATUS.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(
        `/api/orders/items/lock-devices/${orderItemId}/device-status`,
        payload,
      )
      .then((response) => {
        dispatch({
          type: types.SET_LOCKED_DEVICE_STATUS.SUCCESS,
          payload: response?.data,
        });

        getLockedDevices(filter, platform)(dispatch, token);
        toast.success('Successfully updated device status!');
      })
      .catch((error) => {
        dispatch({
          type: types.SET_LOCKED_DEVICE_STATUS.FAILED,
          payload: error,
        });

        getLockedDevices(filter, platform)(dispatch, token);
        toast.error('Failed to update device status.');
      });
  };

export const updateOrderItemsPaymentStatus =
  (orderItemId: any, payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.UPDATE_ORDER_ITEM_PAYMENT_STATUS.baseType,
      payload,
    });

    axiosInstance(token)
      .patch(`/api/orders/items/${orderItemId}/payment-status`, payload)
      .then((response) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_PAYMENT_STATUS.SUCCESS,
          payload: response?.data,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.success('Order item payment status successfully updated!');
      })
      .catch((error) => {
        dispatch({
          type: types.UPDATE_ORDER_ITEM_PAYMENT_STATUS.FAILED,
          payload: error,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.error('Failed to update order item payment status!');
      });
  };

export const requestOrderItemPayment =
  (payload: any, filter: any, platform: string) =>
  (dispatch: any, token?: string) => {
    dispatch({
      type: types.REQUEST_ORDER_ITEM_PAYMENT.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/stripe/capture-payment-intent', payload)
      .then((response) => {
        dispatch({
          type: types.REQUEST_ORDER_ITEM_PAYMENT.SUCCESS,
          payload: response?.data,
        });

        getOrderItems(filter, platform)(dispatch, token);
        toast.success('Order item payment successfully processed!');
      })
      .catch((error) => {
        dispatch({
          type: types.REQUEST_ORDER_ITEM_PAYMENT.FAILED,
          payload: error,
        });

        const errorMessage =
          'Something went wrong while processing your payment request.';
        const errorCode = error?.response?.data?.error?.code || 'unknown_error';

        switch (errorCode) {
          case StripeErrorCodes.PARAMETER_INVALID_INTEGER:
            toast.error(
              'There was an issue with the payment amount. Please try again, or contact support if the issue persists.',
            );
            break;
          case StripeErrorCodes.NOT_FOUND:
            toast.error(
              'We couldn’t find the order. Please try again, or contact support if the issue persists.',
            );
            break;
          case StripeErrorCodes.AMOUNT_TOO_LARGE:
            toast.error(
              'The payment could not be processed because the amount is higher than expected. Please try again, or contact support if the issue persists.',
            );
            break;
          case StripeErrorCodes.PAYMENT_INTENT_UNEXPECTED_STATE:
            toast.error(
              'The payment has already been processed or cancelled. Please refresh the page and check the order details again.',
            );
            break;
          case StripeErrorCodes.RESOURCE_MISSING:
            toast.error(
              'We couldn’t find the payment information. Please refresh the page and try again.',
            );
            break;
          default:
            toast.error(errorMessage);
            break;
        }

        getOrderItems(filter, platform)(dispatch, token);
      });
  };

export const resendEmail =
  (payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.RESEND_EMAIL.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/orders/resend-email/', payload)
      .then((response) => {
        dispatch({
          type: types.RESEND_EMAIL.SUCCESS,
          payload: response?.data,
        });

        toast.success('Email resent successfully.');
      })
      .catch((error) => {
        dispatch({
          type: types.RESEND_EMAIL.FAILED,
          payload: error,
        });

        toast.error('Failed to resend email. Try again later.');
      });
  };

export const resendEmailv2 =
  (payload: any) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.RESEND_EMAIL_V2.baseType,
      payload,
    });

    axiosInstance(token)
      .post('/api/orders/resend-email-v2/', payload)
      .then((response) => {
        dispatch({
          type: types.RESEND_EMAIL_V2.SUCCESS,
          payload: response?.data,
        });

        toast.success('Email resent successfully.');
      })
      .catch((error) => {
        dispatch({
          type: types.RESEND_EMAIL_V2.FAILED,
          payload: error,
        });

        toast.error('Failed to resend email. Try again later.');
      });
  };

export const requestGiftCardPayment =
  (payload: string[]) => (dispatch: any, token?: string) => {
    dispatch({
      type: types.REQUEST_GIFTCARD_PAYMENT.baseType,
      payload,
    });
    axiosInstance(token)
      .post('api/payments/send-voucher', payload)
      .then((response) => {
        dispatch({
          type: types.REQUEST_GIFTCARD_PAYMENT.SUCCESS,
          payload: response?.data,
        });
        toast.success('Giftcard request is already in process...');
      })
      .catch((error) => {
        dispatch({
          type: types.REQUEST_GIFTCARD_PAYMENT.FAILED,
          payload: error,
        });
        toast.error('Failed to request GiftCard Payment.');
      });
  };
