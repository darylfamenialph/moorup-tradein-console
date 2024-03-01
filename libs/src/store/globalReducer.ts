/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer } from 'react';
import { authReducer, authState } from './auth';
import { commonReducer, commonState } from './common';
import { orderReducer, orderState } from './order';
import { productReducer, productState } from './product';
import { promotionReducer, promotionState } from './promotion';
import { userReducer, userState } from './user';

const rootReducer = (state: any, action: any) => {
  return {
    auth: authReducer(state.auth, action),
    user: userReducer(state.user, action),
    product: productReducer(state.product, action),
    promotion: promotionReducer(state.promotion, action),
    common: commonReducer(state.common, action),
    order: orderReducer(state.order, action),
  };
};

const initialState = {
  auth: authState,
  user: userState,
  product: productState,
  promotion: promotionState,
  common: commonState,
  order: orderState,
};

export const useAppReducer = () => useReducer(rootReducer, initialState);
