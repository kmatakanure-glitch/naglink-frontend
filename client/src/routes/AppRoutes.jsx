import { Routes, Route } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import Fleet from "../pages/public/Fleet";
import TrackOrder from "../pages/public/TrackOrder";
import Contact from "../pages/public/Contact";
import Gallery from "../pages/public/gallery";
import NewsUpdates from "../pages/public/NewsUpdates";

// System Pages
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";
import TrackMultiTruck from "../pages/TrackMultiTruck.jsx";

// Admin
import AdminDashboard from "../pages/Admin/Dashboard.jsx";

// CEO
import CEODashboard from "../pages/CEO/Dashboard.jsx";

// Customer
import CustomerDashboard from "../pages/Customer/Dashboard.jsx";

// Driver
import DriverDashboard from "../pages/Driver/Dashboard.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news-updates" element={<NewsUpdates />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/track-fleet" element={<TrackMultiTruck />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ceo/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ceo"]}>
            <CEODashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={["driver"]}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;