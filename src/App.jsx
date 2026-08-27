import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Onboarding */}
        <Route
          path="/onboarding"
          element={<OnboardingPage />}
        />
         <Route path="/dashboard" element={<DashboardLayout />}>

          <Route index element={<Dashboard />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;