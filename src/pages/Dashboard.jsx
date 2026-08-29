import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { assets } from "../assets/assets.js";
import ThemeToggle from "../components/ThemeToggle";
import useAuthStore from "../stores/authStore.js";

// ==========================================
// BRAND COLORS
// ==========================================

const brandColors = [
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

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const Dashboard = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ==========================================
  // URL SEARCH PARAMS
  // ==========================================

  const [searchParams, setSearchParams] = useSearchParams();

  // ==========================================
  // STATE
  // ==========================================

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // ==========================================
  // AUTH STORE
  // ==========================================

  const user = useAuthStore((state) => state.user);

  const getCurrentUser = useAuthStore(
    (state) => state.getCurrentUser
  );

  const uploadFile = useAuthStore(
    (state) => state.uploadFile
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  useEffect(() => {
    if (!user) {
      getCurrentUser();
    }
  }, [user, getCurrentUser]);

  // ==========================================
  // OPEN FILE PICKER FROM NEW FILE
  // ==========================================

  useEffect(() => {
    const newFile = searchParams.get("newFile");

    if (newFile !== "true") return;

    // Wait until the file input is available
    const timer = setTimeout(() => {
      if (fileInputRef.current && !isLoading) {
        // Open the browser file picker
        fileInputRef.current.click();
      }

      // Remove ?newFile=true from the URL
      // without causing another page navigation
      setSearchParams({}, { replace: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, setSearchParams, isLoading]);

  // ==========================================
  // USER INFORMATION
  // ==========================================

  const displayName =
    user?.onboarding?.displayName ||
    user?.name ||
    "User";

  // ==========================================
  // GET USER BRAND COLOR
  // ==========================================

  const selectedBrandColor =
    user?.onboarding?.brandColor || "purple";

  const brandColor =
    brandColors.find(
      (item) => item.id === selectedBrandColor
    )?.color || "#A855F7";

  // ==========================================
  // BROWSE FILES
  // ==========================================

  const handleBrowseClick = () => {
    if (selectedFile || isLoading) return;

    fileInputRef.current?.click();
  };

  // ==========================================
  // HANDLE FILE CHANGE
  // ==========================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setUploadSuccess("");

    // ==========================================
    // CHECK PDF
    // ==========================================

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    // ==========================================
    // CHECK FILE SIZE
    // ==========================================

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "File is too large. Please select a PDF smaller than 25MB."
      );

      event.target.value = "";
      return;
    }

    // ==========================================
    // SET SELECTED FILE
    // ==========================================

    setSelectedFile(file);
  };

  // ==========================================
  // DELETE FILE
  // ==========================================

  const handleDeleteFile = () => {
    if (isLoading) return;

    setSelectedFile(null);
    setError("");
    setUploadSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // UPLOAD FILE
  // ==========================================

  const handleUploadFile = async () => {
    if (!selectedFile || isLoading) return;

    setError("");
    setUploadSuccess("");

    try {
      const result = await uploadFile(selectedFile);

      console.log("Upload result:", result);

      // ==========================================
      // UPLOAD FAILED
      // ==========================================

      if (!result?.success) {
        setError(
          result?.message ||
            "Failed to upload PDF."
        );

        return;
      }

      // ==========================================
      // NO FILE ID
      // ==========================================

      if (!result?.fileId) {
        setError(
          "PDF uploaded successfully, but no file ID was returned."
        );

        return;
      }

      // ==========================================
      // FILE ID
      // ==========================================

      console.log("File ID:", result.fileId);

      setUploadSuccess(
        "PDF uploaded successfully!"
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // ==========================================
      // NAVIGATE TO READING PAGE
      // ==========================================

      navigate(
        `/dashboard/reading?fileId=${encodeURIComponent(
          result.fileId
        )}`
      );
    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error?.message ||
          "Something went wrong while uploading the PDF."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="
        relative
        flex
        min-h-full
        w-full
        flex-col
        items-center
        justify-center
        px-4
        py-8
        sm:px-6
        sm:py-10
        md:px-7
        md:py-12
      "
    >
      {/* ==========================================
          THEME TOGGLE
      ========================================== */}

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

      {/* ==========================================
          SONAR ORB
      ========================================== */}

      <div
        className="
          mb-6
          flex
          items-center
          justify-center
          sm:mb-7
          md:mb-8
        "
      >
        <video
          src={assets.sonarOrb}
          autoPlay
          loop
          muted
          playsInline
          aria-label="Sonar"
          className="
            h-auto
            w-[160px]
            object-contain
            sm:w-[180px]
            md:w-[200px]
          "
        />
      </div>

      {/* ==========================================
          WELCOME TEXT
      ========================================== */}

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
        {isLoading && !user
          ? "Welcome..."
          : `Welcome, ${displayName}`}
      </h1>

      <p
        className="
          mb-8
          px-2
          text-center
          text-[13px]
          text-gray-500
          sm:mb-10
          sm:text-[14px]
          dark:text-gray-400
        "
      >
        What PDF would you like to listen to today?
      </p>

      {/* ==========================================
          UPLOAD AREA
      ========================================== */}

      <div
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
      >
        {/* ==========================================
            CLOUD ICON
        ========================================== */}

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
            backgroundColor: `${brandColor}15`,
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke={brandColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V8" />
            <path d="M9 11l3-3 3 3" />
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
          </svg>
        </div>

        {/* ==========================================
            HEADING
        ========================================== */}

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
          Upload a PDF to get started
        </p>

        {/* ==========================================
            BROWSE
        ========================================== */}

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
          {selectedFile ? (
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
                  hover:underline
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                style={{
                  color: brandColor,
                }}
              >
                Browse files
              </button>
            </>
          )}
        </p>

        {/* ==========================================
            FILE INPUT
        ========================================== */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={!!selectedFile || isLoading}
        />

        {/* ==========================================
            FILE SIZE
        ========================================== */}

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

        {/* ==========================================
            ERROR
        ========================================== */}

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

        {/* ==========================================
            SUCCESS
        ========================================== */}

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
              color: brandColor,
            }}
          >
            {uploadSuccess}
          </p>
        )}

        {/* ==========================================
            SELECTED FILE
        ========================================== */}

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
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>

              {/* ==========================================
                  DELETE BUTTON
              ========================================== */}

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

            {/* ==========================================
                UPLOAD BUTTON
            ========================================== */}

            <button
              type="button"
              onClick={handleUploadFile}
              disabled={isLoading}
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
                backgroundColor: brandColor,
              }}
            >
              {isLoading
                ? "Uploading PDF..."
                : "Upload PDF"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;