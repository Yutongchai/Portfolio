import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

interface NavigationItem {
  label: string;
  sectionId: string;
  icon?: string;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('story');

  const navigationItems: NavigationItem[] = [
    { label: 'Story', sectionId: 'story', icon: 'User' },
    { label: 'Work', sectionId: 'work', icon: 'Briefcase' },
    { label: 'Connect', sectionId: 'connect', icon: 'MessageCircle' },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Height of the header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Detect active section
      const sections = ['story', 'work', 'connect'];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const isActiveSection = (sectionId: string) => activeSection === sectionId;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-20 sm:h-24 px-6 lg:px-12 max-w-7xl mx-auto">
          {/* Logo with Premium Animation */}
          <button
            onClick={() => scrollToSection('story')}
            className="flex items-center space-x-3 flex-shrink-0"
            aria-label="Home"
          >
            <div className="relative">
              
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative w-10 h-10 sm:w-12 sm:h-12"
              >
                <g>
                  <ellipse cx="20" cy="20" rx="16" ry="16" fill="url(#logo-gradient)" />
                  <ellipse cx="20" cy="13" rx="7" ry="5" fill="#fcb22f" />
                  <ellipse cx="20" cy="20" rx="8" ry="6" fill="#fcb22f" />
                  <ellipse cx="20" cy="27" rx="7" ry="5" fill="#fcb22f" />
                  <ellipse cx="13" cy="20" rx="3" ry="2.5" fill="#ee424c" />
                  <ellipse cx="27" cy="20" rx="3" ry="2.5" fill="#0074b4" />
                  <ellipse cx="20" cy="20" rx="2" ry="2" fill="#12a28f" />
                </g>
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#12a28f" />
                    <stop offset="100%" stopColor="#0074b4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#12a28f] via-[#fcb22f] to-[#ee424c] bg-clip-text text-transparent hidden sm:block">
              EITO Group
            </span>
          </button>

          {/* Desktop Navigation with Premium Style */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const isActive = isActiveSection(item.sectionId);
              return (
                <button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="relative"
                >
                  <div
                    className={`relative px-6 py-3 rounded-full text-sm font-semibold ${
                      isActive
                        ? 'text-white'
                        : 'text-white/70'
                    }`}
                  >
                    {/* Active background with gradient */}
                    {isActive && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-[#12a28f] to-[#0074b4] rounded-full"
                      />
                    )}

                    <span className="relative z-10 flex items-center space-x-2">
                      {item.icon && (
                        <Icon name={item.icon} size={16} />
                      )}
                      <span>{item.label}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Premium CTA Button */}
            <div className="hidden lg:block">
              <button
                onClick={() => scrollToSection('connect')}
                className="relative px-6 py-3 font-bold text-sm rounded-full overflow-hidden"
              >
                <button className="relative px-6 py-3 font-bold text-sm rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ee424c] to-[#fcb22f] rounded-full" />
                  <span className="relative z-10 text-white flex items-center gap-2">
                    <Icon name="Mail" size={16} />
                    Let's Talk
                  </span>
                </button>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? 'X' : 'Menu'}
                size={24}
                className="text-white"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Premium Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10"
          >
            <nav className="flex flex-col p-6 space-y-2 max-w-md mx-auto">
              {navigationItems.map((item, index) => {
                const isActive = isActiveSection(item.sectionId);
                return (
                  <motion.div
                    key={item.sectionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.sectionId)}
                      className="block w-full"
                    >
                      <div
                        className={`flex items-center space-x-3 px-6 py-4 rounded-2xl text-base font-semibold ${
                          isActive
                            ? 'bg-gradient-to-r from-[#12a28f] to-[#0074b4] text-white'
                            : 'bg-white/5 text-white/70'
                        }`}
                      >
                        {item.icon && (
                          <Icon name={item.icon} size={20} />
                        )}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  </motion.div>
                );
              })}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-6 mt-4 border-t border-white/10"
              >
                <button
                  onClick={() => scrollToSection('connect')}
                  className="w-full relative px-6 py-4 font-bold text-base rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ee424c] to-[#fcb22f] rounded-2xl" />
                  <span className="relative z-10 text-white flex items-center justify-center gap-2">
                    <Icon name="Mail" size={20} />
                    Start a Conversation
                  </span>
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;