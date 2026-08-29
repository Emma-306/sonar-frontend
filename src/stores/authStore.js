import { create } from "zustand";
import axios from "axios";

// ==========================================
// API URL
// ==========================================

const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const API_URL = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, "")}/api`;

// ==========================================
// BRAND COLORS
// ==========================================

export const brandColors = [
  {
    id: "purple",
    color: "#A855F7",
    label: "Purple",
  },
  {
    id: "blue",
    color: "#409CF2",
    label: "Blue",
  },
  {
    id: "coral",
    color: "#FF6B6B",
    label: "Coral",
  },
  {
    id: "pink",
    color: "#EC137F",
    label: "Pink",
  },
  {
    id: "teal",
    color: "#00D2FF",
    label: "Teal",
  },
];

// ==========================================
// GET BRAND COLOR
// ==========================================

const getBrandColor = (brandColor) => {
  const foundColor = brandColors.find(
    (color) => color.id === brandColor
  );

  return foundColor?.color || "#A855F7";
};

// ==========================================
// AUTH STORE
// ==========================================

const useAuthStore = create((set) => ({
  // ==========================================
  // AUTH STATE
  // ==========================================

  user: null,
  token: null,
  authReady: false,
  isLoading: false,
  error: null,

  // ==========================================
  // BRAND COLOR
  // ==========================================

  brandColor: "purple",
  brandColorHex: "#A855F7",

  // ==========================================
  // SET BRAND COLOR LOCALLY
  // ==========================================

  setBrandColor: (brandColor) => {
    const color = getBrandColor(brandColor);

    set({
      brandColor,
      brandColorHex: color,
    });
  },

  // ==========================================
  // UPLOADED FILE
  // ==========================================

  uploadedFile: null,

  // ==========================================
  // RECENT FILES
  // ==========================================

  recentFiles: [],

  // ==========================================
  // PINNED FILES
  // ==========================================

  pinnedFiles: [],

  // ==========================================
  // LOGOUT
  // ==========================================

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      uploadedFile: null,
      recentFiles: [],
      pinnedFiles: [],
      brandColor: "purple",
      brandColorHex: "#A855F7",
      error: null,
      authReady: true,
    });
  },

  // ==========================================
  // INITIALIZE AUTH
  // ==========================================

  initializeAuth: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({
        authReady: true,
        recentFiles: [],
        pinnedFiles: [],
      });

      return false;
    }

    const result =
      await useAuthStore.getState().getCurrentUser();

    set({
      authReady: true,
    });

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

      const response = await axios.post(
        `${API_URL}/auth/google`,
        {
          code,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      const userBrandColor =
        user?.brandColor || "purple";

      set({
        user,
        token,
        brandColor: userBrandColor,
        brandColorHex:
          getBrandColor(userBrandColor),
        authReady: true,
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

      const response = await axios.post(
        `${API_URL}/onboarding`,
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser =
        response.data.user;

      const userBrandColor =
        updatedUser?.brandColor || "purple";

      set({
        user: updatedUser,
        token,
        brandColor: userBrandColor,
        brandColorHex:
          getBrandColor(userBrandColor),
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to complete onboarding";

      console.error(
        "Onboarding request failed:",
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

  // ==========================================
  // UPLOAD PDF
  // ==========================================

  uploadFile: async (file) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

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

      const MAX_FILE_SIZE =
        25 * 1024 * 1024;

      if (file.size > MAX_FILE_SIZE) {
        set({
          isLoading: false,
          error:
            "PDF file must not exceed 25 MB",
        });

        return {
          success: false,
          message:
            "PDF file must not exceed 25 MB",
        };
      }

      const formData = new FormData();

      formData.append("file", file);

      console.log("Uploading PDF...");

      const response = await axios.post(
        `${API_URL}/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Upload response:",
        response.data
      );

      const fileId =
        response.data.fileId;

      if (!fileId) {
        throw new Error(
          "Backend did not return a file ID"
        );
      }

      const uploadedFile = {
        id: fileId,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isPinned: false,
      };

      const recentFile = {
        id: fileId,
        originalName: file.name,
        createdAt:
          new Date().toISOString(),
        isPinned: false,
      };

      set((state) => ({
        uploadedFile,

        recentFiles: [
          recentFile,
          ...state.recentFiles.filter(
            (existingFile) =>
              existingFile.id !== fileId
          ),
        ].slice(0, 5),

        isLoading: false,
        error: null,
      }));

      return {
        success: true,
        fileId,
        file: uploadedFile,
        message:
          response.data.message ||
          "PDF uploaded successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload PDF";

      console.error(
        "PDF upload failed:",
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

  // ==========================================
  // GET FILE
  // ==========================================

  getFile: async (fileId) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

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

      const response = await axios.get(
        `${API_URL}/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const file =
        response.data.file;

      if (!file) {
        throw new Error(
          "Backend did not return file information"
        );
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
        error.response?.data?.message ||
        error.message ||
        "Failed to get file";

      console.error(
        "Get file failed:",
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

  // ==========================================
  // GET RECENT FILES
  // ==========================================

  getRecentFiles: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

      if (!token) {
        set({
          isLoading: false,
          error: "Authentication required",
          recentFiles: [],
        });

        return {
          success: false,
          files: [],
          message: "Authentication required",
        };
      }

      const response = await axios.get(
        `${API_URL}/files/recent`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Recent files response:",
        response.data
      );

      const files =
        response.data.files || [];

      set({
        recentFiles: files,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        files,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to get recent files";

      console.error(
        "Get recent files failed:",
        error
      );

      set({
        recentFiles: [],
        isLoading: false,
        error: message,
      });

      return {
        success: false,
        files: [],
        message,
      };
    }
  },

  // ==========================================
  // GET PINNED FILES
  // ==========================================

  getPinnedFiles: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

      if (!token) {
        set({
          isLoading: false,
          pinnedFiles: [],
          error: "Authentication required",
        });

        return {
          success: false,
          files: [],
          message: "Authentication required",
        };
      }

      const response = await axios.get(
        `${API_URL}/files/pinned`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Pinned files response:",
        response.data
      );

      const files =
        response.data.files || [];

      set({
        pinnedFiles: files,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        files,
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to get pinned files";

      console.error(
        "Get pinned files failed:",
        error
      );

      set({
        pinnedFiles: [],
        isLoading: false,
        error: message,
      });

      return {
        success: false,
        files: [],
        message,
      };
    }
  },

  // ==========================================
  // TOGGLE PIN
  // ==========================================

  togglePin: async (fileId) => {
    try {
      if (!fileId) {
        return {
          success: false,
          message: "File ID is required",
        };
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        set({
          error: "Authentication required",
        });

        return {
          success: false,
          message: "Authentication required",
        };
      }

      const response = await axios.patch(
        `${API_URL}/files/${fileId}/pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Toggle pin response:",
        response.data
      );

      const updatedFile =
        response.data.file;

      const isPinned =
        response.data.isPinned ??
        updatedFile?.isPinned ??
        false;

      set((state) => {
        const updatedRecentFiles =
          state.recentFiles.map(
            (file) =>
              file.id === fileId
                ? {
                    ...file,
                    isPinned,
                  }
                : file
          );

        let updatedPinnedFiles =
          state.pinnedFiles;

        if (isPinned) {
          const alreadyPinned =
            state.pinnedFiles.some(
              (file) =>
                file.id === fileId
            );

          if (!alreadyPinned) {
            const fileToPin =
              state.recentFiles.find(
                (file) =>
                  file.id === fileId
              );

            if (fileToPin) {
              updatedPinnedFiles = [
                {
                  ...fileToPin,
                  isPinned: true,
                },
                ...state.pinnedFiles,
              ];
            }
          }
        } else {
          updatedPinnedFiles =
            state.pinnedFiles.filter(
              (file) =>
                file.id !== fileId
            );
        }

        return {
          recentFiles:
            updatedRecentFiles,
          pinnedFiles:
            updatedPinnedFiles,
          error: null,
        };
      });

      return {
        success: true,
        isPinned,
        file: updatedFile,
        message:
          response.data.message ||
          (isPinned
            ? "File pinned successfully"
            : "File unpinned successfully"),
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update pin";

      console.error(
        "Toggle pin failed:",
        error
      );

      set({
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
      const token =
        localStorage.getItem("token");

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

      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user =
        response.data.user;

      const userBrandColor =
        user?.brandColor || "purple";

      set({
        user,
        token,
        brandColor: userBrandColor,
        brandColorHex:
          getBrandColor(userBrandColor),
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
        "Failed to get current user";

      console.error(
        "Get current user failed:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");

        set({
          user: null,
          token: null,
          uploadedFile: null,
          recentFiles: [],
          pinnedFiles: [],
          brandColor: "purple",
          brandColorHex: "#A855F7",
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

      const token =
        localStorage.getItem("token");

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

      const response = await axios.get(
        `${API_URL}/tts/voice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "User voice:",
        response.data
      );

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
        error.response?.data?.message ||
        "Failed to get user voice";

      console.error(
        "Get user voice failed:",
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

  // ==========================================
  // GENERATE USER SPEECH
  // ==========================================

  generateUserSpeech: async (fileId) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

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

      const response = await axios.post(
        `${API_URL}/tts/speech`,
        {
          fileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      let speechResponse =
        response.data;

      if (
        speechResponse.pending &&
        speechResponse.jobId
      ) {
        for (
          let attempt = 0;
          attempt < 180;
          attempt += 1
        ) {
          await new Promise(
            (resolve) =>
              setTimeout(resolve, 2000)
          );

          const statusResponse =
            await axios.get(
              `${API_URL}/tts/speech/status/${speechResponse.jobId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          speechResponse =
            statusResponse.data;

          if (!speechResponse.pending) {
            break;
          }
        }
      }

      console.log(
        "Generated speech:",
        speechResponse
      );

      if (!speechResponse.success) {
        throw new Error(
          speechResponse.message ||
            "Speech generation failed"
        );
      }

      if (speechResponse.pending) {
        throw new Error(
          "Speech generation is still processing. Please try again shortly."
        );
      }

      const generatedAudio =
        speechResponse.audio;

      if (!generatedAudio) {
        throw new Error(
          "Backend did not return audio information"
        );
      }

      if (!generatedAudio.audioUrl) {
        throw new Error(
          "Backend did not return an audio URL"
        );
      }

      set({
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        audioUrl:
          generatedAudio.audioUrl,
        audio: generatedAudio,
        message:
          speechResponse.message ||
          "Speech generated successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate speech";

      console.error(
        "Generate speech failed:",
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

  // ==========================================
  // UPDATE ACCOUNT SETTINGS
  // ==========================================

  updateAccountSettings: async (settings) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const token =
        localStorage.getItem("token");

      if (!token) {
        set({
          isLoading: false,
          error: "Authentication required",
        });

        return {
          success: false,
          message:
            "Authentication required",
        };
      }

      const response = await axios.patch(
        `${API_URL}/auth/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const updatedUser =
        response.data.user;

      // ========================================
      // UPDATE BRAND COLOR IMMEDIATELY
      // ========================================

      const updatedBrandColor =
        updatedUser?.brandColor ||
        settings?.brandColor ||
        "purple";

      set({
        user: updatedUser,
        brandColor: updatedBrandColor,
        brandColorHex:
          getBrandColor(updatedBrandColor),
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        user: updatedUser,
        brandColor: updatedBrandColor,
        brandColorHex:
          getBrandColor(updatedBrandColor),
        message:
          response.data.message ||
          "Settings updated successfully",
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update settings";

      console.error(
        "Update account settings failed:",
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