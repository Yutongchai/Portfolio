import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from '../components/ui/PillNav';
import PersonalStorySection from './personal-story-section/index';
import WorkShowcase from './work-showcase/index';
import ConnectionHub from './connection-hub/index';
import LogoImg from '../components/Logo.png';
import { motion, useScroll, useSpring } from 'framer-motion';
import SEOHead from '../components/SEOHead';
import { pageSEO } from '../config/seoConfig';
import PageLoader from '../components/PageLoader';

type PageView = 'home' | 'service' | 'connect';

const Home: React.FC = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleNavigation = (page: string) => {
    const pageMap: { [key: string]: PageView } = {
      '#home': 'home',
      '/personal-story-section': 'home',
      '#service': 'service',
      '/work-showcase': 'service',
      '#connect': 'connect',
      '/connection-hub': 'connect'
    };

    const newPage = pageMap[page] || 'home';
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeHref = currentPage === 'home' ? '/personal-story-section' :
    currentPage === 'service' ? '/work-showcase' :
      '/connection-hub';

  // Sync current page with URL on mount / when pathname changes
  useEffect(() => {
    const path = location.pathname;
    const pageMap: { [key: string]: PageView } = {
      '/personal-story-section': 'home',
      '/work-showcase': 'service',
      '/connection-hub': 'connect',
      '/': 'home'
    };
    const mapped = pageMap[path] || 'home';
    setCurrentPage(mapped);
    // Scroll to top when navigating between Home sections via URL
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0, 0); }
  }, [location.pathname]);

  // Smooth single reveal: wait until critical assets loaded then fade-in entire page
  const [isReady, setIsReady] = useState(false);

  // Determine which SEO config to use based on current page
  const getSEOConfig = () => {
    switch (currentPage) {
      case 'service':
        return pageSEO.workShowcase;
      case 'connect':
        return pageSEO.connectionHub;
      default:
        return pageSEO.personalStory;
    }
  };

  return (
    <>
      {!isReady && <PageLoader onLoaded={() => setIsReady(true)} />}

      <div className="min-h-screen" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 420ms ease', pointerEvents: isReady ? 'auto' : 'none' }}>
        <SEOHead config={getSEOConfig()} includeSchemas={currentPage === 'home'} />
        
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
          style={{ scaleX }}
        />

        <PillNav
          logo={LogoImg}
          logoAlt="EITO Group Logo"
          items={[
            { label: "Home", href: "/personal-story-section" },
            { label: "Services", href: "/work-showcase" },
            { label: "Connect", href: "/connection-hub" },
          ]}
          activeHref={activeHref}
        />

        {currentPage === 'home' && <PersonalStorySection />}
        {currentPage === 'service' && <WorkShowcase />}
        {currentPage === 'connect' && <ConnectionHub />}
      </div>
    </>
  );
};

export default Home;
