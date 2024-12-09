/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer } from 'react';
import { authReducer, authState } from './auth';
import { commonReducer, commonState } from './common';
import { orderReducer, orderState } from './order';
import { productReducer, productState } from './product';
import { promotionReducer, promotionState } from './promotion';
import { templateReducer, templateState } from './templates';
import { userReducer, userState } from './user';
import { preezeReducer, preezeState } from './preeze';

const rootReducer = (state: any, action: any) => {
  return {
    auth: authReducer(state.auth, action),
    user: userReducer(state.user, action),
    product: productReducer(state.product, action),
    promotion: promotionReducer(state.promotion, action),
    order: orderReducer(state.order, action),
    common: commonReducer(state.common, action),
    template: templateReducer(state.template, action),
    preeze: preezeReducer(state.preeze, action),
  };
};

const initialState = {
  auth: authState,
  user: userState,
  product: productState,
  promotion: promotionState,
  order: orderState,
  common: commonState,
  template: templateState,
  preeze: preezeState,
};

export const useAppReducer = () => useReducer(rootReducer, initialState);
