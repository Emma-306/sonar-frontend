import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="
        flex
        h-dvh
        min-h-0
        w-full
        overflow-hidden
        bg-white
        text-gray-900
        dark:bg-black
        dark:text-white
      "
    >
      {/* SIDEBAR */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN AREA - Outlet takes everything */}
      <main
        className="
          relative
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* Mobile hamburger only */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="
            absolute
            left-3
            top-3
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-gray-600
            transition
            hover:bg-gray-100
            hover:text-gray-900
            dark:text-gray-300
            dark:hover:bg-[#1a1a1a]
            dark:hover:text-white
            lg:hidden
          "
          aria-label="Open sidebar"
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
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </button>

        {/* PAGE CONTENT */}
        <section
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-white
            dark:bg-black
          "
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;