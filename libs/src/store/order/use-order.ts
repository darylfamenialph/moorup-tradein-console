/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { OrderItemStatus } from '../../constants';
import { RootContext } from '../provider';
import * as actions from './actions';

export const useOrder = () => {
  const { state, dispatch } = useContext(RootContext);
  const { activePlatform, userDetails, token } = state.auth;

  const getOrderItems = (payload: any, signal?: AbortSignal) => {
    actions.getOrderItems(payload, activePlatform, signal)(dispatch, token);
  };

  const clearOrderItems = (payload: any) => {
    actions.clearOrderItems(payload)(dispatch);
  };

  const fetchOrders = (payload: any, signal?: AbortSignal) => {
    actions.getAllOrders(payload, activePlatform, signal)(
      dispatch,
      token,
      userDetails,
    );
  };

  const fetchOrderById = (id: any, signal?: AbortSignal) => {
    actions.getOrderById(id, signal)(dispatch, token);
  };

  const patchOrderById = async (id: any, payload: any) => {
    actions.updateOrderById(id, payload)(dispatch, token);
  };

  const fetchOrderFollowups = (payload: any, signal?: AbortSignal) => {
    actions.getOrderFollowups(payload, signal)(dispatch);
  };

  const updateOrderFollowups = async (id: any, payload: any) => {
    actions.updateOrderFollowups(id, payload)(dispatch, token);
  };

  const cancelOrderById = async (id: any) => {
    actions.cancelOrderById(id)(dispatch, token);
  };

  const patchOrderItemById = (id: any, payload: any) => {
    const orderId = state.order?.order?._id;
    actions.updateOrderItemById(id, orderId, payload)(dispatch, token);
  };

  const extendSendinDeadline = (id: any, payload: any) => {
    actions.updateSendinDeadline(id, payload)(dispatch, token);
  };

  const logCustomerNonContact = (id: any, payload: any) => {
    actions.logCustomerNonContact(id, payload)(dispatch, token);
  };

  const cancelOrderItemById = (id: any) => {
    const orderId = state.order?.order?._id;
    const payload = { status: OrderItemStatus.CANCELLED };
    actions.cancelOrderItemById(id, orderId, payload)(dispatch, token);
  };

  const bulkCancelOrderItems = (payload: any) => {
    const orderId = state.order?.order?._id;
    actions.bulkCancelOrderItems(orderId, payload)(dispatch, token);
  };

  const fetchOrderShipments = (id: any, signal?: AbortSignal) => {
    actions.getOrderShipments(id, signal)(dispatch, token);
  };

  const updateShipmentStatusById = (shipmentId: string, payload: any) => {
    const orderId = state.order?.order?._id;
    actions.updateShipmentStatus(shipmentId, orderId, payload)(dispatch, token);
  };

  const resendShipmentLabel = (id: any) => {
    const payload = {
      platform: activePlatform,
      orderFlow: state.order?.order?.order_flow,
    };
    actions.resendShipmentLabel(id, payload)(dispatch, token);
  };

  const resendOrderItemShipmentLabel = (id: any) => {
    actions.resendOrderItemShipmentLabel(id)(dispatch, token);
  };

  const receiveOrderItemById = (id: any, payload: any) => {
    const orderId = state.order?.order?._id;
    actions.receiveOrderItemById(id, orderId, payload)(dispatch, token);
  };

  const evaluateOrderItemById = (id: any, payload: any) => {
    const orderId = state.order?.order?._id;
    actions.evaluateOrderItemById(id, orderId, payload)(dispatch, token);
  };

  const reviseOfferByItemId = (id: any, payload: any) => {
    const orderId = state.order?.order?._id;
    actions.reviseOfferByItemId(id, orderId, payload)(dispatch, token);
  };

  const openModal = () => {
    actions.setToggleModal(true)(dispatch);
  };

  const closeModal = () => {
    actions.setToggleModal(false)(dispatch);
  };

  const setActiveOrderItem = (orderItem: any) => {
    actions.setActiveOrderItem(orderItem)(dispatch);
  };

  const setActiveOrder = (order: any) => {
    actions.setActiveOrder(order)(dispatch);
  };

  const clearOrders = () => {
    actions.clearOrders({})(dispatch);
  };

  const sendBox = (orderId: string, payload: any) => {
    const onSuccess = () => {
      toast.success('Successfully sent box');
      fetchOrderShipments(orderId);
    };
    actions.generateLabels(payload, onSuccess)(dispatch, token);
  };

  const printLabels = (payload: any) => {
    actions.generateLabels(payload)(dispatch, token);
  };

  const printOutboundLabel = (payload: any) => {
    actions.generateOutboundLabel(payload)(dispatch, token);
  };

  const updateOrderItemImeiSerial = (
    orderItemId: string,
    orderId: any,
    payload: any,
  ) => {
    actions.updateOrderItemImeiSerial(
      orderItemId,
      orderId,
      payload,
    )(dispatch, token);
  };

  const updateOrderItemLockType = (
    orderItemId: string,
    orderId: any,
    payload: any,
  ) => {
    actions.updateOrderItemLockType(
      orderItemId,
      orderId,
      payload,
    )(dispatch, token);
  };

  const getGiftCardStatus = (id: any, payload: any, signal?: AbortSignal) => {
    actions.getGiftCardStatus(id, payload, signal)(dispatch, token);
  };

  const updateOrderItemsStatus = (
    orderItemId: any,
    payload: any,
    filter: any,
  ) => {
    actions.updateOrderItemsStatus(
      orderItemId,
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const cancelGiftCard = (id: any, payload: any, signal?: AbortSignal) => {
    actions.cancelGiftCard(id, payload, signal)(dispatch, token);
  };

  const fetchOrderPayments = (signal?: AbortSignal) => {
    actions.getAllOrderPayments(activePlatform, signal)(dispatch, token);
  };

  const fetchOrderPaymentById = (id: any, signal?: AbortSignal) => {
    actions.getOrderById(id, signal)(dispatch, token);
  };

  const downloadOrderPaymentFile = (id: any, signal?: AbortSignal) => {
    actions.downloadOrderPaymentFile(id, signal)(dispatch, token);
  };

  const downloadOrderPaymentFileRange = (id: any, signal?: AbortSignal) => {
    actions.downloadOrderPaymentFileRange(id, signal)(dispatch, token);
  };

  const clearOrder = () => {
    actions.clearOrder({})(dispatch);
  };

  const addOrderNote = (orderId: string, payload: any) => {
    actions.addOrderNote(orderId, payload)(dispatch, token);
  };

  const upsertZendeskLink = (orderId: string, payload: any) => {
    actions.upsertZendeskLink(orderId, payload)(dispatch, token);
  };

  const importPaymentsFlatFile = (payload: any) => {
    actions.importPaymentsFlatFile(
      payload,
      userDetails._id,
      activePlatform,
    )(dispatch, token);
  };

  const clearUploadPaymentErrors = () => {
    actions.clearUploadPaymentErrors([])(dispatch);
  };

  const getLockedDevices = (payload: any, signal?: AbortSignal) => {
    actions.getLockedDevices(payload, activePlatform, signal)(dispatch, token);
  };

  const clearLockedDevices = (payload: any) => {
    actions.clearLockedDevices(payload)(dispatch);
  };

  const setLockedDeviceLockStatus = (
    orderItemId: string,
    payload: any,
    filter: any,
  ) => {
    actions.setLockedDeviceLockStatus(
      orderItemId,
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const setLockedDeviceStatus = (
    orderItemId: string,
    payload: any,
    filter: any,
  ) => {
    actions.setLockedDeviceStatus(
      orderItemId,
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const updateOrderItemsPaymentStatus = (
    orderItemId: any,
    payload: any,
    filter: any,
  ) => {
    actions.updateOrderItemsPaymentStatus(
      orderItemId,
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const requestOrderItemPayment = (payload: any, filter: any) => {
    actions.requestOrderItemPayment(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const updateDeviceInventoryStatus = (orderItemId: any, payload: any, filter: any) => {
    actions.updateDeviceInventoryStatus(orderItemId, payload, filter, activePlatform)(dispatch, token);
  };

  return {
    state: state.order,
    getOrderItems,
    clearOrderItems,
    fetchOrders,
    fetchOrderById,
    patchOrderById,
    cancelOrderById,
    patchOrderItemById,
    fetchOrderShipments,
    resendShipmentLabel,
    resendOrderItemShipmentLabel,
    receiveOrderItemById,
    evaluateOrderItemById,
    reviseOfferByItemId,
    cancelOrderItemById,
    updateShipmentStatusById,
    openModal,
    closeModal,
    setActiveOrderItem,
    setActiveOrder,
    clearOrders,
    sendBox,
    printLabels,
    printOutboundLabel,
    updateOrderItemImeiSerial,
    getGiftCardStatus,
    updateOrderItemsStatus,
    cancelGiftCard,
    clearOrder,
    fetchOrderPayments,
    fetchOrderPaymentById,
    addOrderNote,
    upsertZendeskLink,
    logCustomerNonContact,
    extendSendinDeadline,
    downloadOrderPaymentFile,
    downloadOrderPaymentFileRange,
    bulkCancelOrderItems,
    importPaymentsFlatFile,
    clearUploadPaymentErrors,
    fetchOrderFollowups,
    updateOrderFollowups,
    updateOrderItemLockType,
    getLockedDevices,
    clearLockedDevices,
    setLockedDeviceLockStatus,
    setLockedDeviceStatus,
    updateOrderItemsPaymentStatus,
    requestOrderItemPayment,
    updateDeviceInventoryStatus,
  };
};
