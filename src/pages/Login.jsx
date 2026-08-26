import React from 'react';
import SonarOrb from '../components/SonarOrb';
import { assets } from '../assets/assets';

const Login = () => {
  // 11 animated equalizer bars with staggered delays and height profiles
  const eqBars = [
    { height: 'h-3', delay: '0.1s' },
    { height: 'h-5', delay: '0.25s' },
    { height: 'h-7', delay: '0.05s' },
    { height: 'h-9', delay: '0.35s' },
    { height: 'h-11', delay: '0.15s' },
    { height: 'h-12', delay: '0.4s' },
    { height: 'h-11', delay: '0.2s' },
    { height: 'h-9', delay: '0.3s' },
    { height: 'h-7', delay: '0.1s' },
    { height: 'h-5', delay: '0.45s' },
    { height: 'h-3', delay: '0.15s' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB] lg:bg-black font-sans antialiased">
      
      {/* ==================== LEFT PANEL (DARK & MOTION GRAPHICS - HIDDEN ON MOBILE) ==================== */}
      <section className="relative hidden lg:flex w-1/2 flex-col items-center justify-center overflow-hidden bg-black p-8 min-h-screen">
        
        {/* Brand Header (Top-Left on Desktop) */}
        <div className="absolute top-8 left-8 sm:top-10 sm:left-12 z-20 flex items-center gap-3">
          <img src={assets.brandLogo} alt="Sonar Logo" />
        </div>

        {/* Ambient floating light specks */}
        <div className="absolute top-1/4 left-1/5 h-2 w-2 rounded-full bg-cyan-400/60 blur-[1px] animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-purple-400/70 blur-[1px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/5 h-2.5 w-2.5 rounded-full bg-fuchsia-400/50 blur-[2px] animate-float" style={{ animationDelay: '2.5s' }} />

        {/* Central Fluid Motion Orb */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-12">
          <SonarOrb />

          {/* Equalizer Audio Waveform & Tagline Container */}
          <div className="mt-10 flex flex-col items-center gap-4">
            
            {/* 11-Bar Animated Audio Equalizer */}
            <div className="flex h-12 items-center justify-center gap-1.5 px-4">
              {eqBars.map((bar, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-purple-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] eq-bar ${bar.height}`}
                  style={{ animationDelay: bar.delay }}
                />
              ))}
            </div>

            {/* Subtitle / Tagline */}
            <p className="text-lg font-medium text-white/90 tracking-wide">
              Give your words a voice.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== RIGHT PANEL (LIGHT LOGIN FORM - FULL WIDTH ON MOBILE) ==================== */}
      <section className="flex w-full lg:w-1/2 min-h-screen flex-col items-center justify-center bg-[#F9FAFB] px-4 sm:px-6 py-12">

        <div className="w-full max-w-[440px]">
          
          {/* Form Card Container */}
          <div className="rounded-[24px] border border-gray-200/80 bg-[#ECEEF1] p-6 sm:p-10 md:p-12 shadow-sm">
            
            {/* Heading */}
            <h1 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Welcome to Sonar
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-center text-sm sm:text-[15px] leading-relaxed text-gray-500 max-w-[320px] mx-auto">
              Generate hyper-realistic speech from any text or document instantly.
            </p>

            {/* Google Sign In Button */}
            <button className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300/90 bg-white py-3.5 px-4 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow active:scale-[0.99] cursor-pointer">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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

            {/* Terms and Privacy Policy */}
            <p className="mt-8 text-center text-xs text-gray-500 leading-normal">
              By continuing, you agree to our{' '}
              <a
                href="#"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700 transition-colors"
              >
                Privacy Policy
              </a>
            </p>

            {/* New to Sonar Sign Up Link */}
            <p className="mt-8 text-center text-sm font-medium text-gray-600">
              New to Sonar?{' '}
              <a
                href="#"
                className="font-semibold text-purple-600 underline underline-offset-2 hover:text-purple-700 transition-colors ml-0.5"
              >
                Sign Up With Google
              </a>
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Login;