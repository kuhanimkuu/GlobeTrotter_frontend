import { Routes, Route } from "react-router-dom";

// Layout & route helpers
import Layout from "../Layout";
import ProtectedRoute from "../ProtectedRoute";
import Unauthorized from "../Unauthorized";

// =========================
// Auth pages
// =========================
import LoginPage from "../../pages/auth/LoginPage";
import RegisterPage from "../../pages/auth/RegisterPage";

// =========================
// Public pages
// =========================
import HomePage from "../../pages/public/HomePage";
import CarsPage from "../../pages/public/CarsPage";
import DestinationsPage from "../../pages/public/DestinationsPage";
import FlightsPage from "../../pages/public/FlightsPage";
import HotelsPage from "../../pages/public/HotelsPage";
import TourPackagesPage from "../../pages/public/TourPackagesPage";
import ContactPage from "../../pages/public/Contact";
// =========================
// Booking flow pages
// =========================
import BookingWizardPage from "../../pages/booking-flow/BookingWizardPage";
import PaymentPage from "../../pages/booking-flow/PaymentPage";
import ReceiptPage from "../../pages/booking-flow/ReceiptPage";
import CarBookingWizardPage from "../../pages/booking-flow/CarBookingWizardPage";
import HotelBookingWizardPage from "../../pages/booking-flow/HotelBookingWizardPage";
import FlightsBookingWizardPage from "../../pages/booking-flow/FlightsBookingWizardPage";
// =========================
// Protected user pages
// =========================
import DashboardPage from "../../pages/protected/DashboardPage";
import BookingsPage from "../../pages/protected/BookingsPage";
import BookingPage from "../../pages/protected/BookingPage";
import ProfilePage from "../../pages/protected/ProfilePage";

// =========================
// Role-based pages
// =========================
import AdminDashboard from "../../pages/roles/admin/AdminDashboard";
import ManageHotelsPage from "../../pages/roles/admin/ManageHotelsPage";
import ManageCarsPage from "../../pages/roles/admin/ManageCarsPage";
import ManageDestinationsPage from "../../pages/roles/admin/ManageDestinationsPage";

import OrganizerDashboard from "../../pages/roles/organizer/OrganizerDashboard";
import ManageTourPackagesPage from "../../pages/roles/organizer/ManageTourPackagesPage";


// =========================
// Settings
// =========================
import SettingsPage from "../../pages/settings/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Layout-wrapped routes */}
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="flights" element={<FlightsPage />} />
        <Route path="hotels" element={<HotelsPage />} />
        <Route path="tour-packages" element={<TourPackagesPage />} />
        <Route path="contact" element={<ContactPage />} />
        {/* Booking flow */}
        <Route path="booking-wizard" element={<BookingWizardPage />} />
        <Route path="cars-booking-wizard" element={<CarBookingWizardPage />} />
        <Route path="hotels-booking-wizard" element={<HotelBookingWizardPage />} />
        <Route path="flights-booking-wizard" element={<FlightsBookingWizardPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="receipt" element={<ReceiptPage />} />

        {/* Protected routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* =========================
            Role-based routes
        ========================== */}

        {/* Admin */}
       // Admin routes (separate pages)
<Route
  path="admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="admin/hotels"
  element={
    <ProtectedRoute requiredRole="admin">
      <ManageHotelsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="admin/cars"
  element={
    <ProtectedRoute requiredRole="admin">
      <ManageCarsPage />
    </ProtectedRoute>
  }
/>

<Route
  path="admin/destinations"
  element={
    <ProtectedRoute requiredRole="admin">
      <ManageDestinationsPage />
    </ProtectedRoute>
  }
/>

{/* Organizer routes */}
<Route
  path="organizer"
  element={
    <ProtectedRoute requiredRole="organizer">
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="organizer/packages"
  element={
    <ProtectedRoute requiredRole="organizer">
      <ManageTourPackagesPage />
    </ProtectedRoute>
  }
/>


        {/* Organizer */}
       <Route
  path="organizer"
  element={
    <ProtectedRoute requiredRole="organizer">
      <OrganizerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="organizer/packages"
  element={
    <ProtectedRoute requiredRole="organizer">
      <ManageTourPackagesPage />
    </ProtectedRoute>
  }
/>

        {/* Settings */}
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route path="unauthorized" element={<Unauthorized />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
