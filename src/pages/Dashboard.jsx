import { useRef, useState } from "react";
import SonarOrb from "../components/SonarOrb.jsx";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const Dashboard = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleBrowseClick = () => {
    // Don't allow another file if one is already selected
    if (selectedFile) return;

    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    // Check if file is a PDF
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Please select a PDF smaller than 25MB.");
      event.target.value = "";
      return;
    }

    // File passed validation
    setSelectedFile(file);

    console.log("Selected file:", file);
    console.log("File size:", file.size, "bytes");
  };

  // Delete selected PDF
  const handleDeleteFile = () => {
    setSelectedFile(null);
    setError("");

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-7 md:py-12">
      {/* Sonar Orb */}
      <div className="mb-6 sm:mb-7 md:mb-8">
        <SonarOrb />
      </div>

      {/* Welcome text */}
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
        Welcome, Alex
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
        What would you like to do today?
      </p>

      {/* Upload area */}
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
        {/* Cloud upload icon */}
        <div
          className="
            mb-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-blue-50
            sm:h-11
            sm:w-11
            dark:bg-blue-500/10
          "
        >
          <svg
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V8" />
            <path d="M9 11l3-3 3 3" />
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
          </svg>
        </div>

        {/* Upload heading */}
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

        {/* Browse text */}
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
                className="
                  cursor-pointer
                  font-medium
                  text-blue-500
                  hover:underline
                "
              >
                Browse files
              </button>
            </>
          )}
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={!!selectedFile}
        />

        {/* File size information */}
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

        {/* Error message */}
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

        {/* Selected file */}
        {selectedFile && !error && (
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
            {/* File information */}
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

            {/* Delete button */}
            <button
              type="button"
              onClick={handleDeleteFile}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;