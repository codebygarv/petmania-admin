import { authConstants } from "../constants/authConstants";

const savedUser = localStorage.getItem("admin_user");
const initialState = {
  loading: false,
  user: savedUser ? JSON.parse(savedUser) : null,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authConstants.ADMIN_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case authConstants.ADMIN_LOGIN_ACCEPT:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    case authConstants.ADMIN_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case authConstants.ADMIN_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case authConstants.ADMIN_REGISTER_ACCEPT:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    case authConstants.ADMIN_REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };

    case authConstants.ADMIN_LOGOUT:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};