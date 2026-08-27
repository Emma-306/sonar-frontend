import { create } from "zustand";
import axios from "axios";

// ==========================================
// API URL
// ==========================================

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://sonar-backend-s3rs.onrender.com/api";

// ==========================================
// AUTH STORE
// ==========================================

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

      console.log("Sending Google authorization code to backend...");

      console.log("API URL:", API_URL);

      const response = await axios.post(`${API_URL}/auth/google`, {
        code,
      });

      console.log("Backend Google response:", response.data);

      const { token, user } = response.data;

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem("token", token);

      // ==========================================
      // UPDATE STORE
      // ==========================================

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
      const message = error.response?.data?.message || "Google login failed";

      console.error("Google login request failed:", error);

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
  completeOnboarding: async (preferences) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      // ========================================
      // GET TOKEN
      // ========================================

      const token = localStorage.getItem("token");

      if (!token) {
        set({
          isLoading: false,
          error: "Authentication required",
        });

        return {
          success: false,
          message: "Authentication required",
        };
      }

      console.log("Sending onboarding preferences...");

      // ========================================
      // SEND ONBOARDING TO BACKEND
      // ========================================

      const response = await axios.post(`${API_URL}/onboarding`, preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Onboarding response:", response.data);

      // ========================================
      // UPDATE USER
      // ========================================

      const updatedUser = response.data.user;

      set({
        user: updatedUser,
        token,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to complete onboarding";

      console.error("Onboarding request failed:", error);

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
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");

      // No token = not logged in
      if (!token) {
        return {
          success: false,
          message: "No authentication token",
        };
      }

      set({
        isLoading: true,
        error: null,
      });

      console.log("Fetching current user...");

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Current user:", response.data);

      const user = response.data.user;

      // Update Zustand
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
        error.response?.data?.message || "Failed to get current user";

      console.error("Get current user failed:", error);

      // Token is invalid/expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          isLoading: false,
          error: message,
        });
      } else {
        set({
          isLoading: false,
          error: message,
        });
      }

      return {
        success: false,
        message,
      };
    }
  },
}));

export default useAuthStore;
