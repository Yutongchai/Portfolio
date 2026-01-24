import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from './pages/Home';
import { AdminLogin, AdminRegister, AdminDashboard, HeroImagesManager, ClientLogosManager, ProjectsManager, ProtectedRoute } from './pages/admin';

const Routes: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <RouterRoutes>
          <Route path="/" element={<Home />} />
          {/* Allow deep links into the single-page Home sections */}
          <Route path="/personal-story-section" element={<Home />} />
          <Route path="/work-showcase" element={<Home />} />
          <Route path="/connection-hub" element={<Home />} />
          
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
