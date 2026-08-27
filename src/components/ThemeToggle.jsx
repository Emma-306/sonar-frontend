import { useTheme } from "../context/UseTheme";


const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg

        text-gray-500
        hover:text-gray-900
        hover:bg-gray-100

        dark:text-gray-400
        dark:hover:text-white
        dark:hover:bg-[#1a1a1a]

        transition-all
        duration-200
      "
    >
      {darkMode ? (
        /* SUN */
        <svg
          className="h-[17px] w-[17px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="4" />

          <path d="M12 2v2" />
          <path d="M12 20v2" />

          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />

          <path d="M2 12h2" />
          <path d="M20 12h2" />

          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        /* MOON */
        <svg
          className="h-[17px] w-[17px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;