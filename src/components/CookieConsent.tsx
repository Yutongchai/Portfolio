import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Cookie Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-[#f68921]/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#f68921]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zM7 13a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-[#153462] mb-2">
                    🍪 We Value Your Privacy
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    We use cookies to improve your browsing experience, analyze site traffic, and personalize content. 
                    By clicking "Accept," you consent to our use of cookies in accordance with our{' '}
                    <a href="/privacy-policy" className="text-[#f68921] hover:underline font-semibold">
                      Privacy Policy
                    </a>
                    . You can manage your preferences at any time.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={acceptCookies}
                    className="px-6 py-3 bg-[#153462] hover:bg-[#1c447a] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={declineCookies}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all whitespace-nowrap"
                  >
                    Decline
                  </button>
                </div>
              </div>

              {/* Additional Info Link */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Learn more about how we protect your data in our{' '}
                  <a href="/privacy-policy" className="text-[#f68921] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a href="/terms-of-service" className="text-[#f68921] hover:underline font-semibold">
                    Terms of Service
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
