import { authConstants } from "../constants/authConstants";
import { adminAuthApi } from "../../api/adminService";

export const loginAction = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.ADMIN_LOGIN_REQUEST });

    try {
      const response = await adminAuthApi.login(credentials);

      if (response.success) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
        dispatch({
          type: authConstants.ADMIN_LOGIN_ACCEPT,
          payload: { user: response.data.admin },
        });
        return { success: true };
      } else {
        dispatch({
          type: authConstants.ADMIN_LOGIN_FAILURE,
          payload: { error: response.error?.message || "Login failed" },
        });
        return { error: response.error?.message || "Login failed" };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || "Login failed";
      dispatch({
        type: authConstants.ADMIN_LOGIN_FAILURE,
        payload: { error: errorMessage },
      });
      return { error: errorMessage };
    }
  };
};

export const registerAction = (userData) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.ADMIN_REGISTER_REQUEST });

    try {
      const response = await adminAuthApi.register(userData);

      if (response.success) {
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
        dispatch({
          type: authConstants.ADMIN_REGISTER_ACCEPT,
          payload: { user: response.data.admin },
        });
        return { success: true };
      } else {
        dispatch({
          type: authConstants.ADMIN_REGISTER_FAILURE,
          payload: { error: response.error?.message || "Registration failed" },
        });
        return { error: response.error?.message || "Registration failed" };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || error.message || "Registration failed";
      dispatch({
        type: authConstants.ADMIN_REGISTER_FAILURE,
        payload: { error: errorMessage },
      });
      return { error: errorMessage };
    }
  };
};

export const logoutAction = () => {
  return async (dispatch) => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    dispatch({ type: authConstants.ADMIN_LOGOUT });
  };
};