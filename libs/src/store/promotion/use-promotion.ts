/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
import { RootContext } from '../provider';
import * as actions from './actions';

export const usePromotion = () => {
  const { state, dispatch } = useContext(RootContext);
  const { activePlatform, token } = state.auth;

  const getPromotions = (payload: any, signal: AbortSignal) => {
    actions.getPromotions(payload, activePlatform, signal)(dispatch, token);
  };

  const clearPromotions = (payload: any) => {
    actions.clearPromotions(payload)(dispatch);
  };

  const createPromotion = (
    payload: any,
    cardImageFile?: File,
    bannerImageFile?: File,
  ) => {
    actions.createPromotion(
      payload,
      activePlatform,
      cardImageFile,
      bannerImageFile,
    )(dispatch, token);
  };

  const setAddPromotionDetailsPayload = (payload: any) => {
    actions.setAddPromotionDetailsPayload(payload)(dispatch);
  };

  const setAddPromotionClaimsPayload = (payload: any) => {
    actions.setAddPromotionClaimsPayload(payload)(dispatch);
  };

  const setAddPromotionStepsPayload = (payload: any) => {
    actions.setAddPromotionStepsPayload(payload)(dispatch);
  };

  const setAddPromotionConditionPayload = (payload: any) => {
    actions.setAddPromotionConditionPayload(payload)(dispatch);
  };

  const setAddPromotionEligibilityAndFaqsPayload = (payload: any) => {
    actions.setAddPromotionEligibilityAndFaqsPayload(payload)(dispatch);
  };

  const getPromotionClaims = (payload: any, signal?: AbortSignal) => {
    actions.getPromotionClaims(
      payload,
      activePlatform,
      signal,
    )(dispatch, token);
  };

  const clearPromotionClaims = (payload: any) => {
    actions.clearPromotionClaims(payload)(dispatch);
  };

  const getPromotionById = (payload: any, signal: AbortSignal) => {
    actions.getPromotionById(payload, signal)(dispatch, token);
  };

  const clearPromotion = (payload: any) => {
    actions.clearPromotion(payload)(dispatch);
  };

  const updatePromotion = (
    payload: any,
    promotionId: string,
    cardImageFile?: File,
    bannerImageFile?: File,
  ) => {
    actions.updatePromotion(
      payload,
      promotionId,
      activePlatform,
      cardImageFile,
      bannerImageFile,
    )(dispatch, token);
  };

  const updatePromotionClaimMoorupStatus = (
    payload: any,
    promotionId: string,
  ) => {
    actions.updatePromotionClaimMoorupStatus(
      payload,
      promotionId,
      activePlatform,
    )(dispatch, token);
  };

  const updatePromotionClaimStatus = (
    payload: any,
    promotionId: string,
    filter: any,
  ) => {
    actions.updatePromotionClaimStatus(
      payload,
      promotionId,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const submitOrderPromotionClaim = (payload: any, filter: any) => {
    actions.submitOrderPromotionClaim(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const processPromotionClaimPayment = (payload: any, filter: any) => {
    actions.processPromotionClaimPayment(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const setPromotionCardImage = (payload: File) => {
    actions.setPromotionCardImage(payload)(dispatch);
  };

  const setPromotionBannerImage = (payload: File) => {
    actions.setPromotionBannerImage(payload)(dispatch);
  };

  const setAddOrderPromotionClaimPayload = (payload: any) => {
    actions.setAddOrderPromotionClaimPayload(payload)(dispatch);
  };

  const bulkUpdatePromotionClaimStatus = (payload: any, filter: any) => {
    actions.bulkUpdatePromotionClaimStatus(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const bulkUpdatePromotionClaimMoorupStatus = (payload: any, filter: any) => {
    actions.bulkUpdatePromotionClaimMoorupStatus(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const bulkProcessPromotionClaimPayment = (payload: any, filter: any) => {
    actions.bulkProcessPromotionClaimPayment(
      payload,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const setResetForm = (payload: any) => {
    actions.setResetForm(payload)(dispatch);
  };

  const updatePromotionClaimReceiptNumber = (
    payload: any,
    promotionId: string,
    filter: any,
  ) => {
    actions.updatePromotionClaimReceiptNumber(
      payload,
      promotionId,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  const attachReceiptImage = (
    promotionId: string,
    filter: any,
    imageFile?: File,
  ) => {
    actions.attachReceiptImage(
      promotionId,
      filter,
      activePlatform,
      imageFile,
    )(dispatch, token);
  };

  const removeReceiptImage = (promotionId: string, filter: any) => {
    actions.removeReceiptImage(
      promotionId,
      filter,
      activePlatform,
    )(dispatch, token);
  };

  return {
    state: state.promotion,
    getPromotions,
    clearPromotions,
    createPromotion,
    setAddPromotionDetailsPayload,
    setAddPromotionClaimsPayload,
    setAddPromotionStepsPayload,
    setAddPromotionConditionPayload,
    setAddPromotionEligibilityAndFaqsPayload,
    getPromotionClaims,
    clearPromotionClaims,
    getPromotionById,
    clearPromotion,
    updatePromotion,
    updatePromotionClaimMoorupStatus,
    updatePromotionClaimStatus,
    processPromotionClaimPayment,
    setPromotionCardImage,
    setPromotionBannerImage,
    setAddOrderPromotionClaimPayload,
    submitOrderPromotionClaim,
    bulkUpdatePromotionClaimStatus,
    bulkUpdatePromotionClaimMoorupStatus,
    bulkProcessPromotionClaimPayment,
    setResetForm,
    updatePromotionClaimReceiptNumber,
    attachReceiptImage,
    removeReceiptImage,
  };
};
