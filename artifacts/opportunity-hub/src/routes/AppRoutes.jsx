import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import OpportunityList from "../pages/opportunities/OpportunityList.jsx";
import OpportunityDetails from "../pages/opportunities/OpportunityDetails.jsx";
import Saved from "../pages/opportunities/Saved.jsx";
import Profile from "../pages/profile/Profile.jsx";
import Quiz from "../pages/quiz/Quiz.jsx";
import AdminPanel from "../pages/admin/AdminPanel.jsx";
import OpportunityForm from "../pages/admin/OpportunityForm.jsx";
import Landing from "../pages/Landing.jsx";
import Explore from "../pages/Explore.jsx";
import DeadlineCalendar from "../pages/calendar/DeadlineCalendar.jsx";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
      />
      <Route path="/explore" element={<Explore />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      {/* Protected, all in dashboard layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<OpportunityList />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/calendar" element={<DeadlineCalendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz/:opportunityId" element={<Quiz />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout title="Admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/new" element={<OpportunityForm />} />
        <Route path="/admin/edit/:id" element={<OpportunityForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
