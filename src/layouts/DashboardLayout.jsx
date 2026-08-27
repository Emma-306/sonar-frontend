import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import ThemeToggle from "../components/ThemeToggle";

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageInfo = {
    "/dashboard": {
      title: "Home",
      description: "Your reading workspace",
    },
    "/dashboard/documents": {
      title: "My Documents",
      description: "Manage your documents",
    },
    "/dashboard/history": {
      title: "History",
      description: "Your recent activity",
    },
    "/dashboard/favorites": {
      title: "Favorites",
      description: "Your saved documents",
    },
    "/dashboard/settings": {
      title: "Settings",
      description: "Manage your Sonar preferences",
    },
  };

  const currentPage =
    pageInfo[location.pathname] || pageInfo["/dashboard"];

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

      {/* MAIN AREA */}
      <main
        className="
          flex
          min-h-0
          min-w-0
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {/* MOBILE HEADER */}
        <header
          className="
            flex
            h-14
            w-full
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-3
            sm:px-4

            dark:border-[#1d1d1d]
            dark:bg-black

            lg:hidden
          "
        >
          {/* Left side */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="
                flex
                h-9
                w-9
                shrink-0
                cursor-pointer
                items-center
                justify-center
                rounded-lg
                text-gray-600
                transition
                hover:bg-gray-100
                hover:text-gray-900
                active:scale-95

                dark:text-gray-300
                dark:hover:bg-[#1a1a1a]
                dark:hover:text-white
              "
              aria-label="Open sidebar"
              aria-expanded={isSidebarOpen}
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

            {/* Page title */}
            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-gray-900
                  sm:text-[15px]
                  dark:text-white
                "
              >
                {currentPage.title}
              </p>

              {/* Description only on slightly larger mobile screens */}
              <p
                className="
                  hidden
                  truncate
                  text-[10px]
                  text-gray-400
                  sm:block
                "
              >
                {currentPage.description}
              </p>
            </div>
          </div>

          {/* Theme toggle */}
          <div className="ml-2 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* DESKTOP HEADER */}
        <div className="hidden shrink-0 lg:block">
          <DashboardHeader
            title={currentPage.title}
            description={currentPage.description}
          />
        </div>

        {/* PAGE CONTENT */}
        <section
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-x-hidden
            overflow-y-auto
            bg-[#fafafa]

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