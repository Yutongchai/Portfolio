import React from 'react';

const WhatsAppFloating: React.FC<{ phone?: string; message?: string }> = ({ phone = '60163287947', message = 'Hi, I am interested in your service!' }) => {
    // Only show on public (non-admin) routes. Use window.location as a safe
    // fallback when this component is rendered outside a Router.
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

    // Hide for any admin route (including /admin/login, /admin/register, /admin/*)
    if (pathname.toLowerCase().startsWith('/admin')) return null;

    const textParam = encodeURIComponent(message);
    const href = `https://wa.me/${phone}?text=${textParam}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat on WhatsApp ${phone}`}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] shadow-lg flex items-center justify-center text-white transition-colors duration-200"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="currentColor"
                    d="M16.04 0C7.18 0 0 7.18 0 16.04c0 2.83.74 5.6 2.14 8.04L0 32l8.19-2.11a15.92 15.92 0 007.85 2.02c8.86 0 16.04-7.18 16.04-16.04C32.08 7.18 24.9 0 16.04 0zm0 29.5c-2.47 0-4.89-.66-7.01-1.91l-.5-.29-4.86 1.25 1.3-4.73-.33-.51a13.45 13.45 0 01-2.07-7.27c0-7.44 6.05-13.49 13.49-13.49s13.49 6.05 13.49 13.49S23.48 29.5 16.04 29.5z"
                />
                <path
                    fill="currentColor"
                    d="M24.1 19.67c-.44-.22-2.61-1.29-3.02-1.44-.41-.15-.71-.22-1.01.22-.29.44-1.16 1.44-1.42 1.73-.26.29-.52.33-.96.11-.44-.22-1.86-.68-3.54-2.17-1.31-1.17-2.2-2.62-2.45-3.06-.26-.44-.03-.68.19-.9.2-.2.44-.52.66-.77.22-.26.29-.44.44-.74.15-.29.07-.55-.04-.77-.11-.22-1.01-2.43-1.38-3.33-.36-.87-.73-.75-1.01-.77l-.86-.02c-.29 0-.77.11-1.17.55-.41.44-1.54 1.52-1.54 3.72s1.58 4.31 1.8 4.61c.22.29 3.11 4.79 7.53 6.72 1.05.45 1.87.72 2.51.92 1.05.33 2.01.28 2.77.17.85-.13 2.61-1.07 2.98-2.11.37-1.04.37-1.93.26-2.11-.11-.18-.41-.29-.85-.51z"
                />
            </svg>

        </a>
    );
};

export default WhatsAppFloating;
