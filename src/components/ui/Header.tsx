import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { label: 'Story', path: '/personal-story-section', icon: 'User' },
    { label: 'Work', path: '/work-showcase', icon: 'Briefcase' },
    { label: 'Connect', path: '/connection-hub', icon: 'MessageCircle' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-elevation'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 px-3 sm:px-6 lg:px-12">
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0"
            aria-label="Home"
          >
            <div className="relative">
              <svg
                width="36"
                height="36"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110"
              >
                <g>
                  <ellipse cx="20" cy="20" rx="16" ry="16" fill="var(--color-primary)" />
                  <ellipse cx="20" cy="13" rx="7" ry="5" fill="#FFEB3B" />
                  <ellipse cx="20" cy="20" rx="8" ry="6" fill="#FFEB3B" />
                  <ellipse cx="20" cy="27" rx="7" ry="5" fill="#FFEB3B" />
                  <ellipse cx="13" cy="20" rx="3" ry="2.5" fill="#FFD600" />
                  <ellipse cx="27" cy="20" rx="3" ry="2.5" fill="#FFD600" />
                  <ellipse cx="20" cy="20" rx="2" ry="2" fill="#FFD600" />
                  <rect x="18" y="30" width="4" height="4" rx="2" fill="#FFEB3B" />
                </g>
              </svg>
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight hidden sm:block">
              EITO Group
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  isActivePath(item.path)
                    ? 'text-accent' :'text-foreground hover:text-accent'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {item.icon && (
                    <Icon name={item.icon} size={16} className="opacity-70" />
                  )}
                  <span>{item.label}</span>
                </span>
                {isActivePath(item.path) && (
                  <span className="absolute inset-0 bg-accent/10 rounded-lg" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            
            <Button
              variant="default"
              size="default"
              className="hidden lg:flex bg-accent hover:bg-cta text-accent-foreground font-semibold shadow-button hover:shadow-accent transition-all duration-300 hover:scale-105"
              iconName="Mail"
              iconPosition="left"
              iconSize={18}
              onClick={() => (window.location.href = '/connection-hub')}
            >
              Let's Talk
            </Button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-300 touch-manipulation"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? 'X' : 'Menu'}
                size={24}
                className="text-foreground w-6 h-6 sm:w-7 sm:h-7"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 bg-background/98 backdrop-blur-lg transition-all duration-300 overflow-y-auto ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto' :'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-4 sm:p-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 sm:py-4 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 touch-manipulation ${
                isActivePath(item.path)
                  ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
              }`}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isActivePath(item.path) ? 'text-accent' : ''}`}
                />
              )}
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
            
            <Button
              variant="default"
              size="lg"
              fullWidth
              className="bg-accent hover:bg-cta text-accent-foreground font-semibold text-sm sm:text-base py-3 sm:py-4"
              iconName="Mail"
              iconPosition="left"
              iconSize={20}
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.location.href = '/connection-hub';
              }}
            >
              Start a Conversation
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;