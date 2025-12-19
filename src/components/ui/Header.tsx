import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

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
        <div className="flex items-center justify-between h-20 px-6 lg:px-12">
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            aria-label="Home"
          >
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <rect
                  width="40"
                  height="40"
                  rx="8"
                  fill="var(--color-primary)"
                  className="transition-colors duration-300"
                />
                <path
                  d="M12 28V12H16.5C18.5 12 20 13.5 20 15.5C20 16.8 19.3 17.9 18.2 18.5C19.5 19 20.5 20.2 20.5 21.8C20.5 24.1 18.8 26 16.3 26H12V28ZM15 17H16.5C17.3 17 18 16.3 18 15.5C18 14.7 17.3 14 16.5 14H15V17ZM15 24H16.3C17.2 24 18 23.2 18 22.3C18 21.4 17.2 20.5 16.3 20.5H15V24Z"
                  fill="var(--color-accent)"
                  className="transition-colors duration-300"
                />
                <circle
                  cx="28"
                  cy="20"
                  r="6"
                  fill="var(--color-accent)"
                  className="transition-all duration-300 group-hover:r-7"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight hidden sm:block">
              Portfolio
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
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

          <div className="flex items-center space-x-4">
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
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-300"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? 'X' : 'Menu'}
                size={24}
                className="text-foreground"
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 top-20 bg-background/98 backdrop-blur-lg transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto' :'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-4 rounded-lg text-base font-medium transition-all duration-300 ${
                isActivePath(item.path)
                  ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
              }`}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  className={isActivePath(item.path) ? 'text-accent' : ''}
                />
              )}
              <span>{item.label}</span>
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-border">
            <Button
              variant="default"
              size="lg"
              fullWidth
              className="bg-accent hover:bg-cta text-accent-foreground font-semibold shadow-button hover:shadow-accent"
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