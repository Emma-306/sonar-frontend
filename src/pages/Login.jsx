import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    navigate("/onboarding");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* ================= VIDEO BACKGROUND ================= */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={assets.backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ================= LOGIN CONTAINER ================= */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        {/* ================= LOGIN CARD ================= */}
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
          {/* ================= LOGO ================= */}
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

          {/* ================= HEADING ================= */}
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

          {/* ================= SUBTITLE ================= */}
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
            Generate hyper-realistic speech from any text or document
            instantly.
          </p>

          {/* ================= GOOGLE SIGN-IN ================= */}
          <button
            type="button"
            onClick={handleGoogleLogin}
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
              sm:gap-3
              sm:text-sm
            "
          >
            {/* Google Logo */}
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

            <span>Sign in with Google</span>
          </button>

          {/* ================= TERMS ================= */}
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