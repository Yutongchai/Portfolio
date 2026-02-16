import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AltHeader from './components/ui/AltHeader';

// Lazy load pages for faster initial load
const Home = lazy(() => import('./pages/Home'));
const TeamBuilding = lazy(() => import('./pages/work-showcase/TeamBuilding'));
const CorporateEvent = lazy(() => import('./pages/work-showcase/CorporateEvent'));
const TrainingProgram = lazy(() => import('./pages/work-showcase/TrainingProgram'));
const CSR = lazy(() => import('./pages/work-showcase/CSR'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminLogin })));
const AdminRegister = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminRegister })));
const AdminDashboard = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminDashboard })));
const HeroImagesManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.HeroImagesManager })));
const ClientLogosManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ClientLogosManager })));
const ProjectsManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ProjectsManager })));
const InquiriesManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.InquiriesManager })));
const BookingsManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.BookingsManager })));
const ProtectedRoute = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ProtectedRoute })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Routes: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <AltHeader />
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
