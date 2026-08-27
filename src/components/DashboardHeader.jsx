import ThemeToggle from "./ThemeToggle";

const DashboardHeader = () => {
  return (
    <header
      className="
        flex
        h-[72px]
        shrink-0
        items-center
        justify-end
        bg-transparent
        px-7
      "
    >
      <ThemeToggle />
    </header>
  );
};

export default DashboardHeader;