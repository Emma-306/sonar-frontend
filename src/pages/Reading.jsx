import React, { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Reading = () => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(154);
  const [duration, setDuration] = useState(728);

  // ============================================================
  // PLAYBACK SPEED
  // ============================================================

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // ============================================================
  // AUDIO EVENTS
  // ============================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);

      videoRef.current?.play().catch(() => {});
    };

    const handlePause = () => {
      setIsPlaying(false);

      videoRef.current?.pause();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);

      videoRef.current?.pause();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();

        videoRef.current?.play().catch(() => {});
      } else {
        audio.pause();

        videoRef.current?.pause();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  // ============================================================
  // SPEED
  // ============================================================

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];

    const index = speeds.indexOf(speed);

    setSpeed(speeds[(index + 1) % speeds.length]);
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (time) => {
    if (!Number.isFinite(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // ============================================================
  // SEEK
  // ============================================================

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setCurrentTime(newTime);
  };

  // ============================================================
  // SKIP BACKWARD
  // ============================================================

  const skipBackward = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 10
    );
  };

  // ============================================================
  // SKIP FORWARD
  // ============================================================

  const skipForward = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = Math.min(
      duration,
      audioRef.current.currentTime + 10
    );
  };

  // ============================================================
  // RESTART
  // ============================================================

  const restartAudio = async () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    try {
      await audioRef.current.play();

      videoRef.current?.play().catch(() => {});
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress =
    duration > 0
      ? Math.min((currentTime / duration) * 100, 100)
      : 0;

  return (
    <div
      className="
        relative
        flex
        h-screen
        w-full
        flex-1
        flex-col
        overflow-hidden
        bg-[#F8F9FB]
        dark:bg-[#111113]
      "
    >
      {/* ======================================================
          THEME TOGGLE
      ====================================================== */}

      <div className="absolute right-8 top-5 z-50">
        <ThemeToggle />
      </div>

      {/* ======================================================
          MAIN READING AREA
      ====================================================== */}

      <main
        className="
          flex
          min-h-0
          flex-1
          items-stretch
          justify-center
          overflow-hidden
          px-8
          pb-[105px]
          pt-[55px]
          xl:px-10
        "
      >
        {/* ====================================================
            MAIN CONTENT WRAPPER

            flex-1 makes this take all remaining vertical space.
        ==================================================== */}

        <div
          className="
            flex
            min-h-0
            w-full
            max-w-[1250px]
            flex-1
            flex-col
            gap-7
            lg:flex-row
          "
        >
          {/* ==================================================
              ARTICLE / TEXT CARD
          ================================================== */}

          <article
            className="
              min-h-0
              min-w-0
              flex-1
              overflow-y-auto
              rounded-[18px]
              bg-[#F7F7F7]
              px-9
              py-8
              dark:bg-[#1C1C1E]
              xl:px-10
              xl:py-9
            "
          >
            <h1
              className="
                mb-6
                max-w-[720px]
                text-[25px]
                font-bold
                leading-[1.15]
                tracking-[-0.5px]
                text-[#111111]
                dark:text-white
              "
            >
              The Impact of Artificial Intelligence on Modern
              Healthcare
            </h1>

            <div
              className="
                max-w-[760px]
                space-y-[17px]
                text-[15px]
                leading-[1.62]
                text-[#5C5C5C]
                dark:text-[#D0D0D0]
              "
            >
              <p>
                Artificial Intelligence (AI) has emerged as an
                exceptionally powerful tool in contemporary clinical
                settings, fundamentally altering diagnosis, treatment
                protocols, and workflow automation. From automated
                billing pipelines to sophisticated diagnostic imaging
                assistants, machines now perform tasks that once
                required years of specialized medical training.
              </p>

              <p>
                Perhaps the most significant breakthrough lies in deep
                learning systems trained on millions of clinical
                records.{" "}
                <span className="font-semibold text-[#873BFF]">
                  These models can identify subtle patterns in
                  multi-modal datasets—such as medical images, genome
                  sequences, and laboratory histories—to predict
                  patient outcomes before symptoms even manifest.
                </span>{" "}
                Over the next decade, clinical validation studies will
                determine whether these algorithms can successfully
                transition from laboratory environments into
                widespread real-world deployment.
              </p>

              <p>
                However, despite these advances, several hurdles
                prevent immediate widespread clinical adoption.
                Foremost among these is the challenge of algorithm
                explainability. Clinicians must understand not just
                the statistical probability of a diagnostic output,
                but the underlying biological drivers that led the
                machine to its conclusion.
              </p>
            </div>
          </article>

          {/* ==================================================
              CURRENTLY READING CARD
          ================================================== */}

          <aside
            className="
              flex
              min-h-0
              w-full
              shrink-0
              flex-col
              items-center
              rounded-[18px]
              bg-[#F7F7F7]
              px-8
              py-7
              dark:bg-[#1C1C1E]
              lg:h-full
              lg:w-[390px]
            "
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex w-full items-center justify-between">
              <h2
                className="
                  text-[17px]
                  font-semibold
                  text-[#171717]
                  dark:text-white
                "
              >
                Currently Reading
              </h2>

              <button
                type="button"
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  text-[#AAAAAA]
                "
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>

            {/* =================================================
                ORB
            ================================================= */}

            <div className="relative mb-5 h-[180px] w-[180px] shrink-0">
              <div
                className="
                  absolute
                  inset-0
                  scale-[1.1]
                  rounded-full
                  bg-[#8B3DFF]/20
                  blur-[32px]
                "
              />

              <video
                ref={videoRef}
                src={assets.sonarOrb}
                autoPlay
                loop
                muted
                playsInline
                className="
                  relative
                  z-10
                  h-full
                  w-full
                  object-contain
                "
              />

              <audio
                ref={audioRef}
                src={assets.sonarAudio}
                preload="metadata"
              />
            </div>

            {/* =================================================
                NARRATOR
            ================================================= */}

            <p
              className="
                mb-8
                shrink-0
                text-[12px]
                text-[#777777]
                dark:text-[#999999]
              "
            >
              Narrator:{" "}
              <span className="font-medium text-[#3F3F3F] dark:text-white">
                Helen (NGA)
              </span>
            </p>

            {/* =================================================
                CONTROLS CONTENT

                flex-1 makes this section take the remaining
                vertical space inside the card.
            ================================================= */}

            <div
              className="
                flex
                w-full
                min-h-0
                flex-1
                flex-col
              "
            >
              {/* =================================================
                  SPEED / VOLUME
              ================================================= */}

              <div className="mb-3 flex w-full items-center justify-between">
                {/* SPEED */}

                <div className="flex items-center gap-2">
                  <span
                    className="
                      text-[12px]
                      text-[#666666]
                      dark:text-[#AAAAAA]
                    "
                  >
                    Speed:
                  </span>

                  <button
                    type="button"
                    onClick={changeSpeed}
                    className="
                      flex
                      h-[29px]
                      items-center
                      rounded-[6px]
                      border
                      border-[#D5D5D5]
                      bg-white
                      px-3
                      text-[12px]
                      font-medium
                      text-[#333333]
                      dark:border-white/10
                      dark:bg-white/5
                      dark:text-white
                    "
                  >
                    {speed}x
                  </button>
                </div>

                {/* VOLUME */}

                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[#9AA7B8]"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3Z" />

                    <path d="M16.5 8.5a1 1 0 0 0-1.4 1.4A3 3 0 0 1 16 12a3 3 0 0 1-.9 2.1 1 1 0 1 0 1.4 1.4A5 5 0 0 0 18 12a5 5 0 0 0-1.5-3.5Z" />

                    <path d="M19.3 5.7a1 1 0 0 0-1.4 1.4A7 7 0 0 1 20 12a7 7 0 0 1-2.1 4.9 1 1 0 1 0 1.4 1.4A9 9 0 0 0 22 12a9 9 0 0 0-2.7-6.3Z" />
                  </svg>

                  <div className="h-[4px] w-[65px] rounded-full bg-[#D8DDE3]">
                    <div className="h-full w-[74%] rounded-full bg-[#7A8798]" />
                  </div>
                </div>
              </div>

              {/* =================================================
                  PROGRESS BAR
              ================================================= */}

              <div className="w-full">
                <div
                  className="
                    relative
                    h-[5px]
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-[#D8DDE3]
                  "
                >
                  <div
                    className="
                      absolute
                      left-0
                      top-0
                      h-full
                      rounded-full
                      bg-[#56677D]
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      cursor-pointer
                      appearance-none
                      opacity-0
                    "
                  />
                </div>

                {/* TIME */}

                <div
                  className="
                    mt-2
                    flex
                    justify-between
                    text-[10px]
                    text-[#999999]
                  "
                >
                  <span>{formatTime(currentTime)}</span>

                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* =================================================
                  CONTROLS

                  Immediately after progress bar.
              ================================================= */}

              <div className="mt-3 flex items-center justify-center gap-3">
                {/* BACKWARD */}

                <button
                  type="button"
                  onClick={skipBackward}
                  className="
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-[8px]
                    border
                    border-[#D5D8DD]
                    text-[#8C9BAE]
                    transition
                    hover:bg-[#F0F1F3]
                    dark:border-white/10
                    dark:hover:bg-white/5
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 14L5 10l4-4" />

                    <path d="M5 10h8a5 5 0 0 1 5 5v1" />
                  </svg>
                </button>

                {/* FORWARD */}

                <button
                  type="button"
                  onClick={skipForward}
                  className="
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-[8px]
                    border
                    border-[#D5D8DD]
                    text-[#8C9BAE]
                    transition
                    hover:bg-[#F0F1F3]
                    dark:border-white/10
                    dark:hover:bg-white/5
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 14l4-4-4-4" />

                    <path d="M19 10h-8a5 5 0 0 0-5 5v1" />
                  </svg>
                </button>

                {/* PLAY / PAUSE */}

                <button
                  type="button"
                  onClick={togglePlay}
                  className="
                    flex
                    h-[50px]
                    w-[50px]
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-[#7145FF]
                    via-[#7549F4]
                    to-[#4D61E8]
                    text-white
                    shadow-[0_8px_22px_rgba(105,71,255,0.3)]
                    transition
                    hover:scale-[1.03]
                  "
                >
                  {isPlaying ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect
                        x="6"
                        y="5"
                        width="4"
                        height="14"
                        rx="1"
                      />

                      <rect
                        x="14"
                        y="5"
                        width="4"
                        height="14"
                        rx="1"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </button>

                {/* RESTART */}

                <button
                  type="button"
                  onClick={restartAudio}
                  className="
                    flex
                    h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-[8px]
                    border
                    border-[#D5D8DD]
                    text-[#8C9BAE]
                    transition
                    hover:bg-[#F0F1F3]
                    dark:border-white/10
                    dark:hover:bg-white/5
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 3-6.7" />

                    <path d="M3 4v6h6" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ======================================================
          BOTTOM PLAYER
      ====================================================== */}

      <div
        className="
          absolute
          bottom-5
          left-1/2
          z-40
          w-[calc(100%-60px)]
          max-w-[1250px]
          -translate-x-1/2
        "
      >
        <div
          className="
            flex
            h-[72px]
            items-center
            gap-5
            rounded-[14px]
            bg-[#252528]
            px-5
            text-white
            shadow-[0_8px_25px_rgba(0,0,0,0.15)]
          "
        >
          {/* ==================================================
              FILE ICON
          ================================================== */}

          <div
            className="
              flex
              h-[40px]
              w-[40px]
              shrink-0
              items-center
              justify-center
              rounded-[10px]
              bg-gradient-to-br
              from-[#7447FF]
              to-[#4D61E8]
            "
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />

              <path d="M14 2v6h6" />
            </svg>
          </div>

          {/* ==================================================
              FILE INFO
          ================================================== */}

          <div className="w-[170px] shrink-0">
            <p className="truncate text-[12px] font-medium">
              Research_Paper.pdf
            </p>

            <p className="mt-1 text-[9px] text-[#99999F]">
              Section 2 of 14 • {formatTime(currentTime)} /{" "}
              {formatTime(duration)}
            </p>
          </div>

          {/* ==================================================
              BOTTOM PROGRESS
          ================================================== */}

          <div className="mx-3 flex min-w-0 flex-1">
            <div className="h-[3px] w-full rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#626269]"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* ==================================================
              RIGHT INFORMATION
          ================================================== */}

          <div className="flex shrink-0 items-center gap-4">
            <span className="text-[10px] text-[#B4B4B8]">
              Helen (NGA)
            </span>

            <span className="rounded-[4px] bg-white/10 px-2 py-1 text-[9px]">
              {speed}x
            </span>

            <button
              type="button"
              onClick={togglePlay}
              className="
                text-[#9B9BA1]
                transition
                hover:text-white
              "
            >
              {isPlaying ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect
                    x="6"
                    y="5"
                    width="4"
                    height="14"
                    rx="1"
                  />

                  <rect
                    x="14"
                    y="5"
                    width="4"
                    height="14"
                    rx="1"
                  />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10-6.5a1 1 0 0 0 0-1.72l-10-6.5A1 1 0 0 0 8 5.5Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reading;