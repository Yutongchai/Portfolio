import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import WorkShowcase from './pages/work-showcase/index';
import ConnectionHub from './pages/connection-hub/index';
import PersonalStorySection from './pages/personal-story-section/index';

const Routes: React.FC = () => {
  return (
    <BrowserRouter basename="/Portfolio">
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your routes here */}
          <Route path="/" element={<PersonalStorySection />} />
          <Route path="/work-showcase" element={<WorkShowcase />} />
          <Route path="/connection-hub" element={<ConnectionHub />} />
          <Route path="/personal-story-section" element={<PersonalStorySection />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
