import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SonarOrb from "../components/SonarOrb";
import Visualizer from "../components/Visualizer";
import { assets } from "../assets/assets.js";


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
    color: "#3B82F6",
    label: "Blue",
  },
  {
    id: "beige",
    color: "#E7D5B8",
    label: "Beige",
  },
  {
    id: "maroon",
    color: "#9F1239",
    label: "Maroon",
  },
  {
    id: "green",
    color: "#22C55E",
    label: "Green",
  },
];


// ============================================================
// ONBOARDING PAGE
// ============================================================

const OnboardingPage = () => {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [name, setName] = useState("");
  const [voice, setVoice] = useState("male");
  const [accent, setAccent] = useState("american");
  const [brandColor, setBrandColor] = useState("purple");


  // ==========================================================
  // ACTIVE BRAND COLOR
  // ==========================================================

  const activeColor =
    brandColors.find((color) => color.id === brandColor)?.color ||
    "#A855F7";


  // ==========================================================
  // CONTINUE
  // ==========================================================

  const handleContinue = () => {
    if (!name.trim()) return;

    const preferences = {
      name: name.trim(),
      preferredVoiceGender: voice,
      preferredAccent: accent,
      brandColor,
    };

    console.log(preferences);

    // For now, navigate directly to dashboard
    navigate("/dashboard");
  };


  // ==========================================================
  // UI
  // ==========================================================

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
            justify-center
            px-4
            py-10

            sm:px-6

            md:px-10

            lg:w-[48%]
            lg:px-8
            lg:py-12

            xl:px-12
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
                mb-8
                flex
                items-center
                gap-2

                sm:mb-9

                lg:mb-8
              "
            >

              {/* Logo icon */}

              <div
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-purple-500
                  to-violet-600

                  sm:h-8
                  sm:w-8
                "
              >

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="
                    h-3.5
                    w-3.5

                    sm:h-4
                    sm:w-4
                  "
                >
                  <path d="M2 10v4" />
                  <path d="M6 6v12" />
                  <path d="M10 3v18" />
                  <path d="M14 8v8" />
                  <path d="M18 5v14" />
                  <path d="M22 10v4" />
                </svg>

              </div>


              {/* Logo text */}

              <span
                className="
                  text-[15px]
                  font-semibold
                  text-gray-900

                  sm:text-[17px]
                "
              >
                Sonar
              </span>

            </div>


            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mb-8 sm:mb-9">

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

            <div className="mb-7 sm:mb-8">

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
                className="
                  h-10
                  w-full
                  rounded-lg
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

                  focus:border-purple-400
                  focus:ring-2
                  focus:ring-purple-100

                  sm:h-11
                  sm:px-4
                  sm:text-[13px]
                "
              />

            </div>


            {/* =================================================
                VOICE MODEL
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


              {/* Voice buttons */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2

                  sm:gap-3
                "
              >

                {/* =================================================
                    MALE
                ================================================= */}

                <button
                  type="button"
                  onClick={() => setVoice("male")}
                  className={`
                    relative
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    text-[12px]
                    font-medium
                    transition

                    sm:h-[48px]
                    sm:px-4
                    sm:text-[13px]

                    lg:h-[52px]
                    lg:px-5
                    lg:text-[14px]

                    ${
                      voice === "male"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "border border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
                    }
                  `}
                  style={
                    voice === "male"
                      ? {
                          border: `1.5px solid ${activeColor}`,
                        }
                      : {}
                  }
                >

                  <span>Male</span>


                  {voice === "male" && (
                    <SelectionIcon color={activeColor} />
                  )}

                </button>


                {/* =================================================
                    FEMALE
                ================================================= */}

                <button
                  type="button"
                  onClick={() => setVoice("female")}
                  className={`
                    relative
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    px-3
                    text-[12px]
                    font-medium
                    transition

                    sm:h-[48px]
                    sm:px-4
                    sm:text-[13px]

                    lg:h-[52px]
                    lg:px-5
                    lg:text-[14px]

                    ${
                      voice === "female"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "border border-gray-200 bg-white/70 text-gray-600 hover:border-gray-300"
                    }
                  `}
                  style={
                    voice === "female"
                      ? {
                          border: `1.5px solid ${activeColor}`,
                        }
                      : {}
                  }
                >

                  <span>Female</span>


                  {voice === "female" && (
                    <SelectionIcon color={activeColor} />
                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                ACCENT
            ================================================= */}

            <div className="mb-7 sm:mb-8">

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


              {/* Accent cards */}

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
                      className={`
                        relative
                        flex
                        min-w-0
                        flex-col
                        items-start
                        rounded-lg
                        border
                        bg-white/80
                        px-2
                        pb-3
                        pt-2.5
                        text-left
                        transition

                        sm:rounded-xl
                        sm:px-3
                        sm:pb-3.5
                        sm:pt-3

                        ${
                          selected
                            ? "bg-white shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      style={
                        selected
                          ? {
                              border: `1.5px solid ${activeColor}`,
                            }
                          : {}
                      }
                    >

                      {/* =========================================
                          FLAG
                          
                          The flag and tick are both positioned
                          from the same top reference.
                      ========================================= */}

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


                      {/* =========================================
                          ACCENT LABEL
                      ========================================= */}

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


                      {/* =========================================
                          ACCENT SUBTEXT
                      ========================================= */}

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


                      {/* =========================================
                          SELECTION TICK

                          SAME TOP LEVEL AS FLAG
                      ========================================= */}

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

            <div className="mb-8 sm:mb-10">

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


              {/* Color options */}

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
                      className="
                        group
                        flex
                        flex-col
                        items-center
                      "
                    >

                      {/* Color circle */}

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

                      
                      {/* Color label */}

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
                CONTINUE BUTTON
            ================================================= */}

            <button
              type="button"
              onClick={handleContinue}
              disabled={!name.trim()}
              className="
                h-10
                w-full
                rounded-lg
                bg-black
                text-[12px]
                font-medium
                text-white
                transition

                hover:bg-gray-900

                disabled:cursor-not-allowed
                disabled:opacity-40

                sm:h-11
                sm:w-[140px]
                sm:text-[13px]

                lg:w-[150px]
              "
            >
              Continue
            </button>

          </div>

        </section>


        {/* ====================================================
            RIGHT SIDE - SONAR ORB + VISUALIZER

            hidden = mobile/tablet
            lg:flex = desktop and above
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
                w-[210px]

                xl:w-[230px]
              "
            >
              <SonarOrb />
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
        <path
          d="M5 12l5 5L20 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

    </span>
  );
};


export default OnboardingPage;