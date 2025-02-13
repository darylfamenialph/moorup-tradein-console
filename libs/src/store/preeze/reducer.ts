/* eslint-disable @typescript-eslint/no-explicit-any */
import * as types from './action-types';

const prezzeeState = {
  balance: {},
  isFetchingBalance: false,
};

const prezzeeReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.UPDATE_PREEZE_BALANCE.baseType: {
      return {
        ...state,
        isFetchingBalance: true,
      };
    }
    case types.UPDATE_PREEZE_BALANCE.SUCCESS: {
      return {
        ...state,
        isFetchingBalance: false,
      };
    }
    case types.UPDATE_PREEZE_BALANCE.FAILED: {
      return {
        ...state,
        isFetchingBalance: false,
      };
    }

    default:
      return state;
  }
};

export { prezzeeReducer, prezzeeState };
