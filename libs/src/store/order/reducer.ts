/* eslint-disable @typescript-eslint/no-explicit-any */
import * as types from './action-types';

const orderState = {
  orders: [],
  isFetchingOrders: true,
  isAddingOrder: false,
  order: {},
  isFetchingOrder: true,
  isUpdatingOrder: false,
  isDeletingOrder: false,
  orderItem: [],
  isFetchingOrderItem: true,
  isUpdatingOrderItem: false,
  orderItems: [],
  activeOrderItem: {},
  isFetchingOrderItems: true,
  shipments: [],
  isFetchingShipments: true,
  orderStatuses: [],
  isFetchingOrderStatuses: false,
  generatedLabels: {},
  isResendingLabel: false,
  isGeneratingLabels: false,
  isUpdatingImeiSerial: false,
  giftCard: {},
  isFetchingGiftCard: false,
  isUpdatingGiftCard: false,
  isModalOpen: false,
  paymentsItem: [],
  isFetchingPayments: false,
  isAddingOrderNote: false,
  isSavingZendeskLink: false,
};

const orderReducer = (state = orderState, action: any) => {
  switch (action.type) {
    case types.FETCH_ORDERS.baseType: {
      return {
        ...state,
        isFetchingOrders: true,
        orders: [],
      };
    }
    case types.FETCH_ORDERS.SUCCESS: {
      return {
        ...state,
        isFetchingOrders: false,
        orders: action.payload?.data,
      };
    }
    case types.FETCH_ORDERS.FAILED: {
      return {
        ...state,
        isFetchingOrders: false,
        orders: [],
      };
    }
    case types.FETCH_ORDERS.CANCELLED: {
      return {
        ...state,
        isFetchingOrders: true,
        orders: [],
      };
    }

    case types.FETCH_ORDER_BY_ID.baseType: {
      return {
        ...state,
        isFetchingOrder: true,
        order: {},
      };
    }
    case types.FETCH_ORDER_BY_ID.SUCCESS: {
      return {
        ...state,
        isFetchingOrder: false,
        order: action.payload?.data,
      };
    }
    case types.FETCH_ORDER_BY_ID.FAILED: {
      return {
        ...state,
        isFetchingOrder: false,
        order: {},
      };
    }
    case types.FETCH_ORDER_BY_ID.CANCELLED: {
      return {
        ...state,
        isFetchingOrder: true,
        order: {},
      };
    }

    case types.UPDATE_ORDER_BY_ID.baseType:
    case types.CANCEL_ORDER_BY_ID.baseType: {
      return {
        ...state,
        isUpdatingOrder: true,
        order: {},
      };
    }
    case types.UPDATE_ORDER_BY_ID.SUCCESS:
    case types.CANCEL_ORDER_BY_ID.SUCCESS: {
      return {
        ...state,
        isUpdatingOrder: false,
        order: action.payload?.data,
      };
    }
    case types.UPDATE_ORDER_BY_ID.FAILED:
    case types.CANCEL_ORDER_BY_ID.FAILED: {
      return {
        ...state,
        isUpdatingOrder: false,
        order: {},
      };
    }
    case types.FETCH_ORDER_ITEMS.baseType: {
      return {
        ...state,
        isFetchingOrderItems: true,
        orderItems: [],
      };
    }
    case types.FETCH_ORDER_ITEMS.SUCCESS: {
      return {
        ...state,
        isFetchingOrderItems: false,
        orderItems: action.payload?.data,
      };
    }
    case types.FETCH_ORDER_ITEMS.FAILED: {
      return {
        ...state,
        isFetchingOrderItems: false,
        orderItems: [],
      };
    }
    case types.FETCH_ORDER_ITEMS.CANCELLED: {
      return {
        ...state,
        isFetchingOrderItems: true,
        orderItems: [],
      };
    }

    case types.UPDATE_ORDER_ITEM_BY_ID.baseType: {
      return {
        ...state,
        isUpdatingOrderItem: true,
      };
    }
    case types.UPDATE_ORDER_ITEM_BY_ID.SUCCESS: {
      return {
        ...state,
        isUpdatingOrderItem: false,
        order: action.payload,
      };
    }
    case types.UPDATE_ORDER_ITEM_BY_ID.FAILED: {
      return {
        ...state,
        isUpdatingOrderItem: false,
        order: {},
      };
    }

    case types.DELETE_ORDER_BY_ID.baseType: {
      return {
        ...state,
        isDeletingOrder: true,
        orders: [],
      };
    }
    case types.DELETE_ORDER_BY_ID.SUCCESS: {
      return {
        ...state,
        isDeletingOrder: false,
        orders: action.payload,
      };
    }
    case types.DELETE_ORDER_BY_ID.FAILED: {
      return {
        ...state,
        isDeletingOrder: false,
        orders: [],
      };
    }

    case types.FETCH_ORDER_SHIPMENTS.baseType: {
      return {
        ...state,
        isFetchingShipments: true,
        shipments: [],
      };
    }
    case types.FETCH_ORDER_SHIPMENTS.SUCCESS: {
      return {
        ...state,
        isFetchingShipments: false,
        shipments: action.payload?.data,
      };
    }
    case types.FETCH_ORDER_SHIPMENTS.FAILED: {
      return {
        ...state,
        isFetchingShipments: false,
        shipments: [],
      };
    }
    case types.FETCH_ORDER_SHIPMENTS.CANCELLED: {
      return {
        ...state,
        isFetchingShipments: true,
        shipments: [],
      };
    }

    case types.RESEND_SHIPMENT_LABEL.baseType: {
      return {
        ...state,
        isResendingLabel: true,
      };
    }
    case types.RESEND_SHIPMENT_LABEL.SUCCESS:
    case types.RESEND_SHIPMENT_LABEL.FAILED: {
      return {
        ...state,
        isResendingLabel: false,
      };
    }

    case types.RESEND_ITEM_SHIPMENT_LABEL.baseType: {
      return {
        ...state,
        isResendingLabel: true,
      };
    }
    case types.RESEND_ITEM_SHIPMENT_LABEL.SUCCESS:
    case types.RESEND_ITEM_SHIPMENT_LABEL.FAILED: {
      return {
        ...state,
        isResendingLabel: false,
      };
    }

    case types.UPDATE_SHIPPING_STATUS_BY_ID.baseType:
    case types.CANCEL_ORDER_ITEM_BY_ID.baseType:
    case types.RECEIVE_ORDER_ITEM_BY_ID.baseType: {
      return {
        ...state,
        isUpdatingOrderItem: true,
      };
    }
    case types.UPDATE_SHIPPING_STATUS_BY_ID.SUCCESS:
    case types.CANCEL_ORDER_ITEM_BY_ID.SUCCESS:
    case types.RECEIVE_ORDER_ITEM_BY_ID.SUCCESS: {
      return {
        ...state,
        isUpdatingOrderItem: false,
      };
    }
    case types.UPDATE_SHIPPING_STATUS_BY_ID.FAILED:
    case types.CANCEL_ORDER_ITEM_BY_ID.FAILED:
    case types.RECEIVE_ORDER_ITEM_BY_ID.FAILED: {
      return {
        ...state,
        isUpdatingOrderItem: false,
      };
    }

    case types.EVALUATE_ORDER_ITEM_BY_ID.baseType: {
      return {
        ...state,
        isUpdatingOrderItem: true,
      };
    }
    case types.EVALUATE_ORDER_ITEM_BY_ID.SUCCESS: {
      return {
        ...state,
        isUpdatingOrderItem: false,
      };
    }
    case types.EVALUATE_ORDER_ITEM_BY_ID.FAILED: {
      return {
        ...state,
        isUpdatingOrderItem: false,
      };
    }

    case types.FETCH_GIFT_CARD_STATUS.baseType: {
      return {
        ...state,
        isFetchingGiftCard: true,
      };
    }
    case types.FETCH_GIFT_CARD_STATUS.SUCCESS: {
      return {
        ...state,
        isFetchingGiftCard: false,
        giftCard: action.payload?.data?.response,
      };
    }
    case types.FETCH_GIFT_CARD_STATUS.FAILED: {
      return {
        ...state,
        isFetchingGiftCard: false,
        giftCard: {},
      };
    }

    case types.UPDATE_ORDER_SENDIN_DEADLINE.baseType: {
      return {
        ...state,
        isUpdatingSendinDeadline: true,
      };
    }
    case types.UPDATE_ORDER_SENDIN_DEADLINE.SUCCESS: {
      return {
        ...state,
        isUpdatingSendinDeadline: false,
      };
    }
    case types.UPDATE_ORDER_SENDIN_DEADLINE.FAILED: {
      return {
        ...state,
        isUpdatingSendinDeadline: false,
      };
    }

    case types.LOG_CUSTOMER_NONCONTACT.baseType: {
      return {
        ...state,
        isUpdatingContactLogs: true,
      };
    }
    case types.LOG_CUSTOMER_NONCONTACT.SUCCESS: {
      return {
        ...state,
        isUpdatingContactLogs: false,
      };
    }
    case types.LOG_CUSTOMER_NONCONTACT.FAILED: {
      return {
        ...state,
        isUpdatingContactLogs: false,
      };
    }

    case types.CANCEL_GIFT_CARD.baseType: {
      return {
        ...state,
        isUpdatingGiftCard: true,
      };
    }
    case types.CANCEL_GIFT_CARD.SUCCESS: {
      return {
        ...state,
        isUpdatingGiftCard: false,
      };
    }
    case types.CANCEL_GIFT_CARD.FAILED: {
      return {
        ...state,
        isUpdatingGiftCard: false,
      };
    }

    case types.CLEAR_ORDER_ITEMS: {
      return {
        ...state,
        isFetchingOrderItems: true,
        orderItems: [],
      };
    }

    case types.SET_TOGGLE_MODAL: {
      return {
        ...state,
        isModalOpen: action.payload,
      };
    }

    case types.SET_ACTIVE_ORDER_ITEM: {
      return {
        ...state,
        activeOrderItem: action.payload,
      };
    }

    case types.CLEAR_ORDERS: {
      return {
        ...state,
        orders: [],
        isFetchingOrder: true,
        isFetchingOrders: true,
        isFetchingOrderItem: true,
        isFetchingOrderItems: true,
        isFetchingShipments: true,
      };
    }

    case types.GENERATE_LABELS.baseType:
    case types.GENERATE_OUTBOUND_LABEL.baseType: {
      return {
        ...state,
        isGeneratingLabels: true,
        generatedLabels: {},
      };
    }
    case types.GENERATE_LABELS.SUCCESS:
    case types.GENERATE_OUTBOUND_LABEL.SUCCESS: {
      return {
        ...state,
        isGeneratingLabels: false,
        generatedLabels: action.payload,
      };
    }
    case types.GENERATE_LABELS.FAILED:
    case types.GENERATE_OUTBOUND_LABEL.FAILED: {
      return {
        ...state,
        isGeneratingLabels: false,
        generatedLabels: {},
      };
    }

    case types.UPDATE_ORDER_ITEM_IMEI_SERIAL.baseType: {
      return {
        ...state,
        isUpdatingImeiSerial: true,
      };
    }
    case types.UPDATE_ORDER_ITEM_IMEI_SERIAL.SUCCESS: {
      return {
        ...state,
        isUpdatingImeiSerial: false,
      };
    }
    case types.UPDATE_ORDER_ITEM_IMEI_SERIAL.FAILED: {
      return {
        ...state,
        isUpdatingImeiSerial: false,
      };
    }

    case types.CLEAR_ORDER: {
      return {
        ...state,
        isFetchingOrder: true,
        order: {},
        giftCard: {},
      };
    }

    case types.FETCH_ORDER_PAYMENTS.baseType: {
      return {
        ...state,
        isFetchingPayments: true,
        paymentsItem: [],
      };
    }
    case types.FETCH_ORDER_PAYMENTS.SUCCESS: {
      return {
        ...state,
        isFetchingPayments: false,
        paymentsItem: action.payload?.data,
      };
    }
    case types.FETCH_ORDER_PAYMENTS.FAILED: {
      return {
        ...state,
        isFetchingPayments: false,
        paymentsItem: [],
      };
    }
    case types.FETCH_ORDER_PAYMENTS.CANCELLED: {
      return {
        ...state,
        isFetchingPayments: true,
        paymentsItem: [],
      };
    }

    case types.FETCH_ORDER_PAYMENT_BY_ID.baseType: {
      return {
        ...state,
        isFetchingPayments: true,
        paymentsItem: {},
      };
    }
    case types.FETCH_ORDER_PAYMENT_BY_ID.SUCCESS: {
      return {
        ...state,
        isFetchingPayments: false,
        paymentsItem: action.payload?.data,
      };
    }
    case types.FETCH_ORDER_PAYMENT_BY_ID.FAILED: {
      return {
        ...state,
        isFetchingPayments: false,
        paymentsItem: {},
      };
    }
    case types.FETCH_ORDER_PAYMENT_BY_ID.CANCELLED: {
      return {
        ...state,
        isFetchingPayments: true,
        paymentsItem: {},
      };
    }

    case types.CLEAR_ORDER_PAYMENT_ITEMS: {
      return {
        ...state,
        isFetchingPayments: true,
        paymentsItem: [],
      };
    }

    case types.ADD_ORDER_NOTE.baseType: {
      return {
        ...state,
        isAddingOrderNote: true,
        isFetchingOrder: true,
        order: {},
      };
    }
    case types.ADD_ORDER_NOTE.SUCCESS: {
      return {
        ...state,
        isAddingOrderNote: false,
      };
    }
    case types.ADD_ORDER_NOTE.FAILED: {
      return {
        ...state,
        isAddingOrderNote: false,
      };
    }

    case types.UPSERT_ZENDESK_LINK.baseType: {
      return {
        ...state,
        isSavingZendeskLink: true,
        isFetchingOrder: true,
        order: {},
      };
    }
    case types.UPSERT_ZENDESK_LINK.SUCCESS: {
      return {
        ...state,
        isSavingZendeskLink: false,
      };
    }
    case types.UPSERT_ZENDESK_LINK.FAILED: {
      return {
        ...state,
        isSavingZendeskLink: false,
      };
    }

    default:
      return state;
  }
};

export { orderReducer, orderState };
