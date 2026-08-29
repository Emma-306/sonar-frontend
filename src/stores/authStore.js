import { create } from "zustand";
import axios from "axios";

// ==========================================
// API URL
// ==========================================

const API_URL = import.meta.env.VITE_API_URL;

// ==========================================
// AUTH STORE
// ==========================================

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  authReady: false,
  isLoading: false,
  error: null,

  // ==========================================
  // UPLOADED FILE
  // ==========================================

  uploadedFile: null,

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      uploadedFile: null,
      error: null,
      authReady: true,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ authReady: true });
      return false;
    }

    const result = await useAuthStore.getState().getCurrentUser();
    set({ authReady: true });
    return result.success;
  },

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  googleLogin: async (code) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await axios.post(`${API_URL}/auth/google`, {
        code,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      set({
        user,
        token,
        authReady: true,
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

  // ==========================================
  // COMPLETE ONBOARDING
  // ==========================================

  completeOnboarding: async (preferences) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

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

      const response = await axios.post(`${API_URL}/onboarding`, preferences, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  // ==========================================
  // UPLOAD PDF
  // ==========================================

  uploadFile: async (file) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

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

      // ========================================
      // CHECK FILE
      // ========================================

      if (!file) {
        set({
          isLoading: false,
          error: "Please select a PDF file",
        });

        return {
          success: false,
          message: "Please select a PDF file",
        };
      }

      // ========================================
      // CHECK FILE TYPE
      // ========================================

      if (file.type !== "application/pdf") {
        set({
          isLoading: false,
          error: "Only PDF files are allowed",
        });

        return {
          success: false,
          message: "Only PDF files are allowed",
        };
      }

      // ========================================
      // CHECK FILE SIZE
      // ========================================

      const MAX_FILE_SIZE = 25 * 1024 * 1024;

      if (file.size > MAX_FILE_SIZE) {
        set({
          isLoading: false,
          error: "PDF file must not exceed 25 MB",
        });

        return {
          success: false,
          message: "PDF file must not exceed 25 MB",
        };
      }

      // ========================================
      // FORM DATA
      // ========================================

      const formData = new FormData();

      formData.append("file", file);

      console.log("Uploading PDF...");

      // ========================================
      // UPLOAD
      // ========================================

      const response = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload response:", response.data);

      // ========================================
      // FILE ID
      // ========================================

      const fileId = response.data.fileId;

      if (!fileId) {
        throw new Error("Backend did not return a file ID");
      }

      // ========================================
      // SAVE FILE
      // ========================================

      const uploadedFile = {
        id: fileId,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      set({
        uploadedFile,
        isLoading: false,
        error: null,
      });

      console.log("Uploaded file saved:", uploadedFile);

      return {
        success: true,
        fileId,
        file: uploadedFile,
        message: response.data.message || "PDF uploaded successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload PDF";

      console.error("PDF upload failed:", error);

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

  // ==========================================
  // GET FILE
  // ==========================================

  getFile: async (fileId) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

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

      if (!fileId) {
        set({
          isLoading: false,
          error: "File ID is required",
        });

        return {
          success: false,
          message: "File ID is required",
        };
      }

      const response = await axios.get(`${API_URL}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Get file response:", response.data);

      const file = response.data.file;

      if (!file) {
        throw new Error("Backend did not return file information");
      }

      set((state) => ({
        uploadedFile: {
          ...state.uploadedFile,
          ...file,
        },
        isLoading: false,
        error: null,
      }));

      return {
        success: true,
        file,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to get file";

      console.error("Get file failed:", error);

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

  // ==========================================
  // CLEAR UPLOADED FILE
  // ==========================================

  clearUploadedFile: () => {
    set({
      uploadedFile: null,
      error: null,
    });
  },

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");

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

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

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

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          uploadedFile: null,
          authReady: true,
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

  // ==========================================
  // GET USER VOICE
  // ==========================================

  getUserVoice: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

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

      const response = await axios.get(`${API_URL}/tts/voice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User voice:", response.data);

      set({
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        voice: response.data.voice,
      };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to get user voice";

      console.error("Get user voice failed:", error);

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

  // ==========================================
  // GENERATE USER SPEECH
  // ==========================================

  generateUserSpeech: async (fileId) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

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

      // ========================================
      // CHECK FILE ID
      // ========================================

      if (!fileId) {
        set({
          isLoading: false,
          error: "File ID is required",
        });

        return {
          success: false,
          message: "File ID is required",
        };
      }

      console.log("Sending text to TTS backend...");
      console.log("File ID:", fileId);

      // ========================================
      // GENERATE SPEECH
      // ========================================

      const response = await axios.post(
        `${API_URL}/tts/speech`,
        {
          fileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Generated speech:", response.data);

      // ========================================
      // GET AUDIO
      // ========================================

      const generatedAudio = response.data.audio;

      if (!generatedAudio) {
        throw new Error("Backend did not return audio information");
      }

      if (!generatedAudio.audioUrl) {
        throw new Error("Backend did not return an audio URL");
      }

      set({
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        audioUrl: generatedAudio.audioUrl,
        audio: generatedAudio,
        message: response.data.message || "Speech generated successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate speech";

      console.error("Generate speech failed:", error);

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
