import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-950 via-sky-300 to-white">
        <div className="rounded-2xl bg-white/90 px-8 py-6 text-xl font-black text-blue-950 shadow-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "driver") {
      return <Navigate to="/driver/dashboard" replace />;
    }

    if (user.role === "customer") {
      return <Navigate to="/customer/dashboard" replace />;
    }

    if (user.role === "ceo") {
      return <Navigate to="/ceo/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;