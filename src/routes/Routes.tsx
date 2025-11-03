import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard/";
import Appointments from "../pages/Appointments/";
import PublicCalendar from "../pages/PublicCalendar";

// Route wrappers
import PublicRoutes from "./PublicRoutes";
import PrivateRoutes from "./PrivateRoutes";

/**
 * Component to handle root path redirect based on authentication status
 */
function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

/**
 * Main application routes configuration
 * Organized into public routes, protected routes, and catch-all
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path="/calendar/:sharableId" element={<PublicCalendar />} />
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoutes>
            <Register />
          </PublicRoutes>
        }
      />

      {/* Protected Routes - Authentication required */}
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
      </Route>

      {/* Default and fallback routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

