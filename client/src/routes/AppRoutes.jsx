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
import TrackMultiTruck from "../pages/TrackMultiTruck.jsx";

// Admin
import AdminDashboard from "../pages/Admin/Dashboard.jsx";

// Customer
import CustomerDashboard from "../pages/Customer/Dashboard.jsx";

// Driver
import DriverDashboard from "../pages/Driver/Dashboard.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}
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

      {/* ================= SYSTEM ================= */}
      <Route path="/login" element={<Login />} />

      <Route path="/track-fleet" element={<TrackMultiTruck />} />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= CUSTOMER ================= */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= DRIVER ================= */}
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