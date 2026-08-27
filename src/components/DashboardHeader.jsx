import ThemeToggle from "./ThemeToggle";

const DashboardHeader = () => {
  return (
    <header
      className="
        flex
        h-14
        w-full
        shrink-0
        items-center
        justify-end
        bg-transparent
        px-4
        sm:h-16
        sm:px-5
        md:h-[72px]
        md:px-7
      "
    >
      <ThemeToggle />
    </header>
  );
};

export default DashboardHeader;