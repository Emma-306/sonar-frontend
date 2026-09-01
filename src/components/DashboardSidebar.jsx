import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { assets } from "../assets/assets.js";
import useAuthStore from "../stores/authStore.js";
import AccountSettingsModal from "./AccountSettingsModal.jsx";

// ==========================================
// COMPONENT
// ==========================================

const DashboardSidebar = ({ isOpen = false, onClose }) => {
  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = useNavigate();

  // ========================================
  // AUTH STORE
  // ========================================

  const user = useAuthStore((state) => state.user);

  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  // ========================================
  // BRAND COLOR
  // ========================================

  const brandColorHex = useAuthStore((state) => state.brandColorHex);

  const brandColor = useAuthStore((state) => state.brandColor || "purple");

  // ========================================
  // RECENT FILES
  // ========================================

  const recentFiles = useAuthStore((state) => state.recentFiles);

  const getRecentFiles = useAuthStore((state) => state.getRecentFiles);

  // ========================================
  // PINNED FILES
  // ========================================

  const pinnedFiles = useAuthStore((state) => state.pinnedFiles);

  const getPinnedFiles = useAuthStore((state) => state.getPinnedFiles);

  const togglePin = useAuthStore((state) => state.togglePin);

  // ========================================
  // SEARCH
  // ========================================

  const searchResults = useAuthStore((state) => state.searchResults || []);

  const searchQuery = useAuthStore((state) => state.searchQuery || "");

  const isSearching = useAuthStore((state) => state.isSearching);

  const searchFiles = useAuthStore((state) => state.searchFiles);

  const clearSearch = useAuthStore((state) => state.clearSearch);

  // ========================================
  // LOADING
  // ========================================

  const isLoading = useAuthStore((state) => state.isLoading);

  // ========================================
  // USAGE / PLAN
  // ========================================

  const usage = useAuthStore((state) => state.usage);

  const currentPlan = user?.plan || usage?.plan || "free";

  const premiumGradientStyle = (() => {
    const gradientMap = {
      purple: ["#A855F7", "#8B5CF6"],
      blue: ["#409CF2", "#7C3AED"],
      coral: ["#FF6B6B", "#F97316"],
      pink: ["#EC137F", "#A855F7"],
      teal: ["#00D2FF", "#3B82F6"],
    };

    const [start, end] = gradientMap[brandColor] || [brandColorHex, "#9333EA"];

    return {
      backgroundImage: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      boxShadow: `0 10px 18px ${start}33`,
    };
  })();

  // ========================================
  // LOCAL STATE
  // ========================================

  const [failedProfilePicture, setFailedProfilePicture] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  // ========================================
  // GET CURRENT USER
  // ========================================

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // ========================================
  // GET RECENT + PINNED FILES
  // ========================================

  useEffect(() => {
    if (!user) return;

    getRecentFiles();
    getPinnedFiles();
  }, [user, getRecentFiles, getPinnedFiles]);

  // ========================================
  // SEARCH DEBOUNCE
  // ========================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchFiles(searchInput);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput, searchFiles]);

  // ========================================
  // CLEAN UP SEARCH ON UNMOUNT
  // ========================================

  useEffect(() => {
    return () => {
      clearSearch();
    };
  }, [clearSearch]);

  // ========================================
  // USER INFORMATION
  // ========================================

  const displayName =
    user?.name || user?.displayName || user?.onboarding?.displayName || "User";

  const email = user?.email || "";

  const profilePicture = user?.profilePicture || null;

  // ========================================
  // NEW FILE
  // ========================================

  const handleNewFile = () => {
    navigate("/dashboard?newFile=true");

    onClose?.();
  };

  // ========================================
  // SEARCH INPUT
  // ========================================

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  // ========================================
  // CLEAR SEARCH
  // ========================================

  const handleClearSearch = () => {
    setSearchInput("");
    clearSearch();
  };

  // ========================================
  // GET FILE ID
  // ========================================

  const getFileId = (file) => {
    return file?.id || file?._id;
  };

  // ========================================
  // OPEN FILE
  // ========================================

  const handleOpenFile = (file) => {
    const fileId = getFileId(file);

    if (!fileId) return;

    navigate(`/dashboard/reading?fileId=${encodeURIComponent(fileId)}`);

    onClose?.();
  };

  // ========================================
  // CHECK IF FILE IS PINNED
  // ========================================

  const isFilePinned = (file) => {
    const fileId = getFileId(file);

    if (!fileId) return false;

    return pinnedFiles.some(
      (pinnedFile) => String(getFileId(pinnedFile)) === String(fileId),
    );
  };

  // ========================================
  // PIN / UNPIN FILE
  // ========================================

  const handleTogglePin = async (event, file) => {
    event.stopPropagation();

    const fileId = getFileId(file);

    if (!fileId) return;

    await togglePin(fileId);
  };

  // ========================================
  // CHECK IF SEARCH IS ACTIVE
  // ========================================

  const isSearchActive = searchInput.trim().length > 0;

  // ========================================
  // RENDER FILE ITEM
  // ========================================

  const renderFileItem = (file, isPinnedSection = false) => {
    const fileId = getFileId(file);

    const pinned = isFilePinned(file);

    return (
      <div
        key={fileId}
        className="
          group
          flex
          w-full
          min-w-0
          items-center
          rounded-lg
          transition
          hover:bg-gray-50
          dark:hover:bg-[#111111]
        "
      >
        <button
          type="button"
          onClick={() => handleOpenFile(file)}
          className="
            flex
            min-w-0
            flex-1
            cursor-pointer
            items-center
            gap-2.5
            rounded-lg
            px-2
            py-2
            text-left
            text-[12px]
            text-gray-700
            active:bg-gray-100
            dark:text-gray-300
            dark:active:bg-[#151515]
          "
        >
          {isPinnedSection ? (
            <svg
              style={{
                color: brandColorHex,
              }}
              className="
                h-3.5
                w-3.5
                shrink-0
              "
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 3h6" />
              <path d="M10 3v5l-4 4v2h12v-2l-4-4V3" />
              <path d="M12 14v7" />
            </svg>
          ) : (
            <svg
              className="
                h-3.5
                w-3.5
                shrink-0
                text-gray-400
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          )}

          <span className="min-w-0 flex-1 truncate">
            {file.originalName || file.name || "Untitled PDF"}
          </span>
        </button>

        <button
          type="button"
          onClick={(event) => handleTogglePin(event, file)}
          style={{
            color: pinned ? brandColorHex : undefined,
          }}
          className={`
            mr-1.5
            flex
            h-6
            w-6
            shrink-0
            cursor-pointer
            items-center
            justify-center
            rounded-md
            transition-all
            active:scale-90
            ${
              pinned
                ? "opacity-100"
                : "text-gray-400 opacity-0 group-hover:opacity-100"
            }
            hover:bg-gray-200
            dark:hover:bg-[#222222]
          `}
          aria-label={pinned ? "Unpin file" : "Pin file"}
          title={pinned ? "Unpin file" : "Pin file"}
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill={pinned ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3h6" />
            <path d="M10 3v5l-4 4v2h12v-2l-4-4V3" />
            <path d="M12 14v7" />
          </svg>
        </button>
      </div>
    );
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <>
      {/* ======================================
          MOBILE BACKDROP
      ====================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        style={{
          "--brand-color": brandColorHex,
        }}
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-dvh
          w-[calc(100vw-24px)]
          max-w-[280px]
          flex-col
          overflow-hidden
          border-r
          border-gray-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          sm:w-[260px]
          md:w-[240px]

          dark:border-[#1d1d1d]
          dark:bg-[#080808]

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static
          lg:h-screen
          lg:w-[240px]
          lg:max-w-none
          lg:translate-x-0
          lg:shadow-none
          lg:shrink-0
        `}
      >
        {/* ======================================
            LOGO + CLOSE
        ====================================== */}

        <div
          className="
            flex
            h-[76px]
            shrink-0
            items-center
            justify-between
            px-4
            pt-3
            sm:px-5
            lg:h-[80px]
            lg:px-5
            lg:pt-4
          "
        >
          {/* LOGO */}

          <div className="flex min-w-0 items-center">
            <img
              src={assets.brandLogo}
              alt="Sonar Logo"
              className="
                h-6
                w-auto
                max-w-[130px]
                object-contain
                dark:hidden
              "
            />

            <img
              src={assets.brandLogo2}
              alt="Sonar Logo"
              className="
                hidden
                h-6
                w-auto
                max-w-[130px]
                object-contain
                dark:block
              "
            />
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
              active:scale-95
              dark:hover:bg-[#1a1a1a]
              dark:hover:text-gray-200
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* ======================================
            SEARCH
        ====================================== */}

        <div
          className="
            shrink-0
            px-3
            pb-4
            sm:px-4
          "
        >
          <div className="relative">
            <svg
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-gray-400
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search files..."
              className="
                h-9
                w-full
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                pl-9
                pr-9
                text-[12px]
                text-gray-800
                outline-none
                transition-all
                placeholder:text-gray-400

                focus:border-[var(--brand-color)]
                focus:bg-white

                dark:border-[#252525]
                dark:bg-[#111111]
                dark:text-gray-200
                dark:placeholder:text-gray-500

                dark:focus:border-[var(--brand-color)]
                dark:focus:bg-[#0f0f0f]
              "
            />

            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="
                  absolute
                  right-2
                  top-1/2
                  flex
                  h-6
                  w-6
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-md
                  text-gray-400
                  transition
                  hover:bg-gray-200
                  hover:text-gray-700
                  dark:hover:bg-[#222222]
                  dark:hover:text-gray-300
                "
                aria-label="Clear search"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ======================================
            NEW FILE
        ====================================== */}

        <div className="shrink-0 px-2.5 pb-5 sm:px-3">
          <button
            type="button"
            onClick={handleNewFile}
            className="
              flex
              w-full
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              px-2
              py-1.5
              text-left
              text-gray-700
              transition
              hover:bg-gray-100
              dark:text-gray-200
              dark:hover:bg-[#171717]
            "
          >
            <span
              className="
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-md
                text-[16px]
                font-medium
                leading-none
                text-gray-500
                dark:text-gray-400
              "
            >
              +
            </span>

            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-500
                dark:text-gray-400
              "
            >
              New File
            </span>
          </button>
        </div>

        {/* ======================================
            FILES / SEARCH RESULTS
        ====================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-2.5
            sm:px-3
          "
        >
          {/* ====================================
              SEARCH RESULTS
          ==================================== */}

          {isSearchActive ? (
            <div>
              <div className="mb-2 flex items-center justify-between px-2">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Search Results
                </p>

                {!isSearching && searchResults.length > 0 && (
                  <span className="text-[10px] text-gray-400">
                    {searchResults.length}
                  </span>
                )}
              </div>

              {/* SEARCH LOADING */}

              {isSearching ? (
                <div className="space-y-1">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="
                        flex
                        h-9
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-2
                      "
                    >
                      <div
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          animate-pulse
                          rounded
                          bg-gray-200
                          dark:bg-[#1d1d1d]
                        "
                      />

                      <div
                        className="
                          h-3
                          flex-1
                          animate-pulse
                          rounded
                          bg-gray-200
                          dark:bg-[#1d1d1d]
                        "
                      />
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 ? (
                /* NO RESULTS */

                <div className="px-2 py-10 text-center">
                  <svg
                    className="
                      mx-auto
                      mb-3
                      h-7
                      w-7
                      text-gray-300
                      dark:text-gray-600
                    "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />

                    <path d="m20 20-4-4" />
                  </svg>

                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    No files found
                  </p>

                  <p className="mt-1 text-[10px] text-gray-300 dark:text-gray-600">
                    Try a different search
                  </p>
                </div>
              ) : (
                /* SEARCH RESULTS */

                <div className="space-y-0.5">
                  {searchResults.map((file) =>
                    renderFileItem(file, isFilePinned(file)),
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ====================================
                  PINNED
              ==================================== */}

              <div className="mb-5">
                <p
                  className="
                    mb-2
                    px-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Pinned
                </p>

                {isLoading && pinnedFiles.length === 0 ? (
                  <div className="space-y-1">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="
                          flex
                          h-8
                          w-full
                          items-center
                          gap-2.5
                          rounded-lg
                          px-2
                        "
                      >
                        <div
                          className="
                            h-3.5
                            w-3.5
                            shrink-0
                            animate-pulse
                            rounded
                            bg-gray-200
                            dark:bg-[#1d1d1d]
                          "
                        />

                        <div
                          className="
                            h-3
                            flex-1
                            animate-pulse
                            rounded
                            bg-gray-200
                            dark:bg-[#1d1d1d]
                          "
                        />
                      </div>
                    ))}
                  </div>
                ) : pinnedFiles.length === 0 ? (
                  <div className="px-2 py-5 text-center">
                    <svg
                      className="
                        mx-auto
                        mb-2
                        h-6
                        w-6
                        text-gray-300
                        dark:text-gray-600
                      "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 3h6" />
                      <path d="M10 3v5l-4 4v2h12v-2l-4-4V3" />
                      <path d="M12 14v7" />
                    </svg>

                    <p
                      className="
                        text-[11px]
                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      No pinned files
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {pinnedFiles.map((file) => renderFileItem(file, true))}
                  </div>
                )}
              </div>

              {/* ====================================
                  RECENTS
              ==================================== */}

              <div>
                <p
                  className="
                    mb-2
                    px-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Recents
                </p>

                {isLoading && recentFiles.length === 0 ? (
                  <div className="space-y-1">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="
                          flex
                          h-8
                          w-full
                          items-center
                          gap-2.5
                          rounded-lg
                          px-2
                        "
                      >
                        <div
                          className="
                            h-3.5
                            w-3.5
                            shrink-0
                            animate-pulse
                            rounded
                            bg-gray-200
                            dark:bg-[#1d1d1d]
                          "
                        />

                        <div
                          className="
                            h-3
                            flex-1
                            animate-pulse
                            rounded
                            bg-gray-200
                            dark:bg-[#1d1d1d]
                          "
                        />
                      </div>
                    ))}
                  </div>
                ) : recentFiles.length === 0 ? (
                  <div className="px-2 py-5 text-center">
                    <svg
                      className="
                        mx-auto
                        mb-2
                        h-6
                        w-6
                        text-gray-300
                        dark:text-gray-600
                      "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                      <path d="M10 9H8" />
                    </svg>

                    <p
                      className="
                        text-[11px]
                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      No recent files
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {recentFiles.map((file) => renderFileItem(file, false))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ======================================
            BOTTOM
        ====================================== */}

        <div
          className="
            shrink-0
            border-t
            border-gray-200
            px-3
            pb-4
            pt-4
            dark:border-[#1d1d1d]
            sm:px-3.5
            sm:pb-4.5
            sm:pt-4
          "
        >
          {/* UPGRADE */}

          {currentPlan === "free" && (
            <NavLink
              to="/plan-comparison"
              onClick={onClose}
              className="
                mb-4
                flex
                h-10
                w-full
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-lg
                px-2
                text-[11px]
                font-medium
                text-white
                transition
                hover:opacity-90
                active:scale-[0.98]
                sm:text-[12px]
              "
              style={premiumGradientStyle}
            >
              <img
                src={assets.sparkeWhite}
                alt=""
                className="h-3.5 w-3.5 shrink-0 object-contain"
              />

              <span>Upgrade to Pro</span>
            </NavLink>
          )}

          {currentPlan === "premium" && (
            <div
              className="mb-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg px-2 text-[11px] font-medium text-white shadow-sm sm:text-[12px]"
              style={premiumGradientStyle}
            >
              <img
                src={assets.sparkeWhite}
                alt=""
                className="h-3.5 w-3.5 shrink-0 object-contain"
              />

              <span>Premium Member</span>
            </div>
          )}

          {/* USER */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-2.5
              px-1
              py-1
              sm:gap-3
            "
          >
            {/* PROFILE PICTURE */}

            {profilePicture && profilePicture !== failedProfilePicture ? (
              <img
                src={profilePicture}
                alt={displayName}
                onError={() => setFailedProfilePicture(profilePicture)}
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[12px]
                  font-semibold
                "
                style={{
                  color: brandColorHex,
                  backgroundColor: `${brandColorHex}18`,
                }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* NAME + EMAIL */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  truncate
                  text-[12px]
                  font-medium
                  text-gray-900
                  dark:text-gray-100
                "
                title={displayName}
              >
                {displayName}
              </p>

              <p
                className="
                  truncate
                  text-[10px]
                  text-gray-400
                  dark:text-gray-500
                "
                title={email}
              >
                {email}
              </p>
            </div>

            {/* SETTINGS */}

            <button
              type="button"
              onClick={() => {
                setIsSettingsOpen(true);
                onClose?.();
              }}
              style={{
                color: "#777777",
              }}
              className="
                flex
                h-8
                w-8
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                transition
                hover:bg-gray-100
                active:scale-95
                dark:hover:bg-[#1a1a1a]
              "
              aria-label="Settings"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />

                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1.01 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================
          ACCOUNT SETTINGS MODAL
      ====================================== */}

      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default DashboardSidebar;
