import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import PlanComparison from "./pages/PlanComparison";
import Reading from "./pages/Reading";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/plan-comparison" element={<PlanComparison />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reading" element={<Reading />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
