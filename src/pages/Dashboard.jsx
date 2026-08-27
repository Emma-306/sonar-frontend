const Dashboard = () => {
  return (
    <div className="p-7">
      <div
        className="
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-6

          dark:border-[#222222]
          dark:bg-[#0d0d0d]
        "
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Welcome back, Alex
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          What would you like to do today?
        </p>
      </div>
    </div>
  );
};

export default Dashboard;