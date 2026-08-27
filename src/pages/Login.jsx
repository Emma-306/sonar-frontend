import { useEffect, useRef } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore.js";

const Login = () => {
  const navigate = useNavigate();

  const googleLogin = useAuthStore(
    (state) => state.googleLogin
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const error = useAuthStore(
    (state) => state.error
  );

  const googleClientRef = useRef(null);

  // =====================================================
  // LOAD GOOGLE IDENTITY SERVICES
  // =====================================================

  useEffect(() => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error(
        "VITE_GOOGLE_CLIENT_ID is missing from frontend .env"
      );
      return;
    }

    const initializeGoogle = () => {
      if (!window.google) {
        console.error(
          "Google Identity Services has not loaded."
        );
        return;
      }

      if (googleClientRef.current) {
        return;
      }

      console.log(
        "Initializing Google OAuth..."
      );

      // =================================================
      // CREATE GOOGLE AUTHORIZATION CODE CLIENT
      // =================================================

      const client =
        window.google.accounts.oauth2.initCodeClient({
          client_id: clientId,

          scope: "openid email profile",

          ux_mode: "popup",

          select_account: true,

          include_granted_scopes: true,

          callback: async (response) => {
            try {
              console.log(
                "Google authorization response:",
                response
              );

              // =========================================
              // GOOGLE RETURNED AN ERROR
              // =========================================

              if (response?.error) {
                console.error(
                  "Google authentication error:",
                  response
                );

                return;
              }

              // =========================================
              // GET AUTHORIZATION CODE
              // =========================================

              const code = response?.code;

              if (!code) {
                console.error(
                  "Google authorization code was not provided."
                );

                return;
              }

              console.log(
                "Google authorization code received."
              );

              // =========================================
              // SEND CODE TO BACKEND
              // =========================================

              const result =
                await googleLogin(code);

              console.log(
                "Backend Google login result:",
                result
              );

              // =========================================
              // BACKEND LOGIN FAILED
              // =========================================

              if (!result?.success) {
                console.error(
                  "Backend Google login failed:",
                  result?.message
                );

                return;
              }

              // =========================================
              // LOGIN SUCCESSFUL
              // =========================================

              console.log(
                "Google login successful:",
                result.user
              );

              // =========================================
              // CHECK ONBOARDING
              // =========================================

              if (
                result.user?.onboardingCompleted
              ) {
                navigate("/dashboard");
              } else {
                navigate("/onboarding");
              }
            } catch (error) {
              console.error(
                "Google login failed:",
                error
              );
            }
          },

          // =========================================
          // GOOGLE POPUP ERROR
          // =========================================

          error_callback: (error) => {
            console.error(
              "Google popup error:",
              error
            );
          },
        });

      googleClientRef.current = client;

      console.log(
        "Google OAuth initialized successfully."
      );
    };

    // =====================================================
    // GOOGLE SCRIPT ALREADY AVAILABLE
    // =====================================================

    if (window.google) {
      initializeGoogle();
      return;
    }

    // =====================================================
    // CHECK IF SCRIPT ALREADY EXISTS
    // =====================================================

    let script = document.getElementById(
      "google-gsi-script"
    );

    if (script) {
      script.addEventListener(
        "load",
        initializeGoogle
      );

      return;
    }

    // =====================================================
    // LOAD GOOGLE SCRIPT
    // =====================================================

    script = document.createElement("script");

    script.id = "google-gsi-script";

    script.src =
      "https://accounts.google.com/gsi/client";

    script.async = true;
    script.defer = true;

    script.onload = initializeGoogle;

    script.onerror = () => {
      console.error(
        "Failed to load Google Identity Services."
      );
    };

    document.head.appendChild(script);
  }, [googleLogin, navigate]);

  // =====================================================
  // CUSTOM GOOGLE BUTTON
  // =====================================================

  const handleGoogleLogin = () => {
    if (isLoading) {
      return;
    }

    // =================================================
    // GOOGLE NOT LOADED
    // =================================================

    if (!window.google) {
      console.error(
        "Google Identity Services has not loaded yet."
      );

      return;
    }

    // =================================================
    // GOOGLE CLIENT NOT INITIALIZED
    // =================================================

    if (!googleClientRef.current) {
      console.error(
        "Google OAuth client has not been initialized yet."
      );

      return;
    }

    console.log(
      "Opening Google authentication..."
    );

    // =================================================
    // REQUEST AUTHORIZATION CODE
    // =================================================

    googleClientRef.current.requestCode();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* =================================================
          VIDEO BACKGROUND
      ================================================= */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src={assets.backgroundVideo}
          type="video/mp4"
        />

        Your browser does not support the video tag.
      </video>

      {/* =================================================
          DARK OVERLAY
      ================================================= */}

      <div className="absolute inset-0 bg-black/40" />

      {/* =================================================
          LOGIN CONTAINER
      ================================================= */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          px-4
          py-6
          sm:px-6
          sm:py-8
        "
      >

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div
          className="
            w-full
            max-w-[380px]
            rounded-2xl
            bg-white
            px-5
            py-8
            shadow-2xl
            sm:px-7
            sm:py-9
            md:px-8
            md:py-10
          "
        >

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="mb-5 flex justify-center sm:mb-6">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-purple-500
                to-violet-600
                shadow-lg
                shadow-purple-500/30
                sm:h-12
                sm:w-12
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-6 sm:w-6"
              >
                <path d="M2 10v4" />
                <path d="M6 6v12" />
                <path d="M10 3v18" />
                <path d="M14 8v8" />
                <path d="M18 5v14" />
                <path d="M22 10v4" />
              </svg>
            </div>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1
            className="
              mb-2
              text-center
              text-xl
              font-semibold
              leading-tight
              text-gray-900
              sm:text-2xl
            "
          >
            Welcome to Sonar
          </h1>

          {/* =================================================
              SUBTITLE
          ================================================= */}

          <p
            className="
              mx-auto
              mb-7
              max-w-[310px]
              text-center
              text-xs
              leading-relaxed
              text-gray-500
              sm:mb-8
              sm:text-sm
            "
          >
            Generate hyper-realistic speech from
            any text or document instantly.
          </p>

          {/* =================================================
              CUSTOM GOOGLE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-lg
              bg-black
              px-4
              py-3
              text-xs
              font-medium
              text-white
              transition
              hover:bg-gray-900
              focus:outline-none
              focus:ring-2
              focus:ring-black
              focus:ring-offset-2
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:gap-3
              sm:text-sm
            "
          >

            {/* GOOGLE LOGO */}

            <svg
              className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />

              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />

              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />

              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            <span>
              {isLoading
                ? "Signing in..."
                : "Sign in with Google"}
            </span>
          </button>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <p className="mt-3 text-center text-xs text-red-500">
              {error}
            </p>
          )}

          {/* =================================================
              TERMS
          ================================================= */}

          <p
            className="
              mt-5
              px-1
              text-center
              text-[10px]
              leading-5
              text-gray-500
              sm:mt-6
              sm:text-xs
              sm:leading-relaxed
            "
          >
            By continuing, you agree to our{" "}

            <a
              href="/terms"
              className="text-blue-600 hover:underline"
            >
              Terms Of Service
            </a>{" "}

            and{" "}

            <a
              href="/privacy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;