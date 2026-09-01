import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { assets } from "../assets/assets.js";
import ThemeToggle from "../components/ThemeToggle";
import useAuthStore from "../stores/authStore.js";

// ==========================================
// CONSTANTS
// ==========================================

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const FREE_UPLOAD_LIMIT = 3;
const PREMIUM_UPLOAD_LIMIT = 10;

// ==========================================
// DASHBOARD
// ==========================================

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const orbRef = useRef(null);

  const navigate = useNavigate();

  // ========================================
  // URL SEARCH PARAMS
  // ========================================

  const [searchParams, setSearchParams] = useSearchParams();

  // ========================================
  // STATE
  // ========================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  // ========================================
  // AUTH STORE
  // ========================================

  const user = useAuthStore((state) => state.user);

  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);

  const uploadFile = useAuthStore((state) => state.uploadFile);

  const isLoading = useAuthStore((state) => state.isLoading);

  // ========================================
  // USAGE / SUBSCRIPTION
  // ========================================

  const usage = useAuthStore((state) => state.usage);

  // ========================================
  // BRAND COLOR
  // ========================================

  const brandColorHex = useAuthStore((state) => state.brandColorHex);

  const getOrbHueRotate = (hex) => {
    if (!hex) return 0;

    const cleanHex = hex.replace("#", "");
    const normalizedHex =
      cleanHex.length === 3
        ? cleanHex
            .split("")
            .map((char) => char + char)
            .join("")
        : cleanHex;

    const numericValue = Number.parseInt(normalizedHex, 16);
    const r = (numericValue >> 16) & 255;
    const g = (numericValue >> 8) & 255;
    const b = numericValue & 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
      switch (max) {
        case r:
          hue = ((g - b) / delta) % 6;
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        default:
          hue = (r - g) / delta + 4;
      }

      hue *= 60;
    }

    const baseOrbHue = 300;
    return Math.round((hue + 360 - baseOrbHue) % 360);
  };

  const sonarHueRotate = getOrbHueRotate(brandColorHex);

  useEffect(() => {
    const video = orbRef.current;

    if (!video) return;

    const attemptPlay = async () => {
      video.muted = true;
      try {
        await video.play();
      } catch (error) {
        console.warn("Orb autoplay failed:", error);
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
      return;
    }

    video.addEventListener("canplay", attemptPlay, { once: true });

    return () => video.removeEventListener("canplay", attemptPlay);
  }, [brandColorHex]);

  // ========================================
  // USER PLAN
  // ========================================

  const currentPlan = user?.plan || usage?.plan || "free";

  const isPremium = currentPlan?.toLowerCase() === "premium";

  // ========================================
  // UPLOAD LIMIT
  // ========================================

  const uploadLimit =
    usage?.uploads?.limit ??
    (isPremium ? PREMIUM_UPLOAD_LIMIT : FREE_UPLOAD_LIMIT);

  // ========================================
  // TODAY'S UPLOAD USAGE
  // ========================================

  const uploadsToday =
    usage?.uploads?.used ??
    user?.usage?.uploadsToday ??
    user?.uploadsToday ??
    0;

  // ========================================
  // UPLOADS REMAINING
  // ========================================

  const uploadsRemaining = Math.max(uploadLimit - uploadsToday, 0);

  const uploadLimitReached = uploadsRemaining <= 0;

  // ========================================
  // GET CURRENT USER
  // ========================================

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // ========================================
  // OPEN FILE PICKER FROM NEW FILE
  // ========================================

  useEffect(() => {
    const newFile = searchParams.get("newFile");

    if (newFile !== "true") return;

    const timer = setTimeout(() => {
      if (fileInputRef.current && !isLoading && !uploadLimitReached) {
        fileInputRef.current.click();
      }

      setSearchParams(
        {},
        {
          replace: true,
        },
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, setSearchParams, isLoading, uploadLimitReached]);

  // ========================================
  // USER INFORMATION
  // ========================================

  const displayName =
    user?.displayName || user?.onboarding?.displayName || user?.name || "User";

  // ========================================
  // BROWSE FILES
  // ========================================

  const handleBrowseClick = () => {
    if (selectedFile || isLoading || uploadLimitReached) {
      return;
    }

    fileInputRef.current?.click();
  };

  // ========================================
  // HANDLE FILE CHANGE
  // ========================================

  const validateAndSetFile = (file, inputElement = null) => {
    if (!file) return;

    setError("");
    setUploadSuccess("");

    // ======================================
    // CHECK DAILY LIMIT
    // ======================================

    if (uploadLimitReached) {
      setError(
        isPremium
          ? "You've reached your Premium PDF upload limit for today."
          : "You've reached your free PDF upload limit for today. Upgrade to Premium for 10 uploads per day.",
      );

      if (inputElement) {
        inputElement.value = "";
      }

      return;
    }

    // ======================================
    // CHECK PDF
    // ======================================

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");

      if (inputElement) {
        inputElement.value = "";
      }

      return;
    }

    // ======================================
    // CHECK FILE SIZE
    // ======================================

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please select a PDF smaller than 25MB.");

      if (inputElement) {
        inputElement.value = "";
      }

      return;
    }

    // ======================================
    // SET SELECTED FILE
    // ======================================

    setSelectedFile(file);
    setIsDragActive(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    validateAndSetFile(file, event.target);
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    if (selectedFile || isLoading || uploadLimitReached) return;

    setIsDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();

    if (event.currentTarget.contains(event.relatedTarget)) return;

    setIsDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragActive(false);

    if (selectedFile || isLoading || uploadLimitReached) return;

    const file = event.dataTransfer.files?.[0];

    validateAndSetFile(file);
  };

  // ========================================
  // DELETE FILE
  // ========================================

  const handleDeleteFile = () => {
    if (isLoading) return;

    setSelectedFile(null);
    setError("");
    setUploadSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================
  // UPLOAD FILE
  // ========================================

  const handleUploadFile = async () => {
    if (!selectedFile || isLoading || uploadLimitReached) {
      return;
    }

    setError("");
    setUploadSuccess("");

    try {
      const result = await uploadFile(selectedFile);

      console.log("Upload result:", result);

      // ====================================
      // UPLOAD FAILED
      // ====================================

      if (!result?.success) {
        setError(result?.message || "Failed to upload PDF.");

        return;
      }

      // ====================================
      // NO FILE ID
      // ====================================

      if (!result?.fileId) {
        setError("PDF uploaded successfully, but no file ID was returned.");

        return;
      }

      console.log("File ID:", result.fileId);

      setUploadSuccess("PDF uploaded successfully!");

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // ====================================
      // NAVIGATE TO READING PAGE
      // ====================================

      navigate(
        `/dashboard/reading?fileId=${encodeURIComponent(result.fileId)}`,
      );
    } catch (uploadError) {
      console.error("Upload error:", uploadError);

      setError(
        uploadError?.message || "Something went wrong while uploading the PDF.",
      );
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-col
        items-center
        justify-center
        px-4
        py-8
        sm:px-6
        md:py-10
      "
    >
      {/* ======================================
          THEME TOGGLE
      ====================================== */}

      <div
        className="
          absolute
          right-4
          top-4
          z-10
          sm:right-6
          sm:top-5
        "
      >
        <ThemeToggle />
      </div>

      {/* ======================================
          CENTERED CONTENT
      ====================================== */}

      <div
        className="
          flex
          w-full
          max-w-[520px]
          flex-col
          items-center
          justify-center
        "
      >
        {/* ====================================
            SONAR ORB
        ==================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-center
            sm:mb-6
            md:mb-7
          "
        >
          <video
            ref={orbRef}
            src={assets.sonarOrb}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Sonar"
            style={{
              filter: `hue-rotate(${sonarHueRotate}deg) saturate(1.3) brightness(1.05)`,
            }}
            className="
              h-auto
              w-[150px]
              object-contain
              sm:w-[170px]
              md:w-[190px]
            "
          />
        </div>

        {/* ====================================
            WELCOME TEXT
        ==================================== */}

        <h1
          className="
            mb-2
            text-center
            text-2xl
            font-semibold
            tracking-tight
            text-gray-900
            sm:text-[28px]
            dark:text-white
          "
        >
          {isLoading && !user ? "Welcome..." : `Welcome, ${displayName}`}
        </h1>

        <p
          className="
            mb-4
            px-2
            text-center
            text-[13px]
            text-gray-500
            sm:text-[14px]
            dark:text-gray-400
          "
        >
          What PDF would you like to listen to today?
        </p>

        {/* ====================================
            UPLOAD AREA
        ==================================== */}

        <div
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="
            flex
            w-full
            max-w-[420px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-gray-300
            bg-white
            px-4
            py-8
            transition
            hover:border-gray-400
            sm:px-6
            sm:py-9
            md:px-8
            md:py-10
            dark:border-[#333]
            dark:bg-[#0c0c0c]
            dark:hover:border-[#444]
          "
          style={
            isDragActive
              ? {
                  borderColor: brandColorHex,
                  backgroundColor: `${brandColorHex}12`,
                  boxShadow: `0 0 0 1px ${brandColorHex}33 inset`,
                }
              : undefined
          }
        >
          {/* UPLOAD ICON */}

          <div
            className="
              mb-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              sm:h-11
              sm:w-11
            "
            style={{
              backgroundColor: `${brandColorHex}15`,
            }}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke={brandColorHex}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V8" />
              <path d="M9 11l3-3 3 3" />
              <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
            </svg>
          </div>

          {/* HEADING */}

          <p
            className="
              mb-1
              text-center
              text-[13px]
              font-medium
              text-gray-800
              sm:text-[14px]
              dark:text-gray-100
            "
          >
            {uploadLimitReached
              ? "Daily upload limit reached"
              : "Upload a PDF to get started"}
          </p>

          {/* BROWSE FILES */}

          <p
            className="
              mb-3
              text-center
              text-[12px]
              text-gray-500
              sm:text-[13px]
              dark:text-gray-400
            "
          >
            {uploadLimitReached ? (
              isPremium ? (
                "Your Premium upload limit resets tomorrow."
              ) : (
                <>
                  Your free upload limit resets tomorrow.
                  <br />
                  <button
                    type="button"
                    onClick={() => navigate("/plan-comparison")}
                    className="
                      mt-1
                      cursor-pointer
                      font-medium
                      hover:underline
                    "
                    style={{
                      color: brandColorHex,
                    }}
                  >
                    Upgrade to Premium
                  </button>
                </>
              )
            ) : selectedFile ? (
              "PDF selected"
            ) : (
              <>
                Drag and drop or{" "}
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  disabled={isLoading}
                  className="
                    cursor-pointer
                    font-medium
                    transition
                    hover:underline
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  style={{
                    color: brandColorHex,
                  }}
                >
                  Browse files
                </button>
              </>
            )}
          </p>

          {/* FILE INPUT */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={!!selectedFile || isLoading || uploadLimitReached}
          />

          {/* FILE SIZE */}

          {!uploadLimitReached && (
            <p
              className="
                text-center
                text-[10px]
                text-gray-400
                sm:text-[11px]
              "
            >
              Supports .pdf files up to 25MB.
            </p>
          )}

          {/* USAGE REMAINING */}

          {!uploadLimitReached && !selectedFile && (
            <p
              className="
                mt-2
                text-center
                text-[10px]
                text-gray-400
                sm:text-[11px]
              "
            >
              {uploadsRemaining} {uploadsRemaining === 1 ? "upload" : "uploads"}{" "}
              remaining today
            </p>
          )}

          {/* ERROR */}

          {error && (
            <p
              className="
                mt-4
                max-w-full
                text-center
                text-[11px]
                font-medium
                text-red-500
                sm:text-[12px]
              "
            >
              {error}
            </p>
          )}

          {/* SUCCESS */}

          {uploadSuccess && (
            <p
              className="
                mt-4
                text-center
                text-[11px]
                font-medium
                sm:text-[12px]
              "
              style={{
                color: brandColorHex,
              }}
            >
              {uploadSuccess}
            </p>
          )}

          {/* SELECTED FILE */}

          {selectedFile && !error && (
            <>
              <div
                className="
                  mt-5
                  flex
                  w-full
                  min-w-0
                  items-center
                  justify-between
                  gap-2
                  rounded-lg
                  bg-gray-50
                  px-3
                  py-3
                  sm:px-4
                  dark:bg-[#151515]
                "
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="
                      truncate
                      text-[12px]
                      font-medium
                      text-gray-800
                      sm:text-[13px]
                      dark:text-gray-100
                    "
                    title={selectedFile.name}
                  >
                    {selectedFile.name}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[10px]
                      text-gray-500
                      sm:text-[11px]
                      dark:text-gray-400
                    "
                  >
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                {/* DELETE BUTTON */}

                <button
                  type="button"
                  onClick={handleDeleteFile}
                  disabled={isLoading}
                  title="Delete PDF"
                  aria-label="Delete PDF"
                  className="
                    ml-1
                    flex
                    h-8
                    w-8
                    flex-shrink-0
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-400
                    transition
                    hover:bg-red-50
                    hover:text-red-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:hover:bg-red-500/10
                  "
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
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v5" />
                    <path d="M14 11v5" />
                  </svg>
                </button>
              </div>

              {/* UPLOAD BUTTON */}

              <button
                type="button"
                onClick={handleUploadFile}
                disabled={isLoading || uploadLimitReached}
                className="
                  mt-4
                  w-full
                  rounded-lg
                  px-4
                  py-3
                  text-[12px]
                  font-medium
                  text-white
                  transition
                  hover:opacity-90
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:text-[13px]
                "
                style={{
                  backgroundColor: brandColorHex,
                }}
              >
                {isLoading ? "Uploading PDF..." : "Upload PDF"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
