import { useEffect, useState } from "react";

import { useTheme } from "../context/UseTheme.jsx";
import useAuthStore, {
  brandColors,
} from "../stores/authStore.js";

// ==========================================
// CHECK ICON
// ==========================================

const CheckIcon = () => (
  <svg
    className="h-3 w-3 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ==========================================
// BRAND COLOR STYLES
// ==========================================

const brandColorStyles = {
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-500",
    button: "bg-purple-600 hover:bg-purple-500",
    ring: "ring-purple-500",
    text: "text-purple-500",
  },

  blue: {
    border: "border-blue-500",
    bg: "bg-blue-500",
    button: "bg-blue-600 hover:bg-blue-500",
    ring: "ring-blue-500",
    text: "text-blue-500",
  },

  coral: {
    border: "border-rose-400",
    bg: "bg-rose-400",
    button: "bg-rose-500 hover:bg-rose-400",
    ring: "ring-rose-400",
    text: "text-rose-500",
  },

  pink: {
    border: "border-pink-500",
    bg: "bg-pink-500",
    button: "bg-pink-600 hover:bg-pink-500",
    ring: "ring-pink-500",
    text: "text-pink-500",
  },

  teal: {
    border: "border-cyan-400",
    bg: "bg-cyan-400",
    button: "bg-cyan-500 hover:bg-cyan-400",
    ring: "ring-cyan-400",
    text: "text-cyan-500",
  },
};

// ==========================================
// COMPONENT
// ==========================================

