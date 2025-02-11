/* eslint-disable @typescript-eslint/no-explicit-any */
import * as types from './action-types';

const preezeState = {
  balance: {},
  isFetchingBalance: false,
};

const preezeReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.FETCH_PREEZE_BALANCE.baseType: {
      return {
        ...state,
        isFetchingBalance: true,
      };
    }
    case types.FETCH_PREEZE_BALANCE.SUCCESS: {
      return {
        ...state,
        isFetchingBalance: false,
      };
    }
    case types.FETCH_PREEZE_BALANCE.FAILED: {
      return {
        ...state,
        isFetchingBalance: false,
      };
    }

    default:
      return state;
  }
};

export { preezeReducer, preezeState };
