import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";

/**
 * Wrapper for protected routes that require authentication
 * Includes the layout wrapper for authenticated pages
 */
export default function PrivateRoutes() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

