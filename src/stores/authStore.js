import { create } from "zustand";
import axios from "axios";

const API_URL = "https://sonar-backend-s3rs.onrender.com/api";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  googleLogin: async (code) => {
  try {
    set({
      isLoading: true,
      error: null,
    });

    console.log(
      "Sending Google authorization code to backend..."
    );

    const response = await axios.post(
      `${API_URL}/auth/google`,
      {
        code,
      }
    );

    console.log(
      "Backend Google response:",
      response.data
    );

    const { token, user } = response.data;

    localStorage.setItem(
      "token",
      token
    );

    set({
      user,
      token,
      isLoading: false,
      error: null,
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Google login failed";

    console.error(
      "Google login request failed:",
      error
    );

    set({
      isLoading: false,
      error: message,
    });

    return {
      success: false,
      message,
    };
  }
},
}));

export default useAuthStore;