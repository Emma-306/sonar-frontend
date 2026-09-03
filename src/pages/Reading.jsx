import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle.jsx";

import useAuthStore from "../stores/authStore.js";

import { assets } from "../assets/assets.js";

const Reading = () => {
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const activeWordRef = useRef(null);
  const activeSentenceRef = useRef(null);
  const textContainerRef = useRef(null);

  const [searchParams] = useSearchParams();

  const fileId = searchParams.get("fileId");

  // ============================================================
  // ZUSTAND
  // ============================================================

  const getFile = useAuthStore((state) => state.getFile);

  const getUserVoice = useAuthStore((state) => state.getUserVoice);

  const generateUserSpeech = useAuthStore((state) => state.generateUserSpeech);

  const downloadAudio = useAuthStore((state) => state.downloadAudio);

  const usage = useAuthStore((state) => state.usage);

  const user = useAuthStore((state) => state.user);

  const brandColorHex = useAuthStore((state) => state.brandColorHex);

  const defaultPurple = "#7145FF";
  const activeHighlightColor = brandColorHex || defaultPurple;

  const ORB_BASE_HUE = 268;

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

    let orbRotation = hue - ORB_BASE_HUE;
    orbRotation = ((((orbRotation + 180) % 360) + 360) % 360) - 180;

    return Math.round(orbRotation);
  };

  const sonarHueRotate = getOrbHueRotate(activeHighlightColor);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const attemptPlay = async () => {
      video.muted = true;
      try {
        await video.play();
      } catch (error) {
        console.warn("Reading orb autoplay failed:", error);
      }
    };

    if (video.readyState >= 2) {
      attemptPlay();
      return;
    }

    video.addEventListener("canplay", attemptPlay, { once: true });

    return () => video.removeEventListener("canplay", attemptPlay);
  }, [activeHighlightColor]);

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

  // Audio document returned by backend
  const [audio, setAudio] = useState(null);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const [audioError, setAudioError] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.74);

  const [isMuted, setIsMuted] = useState(false);

  // ============================================================
  // ACTIVE WORD
  // ============================================================

  const [activeWordIndex, setActiveWordIndex] = useState(-1);

  // ============================================================
  // RESOLVE AUDIO URL
  // ============================================================

  const resolveAudioUrl = (returnedAudioUrl) => {
    if (!returnedAudioUrl) {
      return null;
    }

    const cleanUrl = String(returnedAudioUrl).trim();

    // Cloudinary / external URL
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
      : "https://sonar-backend-2.onrender.com";

    const normalizedPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;

    return `${backendUrl}${normalizedPath}`;
  };

  // ============================================================
  // PROCESS DOCUMENT INTO WORDS
  // ============================================================

  const extractedText = file?.extractedText ?? "";

  const textStructure = useMemo(() => {
    if (!extractedText) {
      return [];
    }

    const sentenceMatches =
      extractedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

    return sentenceMatches
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .map((sentence) => ({
        sentence,
        words: sentence.match(/\S+/g) || [],
      }));
  }, [extractedText]);

  // ============================================================
  // TOTAL WORD COUNT
  // ============================================================

  const totalWordCount = useMemo(() => {
    return textStructure.reduce(
      (total, paragraph) => total + paragraph.words.length,
      0,
    );
  }, [textStructure]);

  // ============================================================
  // FLATTEN WORDS
  // ============================================================

  const flatWords = useMemo(() => {
    const words = [];

    textStructure.forEach((paragraph) => {
      paragraph.words.forEach((word) => {
        words.push(word);
      });
    });

    return words;
  }, [textStructure]);

  void flatWords;
  void activeWordRef;

  // ============================================================
  // UPDATE ACTIVE WORD
  // ============================================================

  const updateActiveWord = (time) => {
    if (
      !duration ||
      duration <= 0 ||
      totalWordCount <= 0 ||
      !Number.isFinite(time)
    ) {
      setActiveWordIndex(-1);
      return;
    }

    const clampedTime = Math.min(Math.max(time, 0), duration);

    const progress = clampedTime / duration;

    let index = Math.floor(progress * totalWordCount);

    if (index >= totalWordCount) {
      index = totalWordCount - 1;
    }

    if (index < 0) {
      index = 0;
    }

    setActiveWordIndex(index);
  };

  // ============================================================
  // AUTO SCROLL ACTIVE WORD
  // ============================================================

  useEffect(() => {
    const activeElement = activeSentenceRef.current || activeWordRef.current;

    if (!activeElement) {
      return;
    }

    if (!isPlaying) {
      return;
    }

    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [activeWordIndex, isPlaying]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  // ============================================================
  // REFRESH VOICE WHEN ACCOUNT SETTINGS CHANGE
  // ============================================================

  useEffect(() => {
    if (!user?.onboarding) {
      return;
    }

    setVoice({
      accent: user.onboarding.preferredAccent,
      gender: user.onboarding.preferredVoiceGender,
    });

    setVoiceError(null);
  }, [
    user?.onboarding?.preferredAccent,
    user?.onboarding?.preferredVoiceGender,
  ]);

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

      // Reset old audio
      setAudioUrl(null);
      setAudio(null);
      setAudioError(null);
      setActiveWordIndex(-1);

      startTransition(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      });

      setIsGeneratingAudio(true);

      try {
        console.log("Generating speech for file:", fileId);

        const result = await generateUserSpeech(fileId);

        if (!isMounted) {
          return;
        }

        console.log("Speech generation result:", result);

        if (!result?.success) {
          setAudioError(result?.message || "Failed to generate speech.");
          return;
        }

        if (!result.audioUrl) {
          setAudioError("The backend did not return an audio URL.");

          console.error(
            "Backend speech response did not contain audioUrl:",
            result,
          );

          return;
        }

        const fullAudioUrl = resolveAudioUrl(result.audioUrl);

        console.log("Audio URL:", fullAudioUrl);

        setAudioUrl(fullAudioUrl);

        if (result.audio) {
          setAudio(result.audio);
        } else {
          console.warn("Backend did not return the generated audio document.");
        }
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.extractedText, fileId, voice?.accent, voice?.gender]);

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
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (!audioUrl) {
      audioElement.pause();
      audioElement.removeAttribute("src");
      audioElement.load();

      startTransition(() => {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setActiveWordIndex(-1);
      });

      return;
    }

    console.log("Loading audio:", audioUrl);

    audioElement.pause();

    startTransition(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setActiveWordIndex(-1);
    });

    audioElement.src = audioUrl;
    audioElement.load();

    return () => {
      audioElement.pause();
    };
  }, [audioUrl]);

  // ============================================================
  // AUDIO PLAY
  // ============================================================

  const handleAudioPlay = () => {
    setIsPlaying(true);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  // ============================================================
  // AUDIO PAUSE
  // ============================================================

  const handleAudioPause = () => {
    setIsPlaying(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // ============================================================
  // AUDIO TIME UPDATE
  // ============================================================

  const handleAudioTimeUpdate = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const time = audioElement.currentTime;

    setCurrentTime(time);

    updateActiveWord(time);
  };

  // ============================================================
  // AUDIO METADATA
  // ============================================================

  const handleLoadedMetadata = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
      setDuration(audioElement.duration);

      updateActiveWord(audioElement.currentTime);
    }
  };

  // ============================================================
  // CAN PLAY
  // ============================================================

  const handleCanPlay = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
      setDuration(audioElement.duration);

      updateActiveWord(audioElement.currentTime);
    }
  };

  // ============================================================
  // DURATION CHANGE
  // ============================================================

  const handleDurationChange = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
      setDuration(audioElement.duration);

      updateActiveWord(audioElement.currentTime);
    }
  };

  // ============================================================
  // AUDIO ENDED
  // ============================================================

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveWordIndex(-1);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.currentTime = 0;
    }
  };

  // ============================================================
  // AUDIO ERROR
  // ============================================================

  const handleAudioError = () => {
    const audioElement = audioRef.current;

    console.error("Audio could not be loaded.");

    if (audioElement?.error) {
      console.error("Audio error code:", audioElement.error.code);

      console.error("Audio error message:", audioElement.error.message);
    }

    setIsPlaying(false);

    if (audioUrl) {
      setAudioError(
        "The generated audio could not be loaded. Check that the audio URL is valid and publicly accessible.",
      );
    }
  };

  // ============================================================
  // PLAYBACK SPEED
  // ============================================================

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.playbackRate = speed;
    }
  }, [speed]);

  // ============================================================
  // VOLUME
  // ============================================================

  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // ============================================================
  // PLAY / PAUSE
  // ============================================================

  const togglePlay = async () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
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
      if (audioElement.paused) {
        await audioElement.play();
      } else {
        audioElement.pause();
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

    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (!Number.isFinite(newTime)) {
      return;
    }

    audioElement.currentTime = newTime;

    setCurrentTime(newTime);

    updateActiveWord(newTime);
  };

  // ============================================================
  // SKIP BACKWARD
  // ============================================================

  const skipBackward = () => {
    const audioElement = audioRef.current;

    if (!audioElement || !audioUrl) {
      return;
    }

    const newTime = Math.max(0, audioElement.currentTime - 10);

    audioElement.currentTime = newTime;

    setCurrentTime(newTime);

    updateActiveWord(newTime);
  };

  // ============================================================
  // SKIP FORWARD
  // ============================================================

  const skipForward = () => {
    const audioElement = audioRef.current;

    if (!audioElement || !audioUrl) {
      return;
    }

    const audioDuration = Number.isFinite(audioElement.duration)
      ? audioElement.duration
      : duration;

    if (!audioDuration) {
      return;
    }

    const newTime = Math.min(audioDuration, audioElement.currentTime + 10);

    audioElement.currentTime = newTime;

    setCurrentTime(newTime);

    updateActiveWord(newTime);
  };

  // ============================================================
  // RESTART
  // ============================================================

  const restartAudio = async () => {
    const audioElement = audioRef.current;

    if (!audioElement || !audioUrl) {
      return;
    }

    audioElement.currentTime = 0;

    setCurrentTime(0);

    setActiveWordIndex(0);

    try {
      await audioElement.play();
    } catch (error) {
      console.error("Restart playback error:", error);
    }
  };

  // ============================================================
  // DOWNLOAD AUDIO
  // ============================================================

  const handleDownloadAudio = async () => {
    if (!audio?.id || isDownloading) {
      return;
    }

    setIsDownloading(true);

    setAudioError(null);

    try {
      const originalName = file?.originalName || "sonar-audio";

      const fileNameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");

      const audioFileName = `${fileNameWithoutExtension}-audio.mp3`;

      const result = await downloadAudio(audio.id, audioFileName);

      if (!result?.success) {
        setAudioError(result?.message || "Audio download failed.");
      }
    } catch (error) {
      console.error("Audio download failed:", error);

      setAudioError("Audio download failed.");
    } finally {
      setIsDownloading(false);
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
  // SAFE USAGE VALUES
  // ============================================================

  const usagePlan = usage?.plan || "free";

  const downloadUsed = usage?.downloads?.used ?? 0;

  const downloadLimit = usage?.downloads?.limit ?? 0;

  const downloadRemaining =
    usage?.downloads?.remaining ?? Math.max(downloadLimit - downloadUsed, 0);

  // ============================================================
  // RENDER DOCUMENT WORDS
  // ============================================================

  const renderDocumentText = () => {
    if (!file?.extractedText) {
      return (
        <p className="text-[#888]">
          No extracted text is available for this document.
        </p>
      );
    }

    let globalWordIndex = 0;

    return textStructure.map((sentenceBlock, sentenceIndex) => {
      const sentenceWords = sentenceBlock.words;

      const sentenceStartIndex = globalWordIndex;

      const sentenceEndIndex = sentenceStartIndex + sentenceWords.length - 1;

      const isActiveSentence =
        activeWordIndex >= sentenceStartIndex &&
        activeWordIndex <= sentenceEndIndex;

      globalWordIndex += sentenceWords.length;

      return (
        <p
          key={`sentence-${sentenceIndex}`}
          ref={isActiveSentence ? activeSentenceRef : null}
          className="mb-[2px] transition-all duration-200"
          style={
            isActiveSentence
              ? {
                  color: activeHighlightColor,
                  fontSize: "1.06em",
                  lineHeight: 1.6,
                  fontWeight: 500,
                }
              : {
                  color: "inherit",
                }
          }
        >
          {sentenceWords.map((word, wordIndex) => (
            <span
              key={`sentence-${sentenceIndex}-word-${wordIndex}`}
              className="mr-[0.35em] inline-block"
            >
              {word}
            </span>
          ))}
        </p>
      );
    });
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoadingFile || isLoadingVoice) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F8F9FB] px-6 dark:bg-[#111113]">
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#7145FF]/20 border-t-[#7145FF]"
            style={{
              borderTopColor: activeHighlightColor,
            }}
          />

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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F5F5F5] dark:bg-[#111113] lg:h-screen">
      {/* THEME TOGGLE */}
      <div className="absolute right-4 top-2 z-50 sm:right-6 sm:top-5 md:right-8">
        <ThemeToggle />
      </div>

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

      {/* MAIN */}
      <main className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto px-3 py-[65px] sm:px-5 md:px-6 lg:overflow-hidden lg:px-8 lg:py-[55px] xl:px-10">
        <div className="flex min-h-0 w-full max-w-[1250px] flex-1 flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:gap-7">
          {/* LEFT SIDE: DOCUMENT + FIXED PLAYER */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 sm:gap-4">
            {/* ARTICLE */}
            <article
              ref={textContainerRef}
              className="min-h-[420px] max-h-[calc(100dvh-11rem)] min-w-0 flex-1 overflow-y-auto overscroll-contain rounded-[16px] bg-[#F7F7F7] px-5 py-6 sm:max-h-[calc(100dvh-12rem)] sm:rounded-[18px] sm:px-7 sm:py-7 md:px-8 md:py-8 lg:min-h-0 lg:max-h-none lg:px-9 lg:py-8 xl:px-10 xl:py-9 dark:bg-[#1C1C1E]"
            >
              <h1 className="mb-5 max-w-[900px] break-words pr-8 text-[21px] font-bold leading-[1.2] tracking-[-0.4px] text-[#111111] sm:text-[23px] md:text-[25px] dark:text-white">
                {file?.originalName || "Untitled Document"}
              </h1>

              <div className="max-w-[900px] whitespace-normal break-words text-[14px] leading-[1.7] text-[#5C5C5C] sm:text-[15px] sm:leading-[1.75] dark:text-[#D0D0D0]">
                {renderDocumentText()}
              </div>
            </article>

            {/* BOTTOM PLAYER — UNDER DOCUMENT ONLY */}
            <div className="w-full shrink-0 lg:hidden">
              <div className="flex min-h-[92px] flex-wrap items-center gap-x-2 gap-y-2 rounded-[13px] bg-[#252528] px-3 py-2.5 text-white sm:min-h-[100px] sm:gap-3 sm:px-4 md:min-h-[105px] md:px-5">
                {/* FILE ICON */}
                <div
                  className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] sm:h-[40px] sm:w-[40px]"
                  style={{
                    backgroundColor: activeHighlightColor,
                  }}
                >
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
                <div className="min-w-0 flex-1 basis-[72px]">
                  <p className="truncate text-[10px] font-medium sm:text-[11px] md:text-[12px]">
                    {file?.originalName || "Document.pdf"}
                  </p>

                  <p className="mt-1 text-[8px] text-[#99999F] sm:text-[9px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                </div>

                {/* BOTTOM PROGRESS */}
                <div className="order-last basis-full px-0.5 md:mx-3">
                  <div className="relative h-[3px] w-full rounded-full bg-white/10">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: activeHighlightColor,
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
                <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2 md:gap-4">
                  <span className="hidden max-w-[100px] truncate text-[9px] text-[#B4B4B8] sm:block md:max-w-[130px] md:text-[10px]">
                    {getVoiceDisplayName()}
                  </span>

                  <span className="rounded-[4px] bg-white/10 px-1.5 py-1 text-[8px] sm:px-2 sm:text-[9px]">
                    {speed}x
                  </span>

                  <button
                    type="button"
                    onClick={skipBackward}
                    disabled={!audioUrl}
                    aria-label="Skip backward 10 seconds"
                    className="flex h-7 w-6 shrink-0 items-center justify-center text-[#9B9BA1] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 14 5 10l4-4" />
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

                  <button
                    type="button"
                    onClick={skipForward}
                    disabled={!audioUrl}
                    aria-label="Skip forward 10 seconds"
                    className="flex h-7 w-6 shrink-0 items-center justify-center text-[#9B9BA1] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 14 4-4-4-4" />
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

                  {/* BOTTOM PLAY BUTTON */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    disabled={!audioUrl || isGeneratingAudio}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                    style={{ backgroundColor: activeHighlightColor }}
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

                  <button
                    type="button"
                    onClick={restartAudio}
                    disabled={!audioUrl}
                    aria-label="Restart audio"
                    className="flex h-7 w-6 shrink-0 items-center justify-center text-[#9B9BA1] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                  >
                    <svg
                      width="15"
                      height="15"
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

                  <button
                    type="button"
                    onClick={handleDownloadAudio}
                    disabled={
                      !audio?.id ||
                      !audioUrl ||
                      isGeneratingAudio ||
                      isDownloading ||
                      downloadRemaining <= 0
                    }
                    aria-label="Download audio"
                    title="Download audio"
                    className="flex h-7 w-6 shrink-0 items-center justify-center text-[#9B9BA1] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-8 sm:w-8"
                  >
                    {isDownloading ? (
                      <div
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20"
                        style={{ borderTopColor: activeHighlightColor }}
                      />
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3v12" />
                        <path d="m7 10 5 5 5-5" />
                        <path d="M5 21h14" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CURRENTLY READING */}
          <aside className="hidden min-h-0 w-full shrink-0 flex-col items-center rounded-[16px] bg-[#F5F5F5] px-5 py-6 sm:rounded-[18px] sm:px-7 sm:py-7 md:px-8 lg:flex lg:h-full lg:w-[350px] lg:overflow-y-auto xl:w-[390px] dark:bg-[#1C1C1E]">
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
              <div
                className="absolute inset-0 scale-[1.1] rounded-full blur-[28px] sm:blur-[30px]"
                style={{
                  backgroundColor: `${activeHighlightColor}33`,
                }}
              />

              <video
                ref={videoRef}
                src={assets.sonarOrb}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                  filter: `hue-rotate(${sonarHueRotate}deg) saturate(1.3) brightness(1.05)`,
                }}
                className="relative z-10 h-full w-full object-contain"
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
                <div
                  className="h-3 w-3 animate-spin rounded-full border-2 border-[#7145FF]/20"
                  style={{
                    borderTopColor: activeHighlightColor,
                  }}
                />

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
                      className="pointer-events-none absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full"
                      style={{
                        width: `${volumePercentage}%`,
                        backgroundColor: activeHighlightColor,
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
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: activeHighlightColor,
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

              {/* DOWNLOAD USAGE */}
              <div className="mb-3 mt-4 text-center">
                <p className="text-[10px] text-[#888] dark:text-[#AAA]">
                  {usagePlan === "premium" ? "PREMIUM" : "FREE"}
                </p>

                <p className="text-[11px] text-[#888] dark:text-[#AAA]">
                  Downloads today: {downloadUsed}/{downloadLimit}
                </p>
              </div>

              {/* MAIN CONTROLS */}
              <div className="mt-1 flex items-center justify-center gap-2 sm:gap-3">
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
                  className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full text-white transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[50px] sm:w-[50px]"
                  style={{
                    backgroundColor: activeHighlightColor,
                    boxShadow: `0 8px 22px ${activeHighlightColor}55`,
                  }}
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

                {/* DOWNLOAD AUDIO */}
                <button
                  type="button"
                  onClick={handleDownloadAudio}
                  disabled={
                    !audio?.id ||
                    !audioUrl ||
                    isGeneratingAudio ||
                    isDownloading ||
                    downloadRemaining <= 0
                  }
                  aria-label="Download audio"
                  title={
                    downloadRemaining <= 0
                      ? "Daily download limit reached"
                      : "Download audio"
                  }
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#D5D8DD] text-[#8C9BAE] transition hover:bg-[#F0F1F3] disabled:cursor-not-allowed disabled:opacity-40 sm:h-[40px] sm:w-[40px] dark:border-white/10 dark:hover:bg-white/5"
                >
                  {isDownloading ? (
                    <div
                      className="h-4 w-4 animate-spin rounded-full border-2 border-[#7145FF]/20"
                      style={{
                        borderTopColor: activeHighlightColor,
                      }}
                    />
                  ) : (
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
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Reading;
