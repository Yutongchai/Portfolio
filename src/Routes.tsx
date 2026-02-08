import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from './pages/Home';
import TeamBuilding from './pages/work-showcase/TeamBuilding';
import CorporateEvent from './pages/work-showcase/CorporateEvent';
import TrainingProgram from './pages/work-showcase/TrainingProgram';
import CSR from './pages/work-showcase/CSR';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { AdminLogin, AdminRegister, AdminDashboard, HeroImagesManager, ClientLogosManager, ProjectsManager, InquiriesManager, BookingsManager, ProtectedRoute } from './pages/admin';

const Routes: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <RouterRoutes>
          <Route path="/" element={<Home />} />
          {/* Allow deep links into the single-page Home sections */}
          <Route path="/personal-story-section" element={<Home />} />
          <Route path="/work-showcase" element={<Home />} />
          <Route path="/work-showcase/team-building" element={<TeamBuilding />} />
          <Route path="/work-showcase/corporate-event" element={<CorporateEvent />} />
          <Route path="/work-showcase/training-program" element={<TrainingProgram />} />
          <Route path="/work-showcase/csr" element={<CSR />} />
          <Route path="/connection-hub" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Admin Login/Register - Public */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* All other /admin/* routes require authentication */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <RouterRoutes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="hero-images" element={<HeroImagesManager />} />
                <Route path="client-logos" element={<ClientLogosManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="inquiries" element={<InquiriesManager />} />
                <Route path="bookings" element={<BookingsManager />} />
                {/* Add more admin routes here as needed */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </RouterRoutes>
            </ProtectedRoute>
          } />

          {/* Catch any unknown admin routes and redirect to login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
