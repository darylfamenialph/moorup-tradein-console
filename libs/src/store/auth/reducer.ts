/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY,
  ACTIVE_PLATFORM,
  IS_VERIFIED,
} from '../../constants';
import { decodeJWT } from '../../helpers';
import * as types from './action-types';

const authState = {
  token: localStorage.getItem('FTK') || null,
  expiry: localStorage.getItem('FTKX') || null,
  isAuthenticating: false,
  authenticationError: null,
  isLoggingOut: false,
  userDetails: {},
  isFetchingUserDetails: false,
  platformConfig: {},
  isFetchingPlatformConfig: false,
  activePlatform: localStorage.getItem(ACTIVE_PLATFORM) || null,
  isPageLoading: true,
  isUpdatingPlatformConfig: false,
  isSendingVerificationCode: false,
  sendVerificationCodeStatus: '',
  isLoginSuccess: false,
  forVerification: false,
  isVerified: Boolean(localStorage.getItem('VOTP')) || false,
  isVerifyingCode: false,
  verificationCodeError: null,
};

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case types.LOGIN_USER.baseType: {
      return {
        ...state,
        isAuthenticating: true,
        token: null,
        authenticationError: null,
      };
    }
    case types.LOGIN_USER.SUCCESS: {
      const accessToken = action.payload?.data?.access_token?.token;
      const decodedToken = decodeJWT(accessToken);

      return {
        ...state,
        isAuthenticating: false,
        token: accessToken,
        expiry: decodedToken?.exp.toString(),
        authenticationError: null,
        isLoginSuccess: true,
        forVerification: true,
      };
    }
    case types.LOGIN_USER.FAILED: {
      return {
        ...state,
        isAuthenticating: false,
        token: null,
        expiry: null,
        authenticationError: 'Invalid username or password. Please try again.',
        isLoginSuccess: false,
      };
    }

    case types.LOGOUT_USER.baseType: {
      return {
        ...state,
        isLoggingOut: true,
      };
    }
    case types.LOGOUT_USER.SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        token: null,
        expiry: null,
        userDetails: null,
        isVerified: false,
        forVerification: false,
      };
    }
    case types.LOGOUT_USER.FAILED: {
      return {
        ...state,
        isLoggingOut: false,
      };
    }

    case types.GET_USER_DETAILS.baseType: {
      return {
        ...state,
        isFetchingUserDetails: true,
        userDetails: {},
      };
    }
    case types.GET_USER_DETAILS.SUCCESS: {
      const platforms = action.payload?.data?.platforms;

      if (isEmpty(localStorage.getItem(ACTIVE_PLATFORM))) {
        localStorage.setItem(ACTIVE_PLATFORM, platforms?.sort()[0] || '');
      }

      return {
        ...state,
        isFetchingUserDetails: false,
        userDetails: action.payload.data,
        activePlatform:
          localStorage.getItem(ACTIVE_PLATFORM) || platforms?.sort()[0] || '',
      };
    }
    case types.GET_USER_DETAILS.FAILED: {
      return {
        ...state,
        isFetchingUserDetails: false,
        userDetails: {},
      };
    }

    case types.GET_PLATFORM_CONFIG.baseType: {
      return {
        ...state,
        isFetchingPlatformConfig: true,
        platformConfig: {},
      };
    }
    case types.GET_PLATFORM_CONFIG.SUCCESS: {
      return {
        ...state,
        isFetchingPlatformConfig: false,
        platformConfig: action.payload?.data[0] || {},
      };
    }
    case types.GET_PLATFORM_CONFIG.FAILED: {
      return {
        ...state,
        isFetchingPlatformConfig: false,
        platformConfig: {},
      };
    }
    case types.GET_PLATFORM_CONFIG.CANCELLED: {
      return {
        ...state,
        isFetchingPlatformConfig: true,
        platformConfig: {},
      };
    }

    case types.SET_ACTIVE_PLATFORM:
      return {
        ...state,
        activePlatform: action.payload,
      };

    case types.SET_LOADING:
      return {
        ...state,
        isPageLoading: action.payload,
      };

    case types.CLEAR_PLATFORM_CONFIG:
      return {
        ...state,
        isFetchingPlatformConfig: true,
        platformConfig: action.payload,
      };

    case types.UPDATE_PLATFORM_CONFIG.baseType: {
      return {
        ...state,
        isUpdatingPlatformConfig: true,
      };
    }
    case types.UPDATE_PLATFORM_CONFIG.SUCCESS: {
      return {
        ...state,
        isUpdatingPlatformConfig: false,
        platformConfig: {},
        isFetchingPlatformConfig: true,
      };
    }
    case types.UPDATE_PLATFORM_CONFIG.FAILED: {
      return {
        ...state,
        isUpdatingPlatformConfig: false,
        platformConfig: {},
        isFetchingPlatformConfig: false,
      };
    }

    case types.SEND_VERIFICATION_CODE.baseType: {
      return {
        ...state,
        isSendingVerificationCode: true,
      };
    }
    case types.SEND_VERIFICATION_CODE.SUCCESS: {
      return {
        ...state,
        isSendingVerificationCode: false,
        sendVerificationCodeStatus: action.payload,
      };
    }
    case types.SEND_VERIFICATION_CODE.FAILED: {
      return {
        ...state,
        isSendingVerificationCode: false,
        sendVerificationCodeStatus: action.payload,
      };
    }

    case types.VERIFY_CODE.baseType: {
      return {
        ...state,
        isVerifyingCode: true,
      };
    }
    case types.VERIFY_CODE.SUCCESS: {
      const accessToken = state.token;
      const decodedToken = decodeJWT(accessToken);

      if (decodedToken) {
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(ACCESS_TOKEN_EXPIRY, decodedToken.exp.toString());
        localStorage.setItem(IS_VERIFIED, 'true');
      }

      return {
        ...state,
        isVerifyingCode: false,
        isVerified: action.payload.result?.state,
        verificationCodeError:
          !action.payload.result?.state &&
          'Invalid verification code. Please try again.',
      };
    }
    case types.VERIFY_CODE.FAILED: {
      return {
        ...state,
        isVerifyingCode: false,
        isVerified: false,
        verificationCodeError: 'Invalid verification code. Please try again.',
      };
    }

    default:
      return state;
  }
};

export { authReducer, authState };