const AccountSettingsModal = ({ isOpen, onClose }) => {
  // ========================================
  // THEME
  // ========================================

  const { darkMode, toggleTheme } = useTheme();

  // ========================================
  // AUTH STORE
  // ========================================

  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);

  const updateAccountSettings = useAuthStore(
    (state) => state.updateAccountSettings
  );

  const isLoading = useAuthStore((state) => state.isLoading);

  // Get the centralized brand color from Zustand
  const storeBrandColor = useAuthStore(
    (state) => state.brandColor
  );

  const brandColorHex = useAuthStore(
    (state) => state.brandColorHex
  );

  // ========================================
  // LOCAL STATE
  // ========================================

  const [isEditingName, setIsEditingName] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const [officialName, setOfficialName] = useState("");

  const [voiceModel, setVoiceModel] = useState("male");

  const [accent, setAccent] = useState("american");

  const [brandColor, setBrandColor] = useState("purple");

  const [saveError, setSaveError] = useState("");

  // ========================================
  // LOAD USER SETTINGS
  // ========================================

  useEffect(() => {
    if (!user || !isOpen) return;

    // Official Google/account name
    setOfficialName(user.name || "");

    // Editable display name
    setDisplayName(
      user.displayName ||
        user.onboarding?.displayName ||
        user.name ||
        ""
    );

    // Voice
    setVoiceModel(
      user.voice ||
        user.preferredVoiceGender ||
        user.onboarding?.preferredVoiceGender ||
        "male"
    );

    // Accent
    setAccent(
      user.accent ||
        user.preferredAccent ||
        user.onboarding?.preferredAccent ||
        "american"
    );

    // Brand color
    setBrandColor(
      user.brandColor ||
        user.onboarding?.brandColor ||
        storeBrandColor ||
        "purple"
    );

    setIsEditingName(false);
    setSaveError("");
  }, [user, isOpen, storeBrandColor]);

  // ========================================
  // DON'T RENDER
  // ========================================

  if (!isOpen) return null;

  // ========================================
  // USER INFORMATION
  // ========================================

  const email = user?.email || "";

  const profilePicture = user?.profilePicture || null;

  // ========================================
  // ACTIVE BRAND STYLE
  // ========================================

  const activeBrand =
    brandColorStyles[brandColor] ||
    brandColorStyles[storeBrandColor] ||
    brandColorStyles.purple;

  // ========================================
  // ACTIVE HEX COLOR
  // ========================================

  const activeBrandHex =
    brandColors.find(
      (color) => color.id === brandColor
    )?.color ||
    brandColorHex ||
    "#A855F7";

  // ========================================
  // SAVE SETTINGS
  // ========================================

  const handleSave = async () => {
    setSaveError("");

    if (!displayName.trim()) {
      setSaveError("Display name is required");
      return;
    }

    const result = await updateAccountSettings({
      displayName: displayName.trim(),

      preferredVoiceGender: voiceModel,

      preferredAccent: accent,

      brandColor,
    });

    if (!result?.success) {
      setSaveError(
        result?.message || "Failed to save settings"
      );

      return;
    }

    setIsEditingName(false);

    onClose?.();
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
        dark:bg-black/70
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {/* ======================================
          MODAL
      ====================================== */}

      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl
          dark:border-[#222]
          dark:bg-[#0f0f0f]
        "
      >
        {/* ======================================
            SCROLLABLE CONTENT
        ====================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            p-5
            text-left
            sm:p-7
            md:p-8
          "
        >
          {/* HEADER */}

          <div
            className="
              mb-8
              flex
              items-start
              justify-between
              gap-5
            "
          >
            <div>
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Account Settings
              </h2>

              <p
                className="
                  mt-1.5
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Take control of your experience
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* THEME SWITCH */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-gray-200
                  bg-gray-100
                  px-2.5
                  py-1.5
                  dark:border-white/10
                  dark:bg-[#1a1a1a]
                "
              >
                <svg
                  className={`h-4 w-4 ${
                    darkMode
                      ? "text-gray-400"
                      : "text-yellow-500"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="4" />

                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="relative h-5 w-9 rounded-full transition-colors"
                  style={{
                    backgroundColor: darkMode
                      ? activeBrandHex
                      : "#9ca3af",
                  }}
                  aria-label="Toggle theme"
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      darkMode
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  />
                </button>

                <svg
                  className={`h-4 w-4 ${
                    darkMode
                      ? "text-gray-200"
                      : "text-gray-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </svg>
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                  text-gray-500
                  transition-colors
                  hover:bg-gray-200
                  hover:text-gray-900
                  dark:bg-[#1a1a1a]
                  dark:text-gray-400
                  dark:hover:bg-[#252525]
                  dark:hover:text-white
                "
                aria-label="Close settings"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* PROFILE */}

          <div
            className="
              mb-8
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              {/* PROFILE IMAGE */}

              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={displayName}
                  className="
                    h-14
                    w-14
                    shrink-0
                    rounded-full
                    object-cover
                    ring-2
                    ring-gray-200
                    dark:ring-white/10
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    text-lg
                    font-semibold
                  "
                  style={{
                    color: activeBrandHex,
                    backgroundColor: `${activeBrandHex}20`,
                  }}
                >
                  {displayName
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* USER INFO */}

              <div className="min-w-0">
                {/* DISPLAY NAME */}

                {isEditingName ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(event) =>
                      setDisplayName(event.target.value)
                    }
                    autoFocus
                    className="
                      w-full
                      max-w-[220px]
                      rounded-lg
                      border
                      bg-white
                      px-3
                      py-1.5
                      text-sm
                      font-medium
                      text-gray-900
                      outline-none
                      dark:bg-[#1a1a1a]
                      dark:text-white
                    "
                    style={{
                      borderColor: activeBrandHex,
                    }}
                  />
                ) : (
                  <p
                    className="
                      truncate
                      text-base
                      font-semibold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {displayName}
                  </p>
                )}

                {/* OFFICIAL NAME */}

                {officialName &&
                  officialName !== displayName && (
                    <p
                      className="
                        mt-1
                        truncate
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {officialName}
                    </p>
                  )}

                {/* EMAIL */}

                <p
                  className="
                    mt-1
                    truncate
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {email}
                </p>
              </div>

              {/* EDIT */}

              <button
                type="button"
                onClick={() =>
                  setIsEditingName(
                    (current) => !current
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-colors
                "
                style={{
                  backgroundColor: isEditingName
                    ? activeBrandHex
                    : undefined,
                  color: isEditingName
                    ? "#ffffff"
                    : activeBrandHex,
                }}
                aria-label="Edit display name"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            </div>

            {/* GO PRO */}

            <button
              type="button"
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition-colors
                hover:opacity-90
              "
              style={{
                backgroundColor: activeBrandHex,
              }}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>

              Go Pro
            </button>
          </div>

          {/* DIVIDER */}

          <div
            className="
              mb-8
              border-t
              border-dashed
              border-gray-200
              dark:border-white/10
            "
          />

          {/* VOICE MODEL */}

          <div className="mb-8">
            <h3
              className="
                text-base
                font-medium
                text-gray-900
                dark:text-white
              "
            >
              Choose your voice model
            </h3>

            <p
              className="
                mb-5
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Choose a voice and accent to personalize
              your experience.
            </p>

            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              {["male", "female"].map((voice) => (
                <button
                  key={voice}
                  type="button"
                  onClick={() =>
                    setVoiceModel(voice)
                  }
                  className={`
                    relative
                    flex
                    min-h-[56px]
                    items-center
                    rounded-xl
                    px-5
                    py-4
                    text-sm
                    font-medium
                    capitalize
                    transition-all
                    ${
                      voiceModel === voice
                        ? "border-2 text-gray-900 dark:text-white"
                        : "border border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-[#222]"
                    }
                  `}
                  style={
                    voiceModel === voice
                      ? {
                          borderColor:
                            activeBrandHex,
                        }
                      : undefined
                  }
                >
                  {voice}

                  {voiceModel === voice && (
                    <span
                      className="
                        absolute
                        right-3
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          activeBrandHex,
                      }}
                    >
                      <CheckIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ACCENT */}

          <div className="mb-8">
            <h3
              className="
                mb-4
                text-base
                font-medium
                text-gray-900
                dark:text-white
              "
            >
              Select Accent
            </h3>

            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  id: "nigerian",
                  flag: "🇳🇬",
                  label: "Nigerian English",
                },
                {
                  id: "british",
                  flag: "🇬🇧",
                  label: "British English",
                },
                {
                  id: "american",
                  flag: "🇺🇸",
                  label: "American English",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setAccent(item.id)
                  }
                  className={`
                    relative
                    flex
                    min-h-[120px]
                    flex-col
                    items-start
                    rounded-xl
                    p-5
                    text-left
                    transition-all
                    ${
                      accent === item.id
                        ? "border-2"
                        : "border border-transparent bg-gray-100 hover:bg-gray-200 dark:bg-[#1a1a1a] dark:hover:bg-[#222]"
                    }
                  `}
                  style={
                    accent === item.id
                      ? {
                          borderColor:
                            activeBrandHex,
                        }
                      : undefined
                  }
                >
                  <span className="mb-3 text-2xl">
                    {item.flag}
                  </span>

                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </span>

                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Accent
                  </span>

                  {accent === item.id && (
                    <span
                      className="
                        absolute
                        right-3
                        top-3
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-full
                      "
                      style={{
                        backgroundColor:
                          activeBrandHex,
                      }}
                    >
                      <CheckIcon />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BRAND COLOR */}

          <div className="mb-2">
            <h3
              className="
                text-base
                font-medium
                text-gray-900
                dark:text-white
              "
            >
              Brand color
            </h3>

            <p
              className="
                mb-5
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Select your brand color
            </p>

            <div className="flex flex-wrap gap-6">
              {brandColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() =>
                    setBrandColor(color.id)
                  }
                  className="
                    flex
                    flex-col
                    items-center
                    gap-2
                    rounded-lg
                    p-1
                  "
                >
                  <div
                    className="
                      h-11
                      w-11
                      rounded-full
                      transition-all
                    "
                    style={{
                      backgroundColor:
                        color.color,
                      boxShadow:
                        brandColor === color.id
                          ? `0 0 0 2px white, 0 0 0 4px ${color.color}`
                          : "none",
                    }}
                  />

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {color.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SAVE ERROR */}

          {saveError && (
            <p className="mt-5 text-sm text-red-500">
              {saveError}
            </p>
          )}
        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-3
            border-t
            border-gray-200
            bg-white
            px-5
            py-4
            dark:border-white/10
            dark:bg-[#0f0f0f]
            sm:px-7
            md:px-8
          "
        >
          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-2.5
              text-sm
              font-semibold
              text-red-600
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-red-300
              hover:bg-red-100
              hover:shadow-md
              active:translate-y-0
              active:scale-[0.98]
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
              dark:hover:border-red-500/40
              dark:hover:bg-red-500/20
            "
          >
            <svg
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

              <polyline points="16 17 21 12 16 7" />

              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
              />
            </svg>

            <span>Log Out</span>
          </button>

          {/* SAVE */}

          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              shadow-lg
              transition-all
              hover:shadow-xl
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            style={{
              backgroundColor: activeBrandHex,
            }}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />

              <polyline points="17 21 17 13 7 13 7 21" />

              <polyline points="7 3 7 8 15 8" />
            </svg>

            {isLoading
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;