import { startTransition, useEffect, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle.jsx";
import useAuthStore from "../stores/authStore.js";
import { assets } from "../assets/assets.js";

const Reading = () => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [searchParams] = useSearchParams();

  const fileId = searchParams.get("fileId");

  // ============================================================
  // ZUSTAND
  // ============================================================

  const getFile = useAuthStore((state) => state.getFile);

  const getUserVoice = useAuthStore((state) => state.getUserVoice);

  const generateUserSpeech = useAuthStore((state) => state.generateUserSpeech);

  // ============================================================
  // STATE
  // ============================================================

  const [file, setFile] = useState(null);
  const [voice, setVoice] = useState(null);

  const [isLoadingFile, setIsLoadingFile] = useState(true);

  const [isLoadingVoice, setIsLoadingVoice] = useState(true);

  const [fileError, setFileError] = useState(null);
  const [voiceError, setVoiceError] = useState(null);

  const [audioUrl, setAudioUrl] = useState(null);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const [audioError, setAudioError] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.74);

  const [isMuted, setIsMuted] = useState(false);

  // ============================================================
  // RESOLVE AUDIO URL
  // ============================================================

  const resolveAudioUrl = (returnedAudioUrl) => {
    if (!returnedAudioUrl) {
      return null;
    }

    const cleanUrl = String(returnedAudioUrl).trim();

    // Cloudinary URL / any external URL
    if (
      cleanUrl.startsWith("http://") ||
      cleanUrl.startsWith("https://") ||
      cleanUrl.startsWith("blob:")
    ) {
      return cleanUrl;
    }

    // Fallback for old backend-relative URLs
    const backendUrl = import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://sonar-backend-s3rs.onrender.com";

    const normalizedPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;

    return `${backendUrl}${normalizedPath}`;
  };

  // ============================================================
  // LOAD FILE + USER VOICE
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const fetchReadingData = async () => {
      if (!fileId) {
        setFileError("No file ID was provided.");
        setIsLoadingFile(false);
        setIsLoadingVoice(false);
        return;
      }

      setIsLoadingFile(true);
      setIsLoadingVoice(true);

      setFileError(null);
      setVoiceError(null);

      try {
        const [fileResult, voiceResult] = await Promise.all([
          getFile(fileId),
          getUserVoice(),
        ]);

        if (!isMounted) {
          return;
        }

        // ======================================================
        // FILE
        // ======================================================

        if (fileResult?.success && fileResult?.file) {
          setFile(fileResult.file);
        } else {
          setFileError(fileResult?.message || "Failed to load the document.");
        }

        // ======================================================
        // VOICE
        // ======================================================

        if (voiceResult?.success && voiceResult?.voice) {
          setVoice(voiceResult.voice);
        } else {
          setVoiceError(
            voiceResult?.message || "Failed to load your selected voice.",
          );
        }
      } catch (error) {
        console.error("Failed to load reading data:", error);

        if (isMounted) {
          setFileError("Failed to load the document.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingFile(false);
          setIsLoadingVoice(false);
        }
      }
    };

    fetchReadingData();

    return () => {
      isMounted = false;
    };

    // Intentionally only triggered by fileId.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // ============================================================
  // GENERATE SPEECH
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const generateAudio = async () => {
      if (!file?.extractedText) {
        return;
      }

      if (!fileId) {
        setAudioError("No file ID is available for speech generation.");
        return;
      }

      // ========================================================
      // RESET OLD AUDIO
      // ========================================================

      setAudioUrl(null);
      setAudioError(null);
      startTransition(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      });
      setIsGeneratingAudio(true);

      try {
        console.log("Generating speech for file:", fileId);

        const result = await generateUserSpeech(file.extractedText, fileId);

        if (!isMounted) {
          return;
        }

        console.log("Speech generation result:", result);

        // ======================================================
        // GENERATION FAILED
        // ======================================================

        if (!result?.success) {
          setAudioError(result?.message || "Failed to generate speech.");

          return;
        }

        // ======================================================
        // CHECK AUDIO URL
        // ======================================================

        if (!result.audioUrl) {
          setAudioError("The backend did not return an audio URL.");

          console.error(
            "Backend speech response did not contain audioUrl:",
            result,
          );

          return;
        }

        // ======================================================
        // RESOLVE AUDIO URL
        // ======================================================

        const fullAudioUrl = resolveAudioUrl(result.audioUrl);

        console.log("Audio URL:", fullAudioUrl);

        setAudioUrl(fullAudioUrl);
      } catch (error) {
        console.error("Speech generation failed:", error);

        if (isMounted) {
          setAudioError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to generate speech.",
          );
        }
      } finally {
        if (isMounted) {
          setIsGeneratingAudio(false);
        }
      }
    };

    generateAudio();

    return () => {
      isMounted = false;
    };

    // Intentionally exclude Zustand action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.extractedText, fileId]);

  // ============================================================
  // VOICE DISPLAY NAME
  // ============================================================

  const getVoiceDisplayName = () => {
    if (!voice) {
      return "Loading...";
    }

    const accent = voice.accent
      ? voice.accent.charAt(0).toUpperCase() + voice.accent.slice(1)
      : "";

    const gender = voice.gender
      ? voice.gender.charAt(0).toUpperCase() + voice.gender.slice(1)
      : "";

    if (accent && gender) {
      return `${gender} (${accent})`;
    }

    if (accent) {
      return accent;
    }

    return "Selected Voice";
  };

  // ============================================================
  // LOAD AUDIO WHEN URL CHANGES
  // ============================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!audioUrl) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      startTransition(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      });

      return;
    }

    console.log("Loading audio:", audioUrl);

    audio.pause();

    startTransition(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    });

    audio.src = audioUrl;

    audio.load();

    return () => {
      audio.pause();
    };
  }, [audioUrl]);

  // ============================================================
  // AUDIO PLAY
  // ============================================================

  const handleAudioPlay = () => {
    console.log("Audio PLAY event");

    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // ============================================================
  // AUDIO PAUSE
  // ============================================================

  const handleAudioPause = () => {
    console.log("Audio PAUSE event");

    setIsPlaying(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // ============================================================
  // AUDIO TIME UPDATE
  // ============================================================

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setCurrentTime(audio.currentTime);
  };

  // ============================================================
  // AUDIO METADATA
  // ============================================================

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    console.log("Audio metadata loaded");
    console.log("Audio duration:", audio.duration);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  };

  // ============================================================
  // CAN PLAY
  // ============================================================

  const handleCanPlay = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    console.log("Audio can play");

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  };

  // ============================================================
  // DURATION CHANGE
  // ============================================================

  const handleDurationChange = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
  };

  // ============================================================
  // AUDIO ENDED
  // ============================================================

  const handleAudioEnded = () => {
    console.log("Audio ended");

    setIsPlaying(false);
    setCurrentTime(0);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = 0;
    }
  };

  // ============================================================
  // AUDIO ERROR
  // ============================================================

  const handleAudioError = () => {
    const audio = audioRef.current;

    console.error("Audio could not be loaded.");

    if (audio?.error) {
      console.error("Audio error code:", audio.error.code);

      console.error("Audio error message:", audio.error.message);
    }

    setIsPlaying(false);

    if (audioUrl) {
      setAudioError(
        "The generated audio could not be loaded. Check that the Cloudinary audio URL is valid and publicly accessible.",
      );
    }
  };

  // ============================================================
  // PLAYBACK SPEED
  // ============================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.playbackRate = speed;
    }
  }, [speed]);

  // ============================================================
  // VOLUME
  // ============================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio element does not exist.");
      return;
    }

    if (!audioUrl) {
      console.error("No audio URL available.");
      return;
    }

    if (isGeneratingAudio) {
      return;
    }

    try {
      if (audio.paused) {
        console.log("Attempting to play audio...");

        await audio.play();
      } else {
        console.log("Pausing audio...");

        audio.pause();
      }
    } catch (error) {
      console.error("Audio playback error:", error);

      setAudioError("Unable to play the generated audio.");
    }
  };

  // ============================================================
  // CHANGE SPEED
  // ============================================================

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];

    const currentIndex = speeds.indexOf(speed);

    const nextIndex =
      currentIndex === -1 ? 1 : (currentIndex + 1) % speeds.length;

    setSpeed(speeds[nextIndex]);
  };

  // ============================================================
  // FORMAT TIME
  // ============================================================

  const formatTime = (time) => {
    if (!Number.isFinite(time) || time < 0) {
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

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!Number.isFinite(newTime)) {
      return;
    }

    audio.currentTime = newTime;

    setCurrentTime(newTime);
  };

  // ============================================================
  // SKIP BACKWARD
  // ============================================================

  const skipBackward = () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  // ============================================================
  // SKIP FORWARD
  // ============================================================

  const skipForward = () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    const audioDuration = Number.isFinite(audio.duration)
      ? audio.duration
      : duration;

    if (!audioDuration) {
      return;
    }

    audio.currentTime = Math.min(audioDuration, audio.currentTime + 10);
  };

  // ============================================================
  // RESTART
  // ============================================================

  const restartAudio = async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    audio.currentTime = 0;

    try {
      await audio.play();
    } catch (error) {
      console.error("Restart playback error:", error);
    }
  };

  // ============================================================
  // VOLUME CHANGE
  // ============================================================

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);

    setVolume(newVolume);

    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  // ============================================================
  // MUTE
  // ============================================================

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // ============================================================
  // VOLUME PERCENTAGE
  // ============================================================

  const volumePercentage = isMuted ? 0 : volume * 100;

  // ============================================================
  // PROGRESS
  // ============================================================

  const progress =
    duration > 0
      ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
      : 0;

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoadingFile || isLoadingVoice) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FB] px-6 dark:bg-[#111113]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#7145FF]/20 border-t-[#7145FF]" />

          <p className="text-sm text-[#666] dark:text-[#AAA]">
            Loading document...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // FILE ERROR
  // ============================================================

  if (fileError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FB] px-6 dark:bg-[#111113]">
        <div className="w-full max-w-md rounded-[18px] bg-white p-8 text-center shadow-sm dark:bg-[#1C1C1E]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-500/10">
            !
          </div>

          <h2 className="mb-2 text-lg font-semibold text-[#171717] dark:text-white">
            Unable to load document
          </h2>

          <p className="text-sm text-[#777] dark:text-[#AAA]">{fileError}</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F8F9FB] dark:bg-[#111113]">
      {/* THEME TOGGLE */}

      <div className="absolute right-4 top-4 z-50 sm:right-6 sm:top-5 md:right-8">
        <ThemeToggle />
      </div>

      {/* MAIN */}

      <main className="flex min-h-0 w-full flex-1 justify-center overflow-hidden px-3 pb-[95px] pt-[65px] sm:px-5 sm:pb-[100px] md:px-6 lg:px-8 lg:pb-[105px] lg:pt-[55px] xl:px-10">
        <div className="flex min-h-0 w-full max-w-[1250px] flex-1 flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:gap-7">
          {/* ARTICLE */}

          <article className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-[16px] bg-[#F7F7F7] px-5 py-6 sm:rounded-[18px] sm:px-7 sm:py-7 md:px-8 md:py-8 lg:px-9 lg:py-8 xl:px-10 xl:py-9 dark:bg-[#1C1C1E]">
            <h1 className="mb-5 max-w-[900px] break-words pr-8 text-[21px] font-bold leading-[1.2] tracking-[-0.4px] text-[#111111] sm:text-[23px] md:text-[25px] dark:text-white">
              {file?.originalName || "Untitled Document"}
            </h1>

            <div className="max-w-[900px] whitespace-pre-wrap break-words text-[14px] leading-[1.7] text-[#5C5C5C] sm:text-[15px] sm:leading-[1.75] dark:text-[#D0D0D0]">
              {file?.extractedText ? (
                file.extractedText.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index} className="mb-[17px]">
                    {paragraph.trim()}
                  </p>
                ))
              ) : (
                <p className="text-[#888]">
                  No extracted text is available for this document.
                </p>
              )}
            </div>
          </article>

          {/* CURRENTLY READING */}

          <aside className="flex min-h-0 w-full shrink-0 flex-col items-center rounded-[16px] bg-[#F7F7F7] px-5 py-6 sm:rounded-[18px] sm:px-7 sm:py-7 md:px-8 lg:h-full lg:w-[350px] xl:w-[390px] dark:bg-[#1C1C1E]">
            {/* HEADER */}

            <div className="mb-5 flex w-full items-center justify-between sm:mb-6">
              <h2 className="text-[16px] font-semibold text-[#171717] dark:text-white sm:text-[17px]">
                Currently Reading
              </h2>

              <button
                type="button"
                className="flex h-7 w-7 shrink-0 items-center justify-center text-[#AAAAAA]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="5" cy="12" r="1.5" />

                  <circle cx="12" cy="12" r="1.5" />

                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>

            {/* ORB */}

            <div className="relative mb-4 h-[135px] w-[135px] shrink-0 sm:h-[155px] sm:w-[155px] md:h-[170px] md:w-[170px] lg:h-[165px] lg:w-[165px] xl:h-[180px] xl:w-[180px]">
              <div className="absolute inset-0 scale-[1.1] rounded-full bg-[#8B3DFF]/20 blur-[28px] sm:blur-[30px]" />

              <video
                ref={videoRef}
                src={assets.sonarOrb}
                autoPlay
                loop
                muted
                playsInline
                className="relative z-10 h-full w-full object-contain"
              />

              {/* AUDIO */}

              <audio
                ref={audioRef}
                preload="metadata"
                onPlay={handleAudioPlay}
                onPause={handleAudioPause}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onDurationChange={handleDurationChange}
                onCanPlay={handleCanPlay}
                onEnded={handleAudioEnded}
                onError={handleAudioError}
              />
            </div>

            {/* NARRATOR */}

            <p className="mb-5 max-w-full shrink-0 truncate text-center text-[11px] text-[#777777] sm:mb-7 sm:text-[12px] dark:text-[#999999]">
              Narrator:{" "}
              <span className="font-medium text-[#3F3F3F] dark:text-white">
                {getVoiceDisplayName()}
              </span>
            </p>

            {/* MODEL */}

            {voice?.model && (
              <p
                className="-mt-3 mb-5 max-w-[90%] truncate text-center text-[8px] text-[#AAAAAA] sm:text-[9px]"
                title={voice.model}
              >
                {voice.model}
              </p>
            )}

            {/* GENERATING */}

            {isGeneratingAudio && (
              <div className="-mt-2 mb-4 flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#7145FF]/20 border-t-[#7145FF]" />

                <p className="text-[10px] text-[#888] dark:text-[#AAA]">
                  Generating speech...
                </p>
              </div>
            )}

            {/* VOICE ERROR */}

            {voiceError && (
              <p className="-mt-3 mb-4 max-w-full text-center text-[10px] text-red-500">
                {voiceError}
              </p>
            )}

            {/* AUDIO ERROR */}

            {audioError && (
              <p className="-mt-2 mb-4 max-w-full text-center text-[10px] text-red-500">
                {audioError}
              </p>
            )}

            {/* CONTROLS */}

            <div className="flex min-h-0 w-full flex-1 flex-col">
              {/* SPEED + VOLUME */}

              <div className="mb-4 flex w-full items-center justify-between gap-3">
                {/* SPEED */}

                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-[11px] text-[#666666] dark:text-[#AAAAAA] sm:text-[12px]">
                    Speed:
                  </span>

                  <button
                    type="button"
                    onClick={changeSpeed}
                    className="flex h-[29px] shrink-0 items-center rounded-[6px] border border-[#D5D5D5] bg-white px-2.5 text-[11px] font-medium text-[#333333] sm:px-3 sm:text-[12px] dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    {speed}x
                  </button>
                </div>

                {/* VOLUME */}

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    disabled={!audioUrl}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="flex h-6 w-6 items-center justify-center text-[#9AA7B8] transition hover:text-[#7145FF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isMuted || volume === 0 ? (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5L6 9H3v6h3l5 4V5Z" />

                        <line x1="22" y1="9" x2="16" y2="15" />

                        <line x1="16" y1="9" x2="22" y2="15" />
                      </svg>
                    ) : (
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5L6 9H3v6h3l5 4V5Z" />

                        <path d="M15.5 8.5a5 5 0 0 1 0 7" />

                        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                      </svg>
                    )}
                  </button>

                  <div className="relative h-[20px] w-[55px] sm:w-[70px]">
                    <div className="pointer-events-none absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-[#D8DDE3]" />

                    <div
                      className="pointer-events-none absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-[#7A8798]"
                      style={{
                        width: `${volumePercentage}%`,
                      }}
                    />

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      disabled={!audioUrl}
                      aria-label="Volume"
                      className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* PROGRESS */}

              <div className="w-full">
                <div className="relative h-[5px] w-full overflow-hidden rounded-full bg-[#D8DDE3]">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-[#56677D]"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={Math.min(currentTime, duration || 0)}
                    onChange={handleSeek}
                    disabled={!audioUrl || duration === 0}
                    aria-label="Audio progress"
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
                  />
                </div>

                <div className="mt-2 flex justify-between text-[9px] text-[#999999] sm:text-[10px]">
                  <span>{formatTime(currentTime)}</span>

                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* MAIN CONTROLS */}

              <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3">
                {/* BACKWARD */}

                <button
                  type="button"
                  onClick={skipBackward}
                  disabled={!audioUrl}
                  aria-label="Skip backward 10 seconds"
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#D5D8DD] text-[#8C9BAE] transition hover:bg-[#F0F1F3] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[40px] sm:w-[40px] dark:border-white/10 dark:hover:bg-white/5"
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

                    <text
                      x="10"
                      y="21"
                      fontSize="6"
                      fill="currentColor"
                      stroke="none"
                    >
                      10
                    </text>
                  </svg>
                </button>

                {/* FORWARD */}

                <button
                  type="button"
                  onClick={skipForward}
                  disabled={!audioUrl}
                  aria-label="Skip forward 10 seconds"
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#D5D8DD] text-[#8C9BAE] transition hover:bg-[#F0F1F3] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[40px] sm:w-[40px] dark:border-white/10 dark:hover:bg-white/5"
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

                    <text
                      x="9"
                      y="21"
                      fontSize="6"
                      fill="currentColor"
                      stroke="none"
                    >
                      10
                    </text>
                  </svg>
                </button>

                {/* PLAY / PAUSE */}

                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!audioUrl || isGeneratingAudio}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7145FF] via-[#7549F4] to-[#4D61E8] text-white shadow-[0_8px_22px_rgba(105,71,255,0.3)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[50px] sm:w-[50px]"
                >
                  {isPlaying ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="6" y="5" width="4" height="14" rx="1" />

                      <rect x="14" y="5" width="4" height="14" rx="1" />
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
                  disabled={!audioUrl}
                  aria-label="Restart audio"
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#D5D8DD] text-[#8C9BAE] transition hover:bg-[#F0F1F3] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[40px] sm:w-[40px] dark:border-white/10 dark:hover:bg-white/5"
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

      {/* ========================================================
          BOTTOM PLAYER
      ======================================================== */}

      <div className="absolute bottom-3 left-1/2 z-40 w-[calc(100%-24px)] -translate-x-1/2 sm:bottom-4 sm:w-[calc(100%-32px)] md:w-[calc(100%-48px)] lg:bottom-5 lg:w-[calc(100%-60px)] xl:max-w-[1250px]">
        <div className="flex min-h-[58px] items-center gap-3 rounded-[13px] bg-[#252528] px-3 py-2.5 text-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] sm:min-h-[65px] sm:gap-4 sm:px-4 md:h-[72px] md:px-5">
          {/* FILE ICON */}

          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-[#7447FF] to-[#4D61E8] sm:h-[40px] sm:w-[40px]">
            <svg
              width="16"
              height="16"
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

          {/* FILE INFO */}

          <div className="min-w-0 w-[100px] shrink-0 sm:w-[140px] md:w-[170px]">
            <p className="truncate text-[10px] font-medium sm:text-[11px] md:text-[12px]">
              {file?.originalName || "Document.pdf"}
            </p>

            <p className="mt-1 text-[8px] text-[#99999F] sm:text-[9px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* BOTTOM PROGRESS */}

          <div className="mx-1 hidden min-w-0 flex-1 sm:block md:mx-3">
            <div className="relative h-[3px] w-full rounded-full bg-white/10">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#626269]"
                style={{
                  width: `${progress}%`,
                }}
              />

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                disabled={!audioUrl || duration === 0}
                aria-label="Bottom audio progress"
                className="absolute -top-[6px] left-0 h-[15px] w-full cursor-pointer appearance-none bg-transparent opacity-0"
              />
            </div>
          </div>

          {/* RIGHT INFO */}

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
            <span className="hidden max-w-[100px] truncate text-[9px] text-[#B4B4B8] sm:block md:max-w-[130px] md:text-[10px]">
              {getVoiceDisplayName()}
            </span>

            <span className="rounded-[4px] bg-white/10 px-1.5 py-1 text-[8px] sm:px-2 sm:text-[9px]">
              {speed}x
            </span>

            {/* BOTTOM PLAY BUTTON */}

            <button
              type="button"
              onClick={togglePlay}
              disabled={!audioUrl || isGeneratingAudio}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-7 w-7 shrink-0 items-center justify-center text-[#9B9BA1] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
            >
              {isPlaying ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1" />

                  <rect x="14" y="5" width="4" height="14" rx="1" />
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
