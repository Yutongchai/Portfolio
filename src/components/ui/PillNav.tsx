import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface PillNavProps {
  logo: string;
  logoAlt?: string;
  logoHref?: string;
  items: NavItem[];
  activeHref: string;
  className?: string;
}

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  logoHref = '/',
  items,
  activeHref,
  className = '',
}: PillNavProps) => {
  // Dropdown menu state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownItems = [
    { label: 'Team Building', href: '/work-showcase/team-building' },
    { label: 'Corporate Event', href: '/work-showcase/corporate-event' },
    { label: 'Training Program', href: '/work-showcase/training-program' },
    { label: 'CSR', href: '/work-showcase/csr' },
  ];

  return (
    <nav className={`w-full bg-white border-b-4 border-[#7a4a4a] ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to={logoHref}>
            <img src={logo} alt={logoAlt} className="h-16 w-auto" />
          </Link>
        </div>

        {/* Nav Items */}
        <div className="flex-grow flex justify-center">
          <ul className="flex items-center gap-12">
            {items.map((item) => (
              <li key={item.href} className="relative group">
                {item.label === 'Services' ? (
                  <div
                    className="relative py-2" // Added padding to increase hoverable area
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center text-xl tracking-wide text-[#5a2323] hover:text-[#a05a5a] transition-all ${activeHref.includes('work-showcase') ? 'font-bold' : 'font-normal'
                        }`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`
                      absolute left-1/2 -translate-x-1/2 pt-4 w-64 z-[9999]
                      transition-all duration-300 ease-out
                      ${dropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'}
                    `}>
                      <ul className="bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden py-2">
                        {dropdownItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              to={sub.href}
                              className="block px-6 py-3 text-base text-[#5a2323] hover:bg-[#fcf8f8] hover:text-[#a05a5a] transition-colors"
                              onClick={() => setDropdownOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`text-xl tracking-wide text-[#5a2323] hover:text-[#a05a5a] transition-all py-2 border-b-2 border-transparent ${activeHref === item.href ? 'border-[#7a4a4a] font-bold' : 'font-normal'
                      }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Symmetry Spacer */}
        <div className="hidden md:block w-24" />
      </div>
    </nav>
  );
};

export default PillNav;