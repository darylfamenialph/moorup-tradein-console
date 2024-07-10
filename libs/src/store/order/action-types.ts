import { createActionTypes } from '../../helpers';


// Base action types with success and failed
export const FETCH_ORDERS = createActionTypes('FETCH_ORDERS');
export const FETCH_ORDER_ITEMS = createActionTypes('FETCH_ORDER_ITEMS');
export const FETCH_ORDER_BY_ID = createActionTypes('FETCH_ORDER_BY_ID');
export const FETCH_ORDER_SHIPMENTS = createActionTypes('FETCH_ORDER_SHIPMENTS');
export const UPDATE_ORDER_BY_ID = createActionTypes('UPDATE_ORDER_BY_ID');
export const CANCEL_ORDER_BY_ID = createActionTypes('CANCEL_ORDER_BY_ID');
export const DELETE_ORDER_BY_ID = createActionTypes('DELETE_ORDER_BY_ID');
export const UPDATE_ORDER_ITEM_BY_ID = createActionTypes('UPDATE_ORDER_ITEM_BY_ID');
export const DELETE_ORDER_ITEM_BY_ID = createActionTypes('DELETE_ORDER_ITEM_BY_ID');
export const RESEND_SHIPMENT_LABEL = createActionTypes('RESEND_SHIPMENT_LABEL');
export const RESEND_ITEM_SHIPMENT_LABEL = createActionTypes('RESEND_ITEM_SHIPMENT_LABEL');
export const RECEIVE_ORDER_ITEM_BY_ID = createActionTypes('RECEIVE_ORDER_ITEM_BY_ID');
export const EVALUATE_ORDER_ITEM_BY_ID = createActionTypes('EVALUATE_ORDER_ITEM_BY_ID');
export const REVISE_OFFER_BY_ITEM_ID = createActionTypes('REVISE_OFFER_BY_ITEM_ID');
export const CANCEL_ORDER_ITEM_BY_ID = createActionTypes('CANCEL_ORDER_ITEM_BY_ID');
export const UPDATE_SHIPPING_STATUS_BY_ID = createActionTypes('UPDATE_SHIPPING_STATUS_BY_ID');
export const GENERATE_LABELS = createActionTypes('GENERATE_LABELS');
export const UPDATE_ORDER_ITEM_IMEI_SERIAL = createActionTypes('UPDATE_ORDER_ITEM_IMEI_SERIAL');
export const FETCH_GIFT_CARD_STATUS = createActionTypes('FETCH_GIFT_CARD_STATUS');
export const CANCEL_GIFT_CARD = createActionTypes('CANCEL_GIFT_CARD');
export const GENERATE_OUTBOUND_LABEL = createActionTypes('GENERATE_OUTBOUND_LABEL');
export const FETCH_ORDER_PAYMENTS = createActionTypes('FETCH_ORDER_PAYMENTS');
export const FETCH_ORDER_PAYMENT_BY_ID = createActionTypes('FETCH_ORDER_PAYMENT_BY_ID');
export const ADD_ORDER_NOTE = createActionTypes('ADD_ORDER_NOTE');
export const UPSERT_ZENDESK_LINK = createActionTypes('UPSERT_ZENDESK_LINK');
export const DOWNLOAD_ORDER_PAYMENT_FILE = createActionTypes('DOWNLOAD_ORDER_PAYMENT_FILE');

// Base action types
export const SET_ORDERS = 'SET_ORDERS';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const CLEAR_ORDERS = 'CLEAR_ORDERS';
export const CLEAR_ORDER_ITEMS = 'CLEAR_ORDER_ITEMS';
export const CLEAR_ORDER = 'CLEAR_ORDER';
export const CLEAR_ORDER_PAYMENT_ITEMS = 'CLEAR_ORDER_PAYMENT_ITEMS';

export const SET_TOGGLE_FLOATING_SECTION = 'SET_TOGGLE_FLOATING_SECTION';
export const SET_TOGGLE_MODAL = 'SET_TOGGLE_MODAL';
export const SET_ACTIVE_ORDER_ITEM = 'SET_ACTIVE_ORDER_ITEM';
