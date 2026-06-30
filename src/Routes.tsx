// src/Routes.tsx
import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import ReactGA from 'react-ga4';
import ErrorBoundary from "./components/ErrorBoundary";
import AltHeader from './components/ui/AltHeader';
import SEOHead from './components/SEOHead';
import { pageSEO } from './config/seoConfig';

// ── Service pages ─────────────────────────────────────────────────────────────
const Home = lazy(() => import('./pages/Home'));
const TeamBuilding = lazy(() => import('./pages/services/TeamBuilding'));
const CorporateEvent = lazy(() => import('./pages/services/CorporateEvent'));
const TrainingProgram = lazy(() => import('./pages/services/TrainingProgram'));
const CSR = lazy(() => import('./pages/services/CSR'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Questionnaire = lazy(() => import('./pages/Questionnaire'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ── Blog pages ────────────────────────────────────────────────────────────────
// IMPORTANT: filenames on disk must be exactly:
//   src/pages/blog/BlogIndex.tsx  (capital B, capital I)
//   src/pages/blog/BlogPost.tsx   (capital B, capital P)
// Rename them in your file explorer if they differ in casing.
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLogin = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminLogin })));
const AdminResetPassword = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminResetPassword })));
const AdminDashboard = lazy(() => import('./pages/admin').then(mod => ({ default: mod.AdminDashboard })));
const HeroImagesManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.HeroImagesManager })));
const ClientLogosManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ClientLogosManager })));
const ProjectsManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ProjectsManager })));
const InquiriesManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.InquiriesManager })));
const BookingsManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.BookingsManager })));
const ProtectedRoute = lazy(() => import('./pages/admin').then(mod => ({ default: mod.ProtectedRoute })));
const BlogManager = lazy(() => import('./pages/admin').then(mod => ({ default: mod.BlogManager })));

// ── Loading fallback ──────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// ── Root ──────────────────────────────────────────────────────────────────────
const Routes: React.FC = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <RouteTracker />
    <Analytics />
    <ErrorBoundary>
      <HeaderGuard />
      <Suspense fallback={<PageLoader />}>
        <RouterRoutes>
          <Route path="/" element={<><SEOHead config={pageSEO.home} includeSchemas={true} /><Home /></>} />
          <Route path="/personal-story-section" element={<Home />} />
          <Route path="/services" element={<Home />} />
          <Route path="/services/team-building" element={<TeamBuilding />} />
          <Route path="/services/corporate-event" element={<CorporateEvent />} />
          <Route path="/services/training-program" element={<TrainingProgram />} />
          <Route path="/services/csr" element={<CSR />} />
          <Route path="/connection-hub" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/questionnaire" element={<Questionnaire />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Admin — public */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* Admin — protected */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <RouterRoutes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="hero-images" element={<HeroImagesManager />} />
                <Route path="client-logos" element={<ClientLogosManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="inquiries" element={<InquiriesManager />} />
                <Route path="bookings" element={<BookingsManager />} />
                <Route path="blog" element={<BlogManager />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </RouterRoutes>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  </BrowserRouter>
);

// ── GA4 + Umami tracker ───────────────────────────────────────────────────────
const RouteTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => { ReactGA.initialize('G-CP9NYZR2TH'); }, []);

  useEffect(() => {
    const fullPath = location.pathname + location.search;
    ReactGA.send({ hitType: 'pageview', page: fullPath });

    if (location.pathname === '/questionnaire') {
      const params = new URLSearchParams(location.search);
      const formType = params.get('form');
      const formLabels: Record<string, string> = {
        csr: 'Questionnaire - CSR',
        training_program: 'Questionnaire - Training Program',
        team_building: 'Questionnaire - Team Building',
        corporate_events: 'Questionnaire - Corporate Events',
      };
      const eventName = formType && formLabels[formType] ? formLabels[formType] : 'Questionnaire - Unknown';
      window.umami?.track(eventName, { form: formType ?? 'unknown', path: fullPath });
    }

    if (location.pathname.startsWith('/blog/') && location.pathname.length > 6) {
      const slug = location.pathname.replace('/blog/', '');
      window.umami?.track('Blog Article View', { slug, path: fullPath });
    }
  }, [location]);

  return null;
};

// ── Header guard ──────────────────────────────────────────────────────────────
const HeaderGuard: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/questionnaire')) return null;
  return <AltHeader />;
};

export default Routes;