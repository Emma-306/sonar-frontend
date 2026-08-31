import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Visualizer from "../components/Visualizer";
import { assets } from "../assets/assets.js";
import useAuthStore from "../stores/authStore.js";

// ============================================================
// ACCENTS
// ============================================================

const accents = [
  {
    id: "nigerian",
    label: "Nigerian English",
    flag: "🇳🇬",
  },
  {
    id: "british",
    label: "British English",
    flag: "🇬🇧",
  },
  {
    id: "american",
    label: "American English",
    flag: "🇺🇸",
  },
];

// ============================================================
// BRAND COLORS
// ============================================================

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

// ============================================================
// ONBOARDING PAGE
// ============================================================

const OnboardingPage = () => {
  const navigate = useNavigate();

  // ==========================================================
  // AUTH STORE
  // ==========================================================

  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const previewVoice = useAuthStore((state) => state.previewVoice);

  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);

  // ==========================================================
  // STATE
  // ==========================================================

  const [name, setName] = useState("");
  const [voice, setVoice] = useState(null);
  const [accent, setAccent] = useState(null);
  const [brandColor, setBrandColor] = useState("purple");
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [voicePreviewError, setVoicePreviewError] = useState("");
  const previewAudioRef = useRef(null);

  // ==========================================================
  // ACTIVE BRAND COLOR
  // ==========================================================

  const activeColor =
    brandColors.find((color) => color.id === brandColor)?.color || "#A855F7";

  // ==========================================================
  // FORM VALIDATION
  // ==========================================================

  const canContinue = name.trim() !== "" && voice !== null && accent !== null;

  // ==========================================================
  // PREVIEW VOICE
  // ==========================================================

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.src = "";
      }
    };
  }, []);

  const handleVoicePreview = async () => {
    if (!voice || !accent) {
      return;
    }

    setVoicePreviewError("");
    setIsPreviewingVoice(true);

    const result = await previewVoice({
      accent,
      gender: voice,
      text: "Hello there",
    });

    if (!result.success) {
      setVoicePreviewError(result.message || "Failed to preview voice.");
      setIsPreviewingVoice(false);
      return;
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.src = result.audioUrl;
      previewAudioRef.current.load();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current.play().catch(() => {
        setVoicePreviewError("Your browser blocked the preview audio.");
      });
    }

    setIsPreviewingVoice(false);
  };

  // ==========================================================
  // COMPLETE ONBOARDING
  // ==========================================================

  const handleContinue = async () => {
    if (!canContinue || isLoading) return;

    const preferences = {
      name: name.trim(),
      preferredVoiceGender: voice,
      preferredAccent: accent,
      brandColor,
    };

    console.log("Submitting onboarding preferences:", preferences);

    // Send onboarding data to backend
    const result = await completeOnboarding(preferences);

    console.log("Onboarding result:", result);

    // Only go to dashboard if backend succeeds
    if (result.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* ======================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <img
        src={assets.backgroundImage}
        alt=""
        aria-hidden="true"
        className="
          fixed
          inset-0
          h-full
          w-full
          object-cover
        "
      />

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex min-h-screen w-full">
        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <section
          className="
            flex
            min-h-screen
            w-full
            flex-col
            justify-start
            px-4
            pt-8
            pb-10

            sm:px-6
            sm:pt-10

            md:px-10
            md:pt-12

            lg:w-[48%]
            lg:px-8
            lg:pt-10

            xl:px-12
            xl:pt-12
          "
        >
          {/* ==================================================
              FORM CONTAINER
          ================================================== */}

          <div
            className="
              mx-auto
              w-full
              max-w-[420px]

              lg:mx-0
              lg:ml-[8%]
              lg:max-w-[390px]

              xl:ml-[12%]
              xl:max-w-[420px]
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-2

                sm:mb-7
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-purple-500
                  to-violet-600
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="h-6 w-6"
                >
                  <path d="M2 10v4" />
                  <path d="M6 6v12" />
                  <path d="M10 3v18" />
                  <path d="M14 8v8" />
                  <path d="M18 5v14" />
                  <path d="M22 10v4" />
                </svg>
              </div>

              <span
                className="
                  font-semibold
                  text-gray-900
                  sm:text-[19px]
                "
              >
                Sonar
              </span>
            </div>

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mb-6 sm:mb-7">
              <h1
                className="
                  text-[28px]
                  font-bold
                  leading-tight
                  tracking-tight
                  text-gray-900
                  sm:text-[30px]
                  lg:text-[32px]
                "
              >
                Preferences
              </h1>

              <p
                className="
                  mt-1
                  text-[13px]
                  text-gray-500
                  sm:text-[14px]
                "
              >
                Customize your experience
              </p>
            </div>

            {/* =================================================
                NAME
            ================================================= */}

            <div className="mb-6 sm:mb-7">
              <label
                htmlFor="preferred-name"
                className="
                  mb-2
                  block
                  text-[12px]
                  font-semibold
                  text-gray-900
                  sm:text-[13px]
                "
              >
                What would you like to be called?
              </label>

              <input
                id="preferred-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your preferred name"
                disabled={isLoading}
                className="
                  h-10
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white/80
                  px-3
                  text-[12px]
                  text-gray-900
                  outline-none
                  backdrop-blur-sm
                  transition
                  placeholder:text-gray-400

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  sm:h-11
                  sm:px-4
                  sm:text-[13px]
                "
                style={{
                  borderColor: name ? activeColor : undefined,
                  boxShadow: name ? `0 0 0 2px ${activeColor}20` : undefined,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = activeColor;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${activeColor}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = name
                    ? activeColor
                    : "#e5e7eb";

                  e.currentTarget.style.boxShadow = name
                    ? `0 0 0 2px ${activeColor}20`
                    : "none";
                }}
              />
            </div>

            {/* =================================================
                VOICE MODEL
            ================================================= */}

            <div className="mb-6 sm:mb-7">
              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-gray-900
                  sm:text-[14px]
                  lg:text-[15px]
                "
              >
                Choose your voice model
              </h2>

              <p
                className="
                  mt-1
                  mb-3
                  text-[10px]
                  leading-relaxed
                  text-gray-500
                  sm:text-[11px]
                  lg:text-[12px]
                "
              >
                Choose a voice and accent to personalize your experience.
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:gap-3
                "
              >
                {/* MALE */}

                <button
                  type="button"
                  onClick={() => setVoice("male")}
                  disabled={isLoading}
                  className={`
                    relative
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    px-3
                    text-[12px]
                    font-medium
                    transition

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    sm:h-[48px]
                    sm:px-4
                    sm:text-[13px]

                    lg:h-[52px]
                    lg:px-5
                    lg:text-[14px]

                    ${
                      voice === "male"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
                    }
                  `}
                  style={
                    voice === "male"
                      ? {
                          border: `1.5px solid ${activeColor}`,
                          boxShadow: `0 0 0 2px ${activeColor}15`,
                        }
                      : {}
                  }
                >
                  <span>Male</span>

                  {voice === "male" && <SelectionIcon color={activeColor} />}
                </button>

                {/* FEMALE */}

                <button
                  type="button"
                  onClick={() => setVoice("female")}
                  disabled={isLoading}
                  className={`
                    relative
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    px-3
                    text-[12px]
                    font-medium
                    transition

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    sm:h-[48px]
                    sm:px-4
                    sm:text-[13px]

                    lg:h-[52px]
                    lg:px-5
                    lg:text-[14px]

                    ${
                      voice === "female"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
                    }
                  `}
                  style={
                    voice === "female"
                      ? {
                          border: `1.5px solid ${activeColor}`,
                          boxShadow: `0 0 0 2px ${activeColor}15`,
                        }
                      : {}
                  }
                >
                  <span>Female</span>

                  {voice === "female" && <SelectionIcon color={activeColor} />}
                </button>
              </div>
            </div>

            {/* =================================================
                ACCENT
            ================================================= */}

            <div className="mb-6 sm:mb-7">
              <h2
                className="
                  mb-3
                  text-[13px]
                  font-semibold
                  text-gray-900
                  sm:text-[14px]
                  lg:text-[15px]
                "
              >
                Select Accent
              </h2>

              {voice && accent && (
                <div className="mb-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVoicePreview}
                    disabled={isLoading}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-[10px]
                      font-medium
                      transition
                      sm:text-[11px]
                    "
                    style={{
                      borderColor: activeColor,
                      color: activeColor,
                      backgroundColor: `${activeColor}12`,
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M3 10v4h4l5 5V5L7 10H3Zm13.5 2a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12ZM15 3.23v2.06A7 7 0 0 1 19 12a7 7 0 0 1-4 6.71v2.06A9 9 0 0 0 21 12a9 9 0 0 0-6-8.77Z" />
                    </svg>
                    {isPreviewingVoice ? "Playing..." : "Preview: Hello there"}
                  </button>
                </div>
              )}

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                  sm:gap-3
                "
              >
                {accents.map((item) => {
                  const selected = accent === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAccent(item.id)}
                      disabled={isLoading}
                      className={`
                        relative
                        flex
                        min-w-0
                        flex-col
                        items-start
                        rounded-xl
                        border
                        bg-white/80
                        px-2
                        pb-3
                        pt-2.5
                        text-left
                        transition

                        disabled:cursor-not-allowed
                        disabled:opacity-60

                        sm:px-3
                        sm:pb-3.5
                        sm:pt-3

                        ${
                          selected
                            ? "bg-white text-gray-900 shadow-sm"
                            : "border-gray-200 text-gray-800 hover:border-gray-300"
                        }
                      `}
                      style={
                        selected
                          ? {
                              border: `1.5px solid ${activeColor}`,
                              boxShadow: `0 0 0 2px ${activeColor}15`,
                            }
                          : {}
                      }
                    >
                      <span
                        className="
                          block
                          text-[15px]
                          leading-none
                          sm:text-[17px]
                          lg:text-[18px]
                        "
                      >
                        {item.flag}
                      </span>

                      <span
                        className="
                          mt-2
                          block
                          max-w-full
                          truncate
                          text-[9px]
                          font-semibold
                          leading-tight
                          text-gray-800
                          sm:text-[10px]
                          lg:text-[11px]
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          mt-0.5
                          text-[8px]
                          text-gray-400
                          sm:text-[9px]
                          lg:text-[10px]
                        "
                      >
                        Accent
                      </span>

                      {selected && (
                        <span
                          className="
                            absolute
                            right-2
                            top-2
                            flex
                            h-4
                            w-4
                            items-center
                            justify-center
                            rounded-full
                            sm:right-2.5
                            sm:top-2.5
                          "
                          style={{
                            backgroundColor: activeColor,
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            className="h-2.5 w-2.5"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                BRAND COLOR
            ================================================= */}

            <div className="mb-7 sm:mb-8">
              <h2
                className="
                  text-[13px]
                  font-semibold
                  text-gray-900
                  sm:text-[14px]
                  lg:text-[15px]
                "
              >
                Brand color
              </h2>

              <p
                className="
                  mt-1
                  mb-3
                  text-[10px]
                  text-gray-500
                  sm:text-[11px]
                  lg:text-[12px]
                "
              >
                Select your brand color
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  items-start
                  gap-x-4
                  gap-y-3
                  sm:gap-x-5
                "
              >
                {brandColors.map((item) => {
                  const selected = brandColor === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBrandColor(item.id)}
                      disabled={isLoading}
                      className="
                        group
                        flex
                        flex-col
                        items-center
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          transition

                          sm:h-9
                          sm:w-9

                          ${
                            selected
                              ? "ring-2 ring-offset-2"
                              : "group-hover:scale-105"
                          }
                        `}
                        style={{
                          backgroundColor: item.color,
                          ...(selected
                            ? {
                                boxShadow: `0 0 0 2px white, 0 0 0 4px ${item.color}`,
                              }
                            : {}),
                        }}
                      />

                      <span
                        className="
                          mt-1.5
                          text-[9px]
                          text-gray-500
                          sm:text-[10px]
                        "
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {authError && (
              <div
                className="
                  mb-4
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2.5
                  text-[11px]
                  text-red-600
                "
              >
                {authError}
              </div>
            )}

            {voicePreviewError && (
              <div
                className="
                  mb-4
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-2.5
                  text-[11px]
                  text-red-600
                "
              >
                {voicePreviewError}
              </div>
            )}

            <audio ref={previewAudioRef} preload="auto" />

            {/* =================================================
                CONTINUE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || isLoading}
              className="
                flex
                h-10
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                text-[12px]
                font-medium
                text-white
                transition
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:h-11
                sm:w-[140px]
                sm:text-[13px]
                lg:w-[150px]
              "
              style={
                canContinue && !isLoading
                  ? {
                      backgroundColor: activeColor,
                      boxShadow: `0 10px 22px ${activeColor}55`,
                    }
                  : { backgroundColor: "#000000" }
              }
            >
              {isLoading ? (
                <>
                  <span
                    className="
                      h-3.5
                      w-3.5
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    "
                  />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </section>

        {/* ====================================================
            RIGHT SIDE - SONAR ORB + VISUALIZER
        ==================================================== */}

        <section
          className="
            relative
            hidden
            w-[52%]
            flex-col
            items-center
            justify-center
            lg:flex
          "
        >
          <div
            className="
              flex
              -translate-x-[2%]
              -translate-y-[2%]
              flex-col
              items-center
              justify-center
              xl:-translate-x-[3%]
            "
          >
            {/* =================================================
                SONAR ORB
            ================================================= */}

            <div
              className="
                flex
                w-[240px]
                items-center
                justify-center
                xl:w-[270px]
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
                  block
                  h-auto
                  w-full
                  object-contain
                "
              />
            </div>

            {/* =================================================
                VISUALIZER
            ================================================= */}

            <div className="-mt-[3px]">
              <Visualizer isPlaying={true} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

// ============================================================
// SELECTION ICON
// ============================================================

const SelectionIcon = ({ color }) => {
  return (
    <span
      className="
        flex
        h-4
        w-4
        items-center
        justify-center
        rounded-full
      "
      style={{
        backgroundColor: color,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        className="h-2.5 w-2.5"
      >
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

export default OnboardingPage;
