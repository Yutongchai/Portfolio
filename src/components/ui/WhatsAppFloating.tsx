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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.373 0 .02 5.353.02 12.02c0 2.116.554 4.178 1.607 6.002L0 24l6.174-1.617A11.94 11.94 0 0012 24c6.627 0 11.98-5.353 11.98-11.98 0-3.205-1.25-6.212-3.46-8.54z" fill="#fff" opacity="0.04" />
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.149-.199.297-.769.967-.942 1.166-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.388-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.151-.173.201-.297.302-.495.099-.199.05-.373-.025-.522-.075-.148-.672-1.62-.921-2.217-.242-.582-.487-.503-.672-.512l-.573-.01c-.199 0-.52.074-.792.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.199 2.095 3.2 5.077 4.487  .709.306 1.26.489 1.691.626.71.226 1.357.194 1.87.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.199-.57-.348z" fill="#ffffff" />
                </svg>
            </a>
        );
};

export default WhatsAppFloating;
