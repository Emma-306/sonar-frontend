import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets.js";

const pinnedFiles = [{ name: "Meeting_Notes.pdf", path: "#" }];

const recentFiles = [
  { name: "Project_Notes.pdf", path: "#" },
  { name: "Cook.pdf", path: "#" },
  { name: "Story.pdf", path: "#" },
];

const DashboardSidebar = ({ isOpen = false, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed
            inset-0
            z-40
            bg-black/30
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          h-dvh
          w-[calc(100vw-24px)]
          max-w-[280px]
          flex-col
          overflow-hidden
          border-r
          border-gray-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          ease-in-out

          sm:w-[260px]
          md:w-[240px]

          dark:border-[#1d1d1d]
          dark:bg-[#080808]

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static
          lg:h-screen
          lg:w-[240px]
          lg:max-w-none
          lg:translate-x-0
          lg:shadow-none
          lg:shrink-0
        `}
      >
        {/* LOGO + CLOSE */}
        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            justify-between
            px-4
            sm:px-5
          "
        >
          {/* Logo */}
          <div className="flex min-w-0 items-center">
            <img
              src={assets.brandLogo}
              alt="Sonar Logo"
              className="h-6 w-auto max-w-[130px] object-contain dark:hidden"
            />

            <img
              src={assets.brandLogo2}
              alt="Sonar Logo"
              className="hidden h-6 w-auto max-w-[130px] object-contain dark:block"
            />
          </div>

          {/* Close button - mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-800
              active:scale-95
              dark:hover:bg-[#1a1a1a]
              dark:hover:text-gray-200
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* SEARCH */}
        <div className="shrink-0 px-3 pb-4 sm:px-4">
          <div className="relative">
            <svg
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-3.5
                w-3.5
                -translate-y-1/2
                text-gray-400
              "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              type="text"
              placeholder="Search files..."
              className="
                h-9
                w-full
                rounded-lg
                border
                border-gray-200
                bg-gray-50
                pl-9
                pr-3
                text-[12px]
                text-gray-800
                outline-none
                transition-all
                placeholder:text-gray-400

                focus:border-[#7c3aed]
                focus:bg-white
                focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]

                dark:border-[#252525]
                dark:bg-[#111111]
                dark:text-gray-200
                dark:placeholder:text-gray-500
                dark:focus:border-[#8b5cf6]
                dark:focus:bg-[#0f0f0f]
                dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]
              "
            />
          </div>
        </div>

        {/* NEW FILE */}
        <div className="shrink-0 px-3 pb-5 sm:px-4">
          <button
            type="button"
            className="
              flex
              h-9
              w-full
              cursor-pointer
              items-center
              gap-2
              rounded-lg
              px-2
              text-[12px]
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              hover:text-gray-900
              active:scale-[0.99]

              dark:text-gray-400
              dark:hover:bg-[#111111]
              dark:hover:text-gray-200
            "
          >
            <span className="text-[16px] leading-none">+</span>
            NEW FILE
          </button>
        </div>

        {/* FILES */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 sm:px-3">
          {/* PINNED */}
          <div className="mb-5">
            <p
              className="
                mb-2
                px-2
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Pinned
            </p>

            <div className="space-y-0.5">
              {pinnedFiles.map((file) => (
                <button
                  type="button"
                  key={file.name}
                  className="
                    flex
                    w-full
                    min-w-0
                    cursor-pointer
                    items-center
                    gap-2.5
                    rounded-lg
                    px-2
                    py-2
                    text-left
                    text-[12px]
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    active:bg-gray-100

                    dark:text-gray-300
                    dark:hover:bg-[#111111]
                    dark:active:bg-[#151515]
                  "
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17v5" />
                    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1z" />
                  </svg>

                  <span className="min-w-0 truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RECENTS */}
          <div>
            <p
              className="
                mb-2
                px-2
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
              "
            >
              Recents
            </p>

            <div className="space-y-0.5">
              {recentFiles.map((file) => (
                <button
                  type="button"
                  key={file.name}
                  className="
                    flex
                    w-full
                    min-w-0
                    cursor-pointer
                    items-center
                    gap-2.5
                    rounded-lg
                    px-2
                    py-2
                    text-left
                    text-[12px]
                    text-gray-700
                    transition
                    hover:bg-gray-50
                    active:bg-gray-100

                    dark:text-gray-300
                    dark:hover:bg-[#111111]
                    dark:active:bg-[#151515]
                  "
                >
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>

                  <span className="min-w-0 truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            shrink-0
            border-t
            border-gray-200
            p-3
            dark:border-[#1d1d1d]
            sm:p-3.5
          "
        >
          {/* Upgrade */}
          <NavLink
            to="/plan-comparison"
            onClick={onClose}
            className="
    mb-3
    flex
    h-10
    w-full
    cursor-pointer
    items-center
    justify-center
    gap-2
    rounded-lg
    bg-gradient-to-r
    from-[#3B82F6]
    to-[#9333EA]
    px-2
    text-[11px]
    font-medium
    text-white
    transition
    hover:opacity-90
    active:scale-[0.98]
    sm:text-[12px]
  "
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" />
            </svg>

            <span>Upgrade to Pro</span>
          </NavLink>

          {/* User */}
          <div className="flex min-w-0 items-center gap-2.5 px-1 py-1 sm:gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Alexander Chen"
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-gray-900 dark:text-gray-100">
                Alexander Chen
              </p>

              <p className="truncate text-[10px] text-gray-400">
                alex@sonar.ai
              </p>
            </div>

            <NavLink
              to="/dashboard/settings"
              onClick={onClose}
              className="
                flex
                h-8
                w-8
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
                active:scale-95

                dark:hover:bg-[#1a1a1a]
                dark:hover:text-gray-200
              "
              aria-label="Settings"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852 1.01 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
