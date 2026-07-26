import { authConstants } from "../constants/authConstants";

let savedUser = null;
try {
  const item = localStorage.getItem("admin_user");
  savedUser = item ? JSON.parse(item) : null;
} catch {
  savedUser = null;
}

const initialState = {
  loading: false,
  user: savedUser,
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