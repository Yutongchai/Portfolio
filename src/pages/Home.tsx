import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from '../components/ui/PillNav';
import PersonalStorySection from './personal-story-section/index';
import WorkShowcase from './work-showcase/index';
import ConnectionHub from './connection-hub/index';
import LogoImg from '../components/Logo.png';
import { motion, useScroll, useSpring } from 'framer-motion';

type PageView = 'story' | 'work' | 'connect';

const Home: React.FC = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<PageView>('story');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleNavigation = (page: string) => {
    const pageMap: { [key: string]: PageView } = {
      '#story': 'story',
      '/personal-story-section': 'story',
      '#work': 'work',
      '/work-showcase': 'work',
      '#connect': 'connect',
      '/connection-hub': 'connect'
    };
    
    const newPage = pageMap[page] || 'story';
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeHref = currentPage === 'story' ? '/personal-story-section' : 
                     currentPage === 'work' ? '/work-showcase' : 
                     '/connection-hub';

  // Sync current page with URL on mount / when pathname changes
  useEffect(() => {
    const path = location.pathname;
    const pageMap: { [key: string]: PageView } = {
      '/personal-story-section': 'story',
      '/work-showcase': 'work',
      '/connection-hub': 'connect',
      '/': 'story'
    };
    const mapped = pageMap[path] || 'story';
    setCurrentPage(mapped);
    // Scroll to top when navigating between Home sections via URL
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { window.scrollTo(0,0); }
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
      />
      
      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: "Story", href: "/personal-story-section" },
          { label: "Work", href: "/work-showcase" },
          { label: "Connect", href: "/connection-hub" },
        ]}
        activeHref={activeHref}
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#000000"
        pillTextColor="#000000"
        initialLoadAnimation={false}
        onItemClick={(href) => handleNavigation(href)}
      />
      
      {currentPage === 'story' && <PersonalStorySection />}
      {currentPage === 'work' && <WorkShowcase />}
      {currentPage === 'connect' && <ConnectionHub />}
    </div>
  );
};

export default Home;
