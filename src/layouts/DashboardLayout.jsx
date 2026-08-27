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

  const currentPage = pageInfo[location.pathname] || pageInfo["/dashboard"];

  return (
    <div
      className="
        flex h-screen w-full overflow-hidden
        bg-white text-gray-900
        dark:bg-black dark:text-white
      "
    >
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <DashboardSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar with hamburger + ThemeToggle */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-[#1d1d1d] lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="
        flex h-9 w-9 items-center justify-center rounded-lg
        text-gray-600 transition
        hover:bg-gray-100 hover:text-gray-900
        dark:text-gray-300 dark:hover:bg-[#1a1a1a] dark:hover:text-white
      "
              aria-label="Open sidebar"
            >
              {/* Hamburger icon */}
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

            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
                {currentPage.title}
              </p>
            </div>
          </div>

          {/* Theme Toggle on the right */}
          <ThemeToggle />
        </div>

        {/* Desktop header (hidden on mobile) */}
        <div className="hidden lg:block">
          <DashboardHeader
            title={currentPage.title}
            description={currentPage.description}
          />
        </div>

        {/* OUTLET */}
        <section
          className="
            min-h-0 flex-1 overflow-y-auto
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
