import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, profile, error, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading">Loading...</div>;
  if (error) return <div className="account-error" role="alert">{error} <button onClick={() => window.location.reload()}>Reload</button></div>;
  if (user && (!profile || profile.status !== "active")) return <div className="account-error" role="alert">Your account is unavailable. Please contact support.</div>;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (profile?.role !== "admin") {
    return <Navigate to="/account" replace />;
  }
  return children;
}
