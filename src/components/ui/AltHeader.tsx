import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const COLORS = {
    NAVY: '#153462',
    GOLD: '#fcb22f',
    TEAL: '#12a28f',
    ORANGE: '#f68921',
    PURPLE: '#695da5',
    CORAL: '#ee424c',
    LIGHT_PEACH: '#FFEBD2'
};

const services = [
    { id: 'team-building', label: 'Team Building', path: '/work-showcase/team-building', color: COLORS.TEAL },
    { id: 'training', label: 'Training Program', path: '/work-showcase/training-program', color: COLORS.PURPLE },
    { id: 'corporate', label: 'Corporate Event', path: '/work-showcase/corporate-event', color: COLORS.ORANGE },
    { id: 'csr', label: 'CSR', path: '/work-showcase/csr', color: COLORS.CORAL },
];

const AltHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // The core logic: Shrink if scrolled AND mouse is not over the nav
    const isShrunk = isScrolled && !isHovered;

    function navigateTo(path: string) {
        navigate(path);
        const hashIndex = path.indexOf('#');
        if (hashIndex !== -1) {
            const hash = path.slice(hashIndex + 1);
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
        setOpen(false);
    }

    const pathname = location.pathname;
    const isActive = (p: string) => {
        if (p === '/') return pathname === '/';
        return pathname === p || pathname.startsWith(p);
    };

    return (
        <header
            className="fixed top-6 left-0 right-0 z-50 px-4 animate-float pointer-events-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setOpen(false);
            }}
        >
            <div className="max-w-6xl mx-auto flex justify-center">
                {/* Main Nav Container - Spring-like expand, smooth shrink */}
                <div
                    className={`
                    pointer-events-auto bg-white border-4 border-[#153462]
                    flex items-center justify-center
                    shadow-[6px_6px_0px_0px_rgba(21,52,98,1)]
                    ${isShrunk
                            ? 'transition-[width_400ms_ease-in,height_400ms_ease-in,padding_400ms_ease-in]'
                            : 'transition-[width_550ms_cubic-bezier(0.34,1.56,0.64,1),height_550ms_cubic-bezier(0.34,1.56,0.64,1),padding_550ms_cubic-bezier(0.34,1.56,0.64,1)]'}
                    ${isShrunk ? 'w-20 h-20 px-0 rounded-full' : 'w-full h-20 px-8 rounded-[2.5rem]'}
                `}
                >
                    <div className="flex items-center justify-between w-full relative">

                        {/* LEFT CURTAIN - Shrink: fade out fast. Expand: stagger in from left */}
                        <div className={`flex items-center gap-6 transition-[opacity_250ms_ease-out,transform_350ms_cubic-bezier(0.34,1.2,0.64,1)]
                            ${isShrunk ? 'delay-0' : 'delay-150'}
                            ${isShrunk
                                ? 'opacity-0 -translate-x-8 pointer-events-none absolute'
                                : 'opacity-100 translate-x-0'}`}
                        >
                            <button
                                onClick={() => navigateTo('/')}
                                className={`text-lg font-black tracking-tight px-3 py-1 rounded-lg transition-all hover:rotate-3 whitespace-nowrap ${isActive('/') ? 'bg-[#fcb22f] text-white' : 'text-[#153462]'}`}
                            >
                                HOME
                            </button>

                            <div className="relative group">
                                <button
                                    onMouseEnter={() => !isShrunk && setOpen(true)}
                                    className={`flex items-center text-lg font-black tracking-tight gap-1 px-3 py-1 rounded-lg transition-all hover:-rotate-3 whitespace-nowrap ${isActive('/work-showcase') ? 'bg-[#12a28f] text-white' : 'text-[#153462]'}`}
                                >
                                    SERVICES
                                    <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
                                </button>

                                {/* DROPDOWN - Positioned absolutely so it won't disappear */}
                                <div
                                    className={`absolute top-[130%] left-0 w-64 bg-white border-4 border-[#153462] rounded-2xl shadow-[6px_6px_0px_0px_#153462] transition-all duration-300 origin-top-left z-[60]
                                    ${open && !isShrunk ? 'scale-100 opacity-100 visible' : 'scale-90 opacity-0 invisible'}`}
                                >
                                    <div className="p-2 flex flex-col gap-2">
                                        {services.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => navigateTo(s.path)}
                                                className="w-full text-left px-4 py-3 rounded-xl font-bold text-white transition-transform hover:scale-105 active:scale-95"
                                                style={{ backgroundColor: s.color, border: `2px solid #153462` }}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER LOGO - When shrunk: absolute inset-0 for true center. When expanded: flex-1 */}
                        <div className={`flex justify-center items-center transition-[transform_400ms_cubic-bezier(0.34,1.2,0.64,1)] ${isShrunk ? 'absolute inset-0 scale-110' : 'flex-1 scale-100'}`}>
                            <button onClick={() => navigateTo('/')} className="flex items-center gap-3 group whitespace-nowrap">
                                <div className={`flex items-center justify-center transition-[transform_450ms_cubic-bezier(0.34,1.56,0.64,1)] ${isShrunk ? 'scale-125' : 'scale-100'}`}>
                                    <img src="/black.png" alt="Logo" className={`${isShrunk ? 'w-12 h-12' : 'w-10 h-10'} object-contain`} />
                                </div>
                                <span className={`text-2xl font-black tracking-tighter text-[#153462] group-hover:text-[#f68921] overflow-hidden
                                    transition-[width_350ms_ease-out,opacity_300ms_ease-out] ${isShrunk ? 'delay-0' : 'delay-200'}
                                    ${isShrunk ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                                    EITO&nbsp;GROUP
                                </span>
                            </button>
                        </div>

                        {/* RIGHT CURTAIN - Shrink: fade out fast. Expand: stagger in from right */}
                        <div className={`flex items-center gap-4 origin-right transition-[opacity_250ms_ease-out,transform_350ms_cubic-bezier(0.34,1.2,0.64,1),width_400ms_ease-in-out]
                            ${isShrunk ? 'delay-0' : 'delay-250'}
                            ${isShrunk ? 'opacity-0 invisible scale-95 -translate-x-2 w-0 overflow-hidden' : 'opacity-100 visible scale-100 translate-x-0 w-auto'}`}
                        >
                            <button
                                onClick={() => navigateTo('/connection-hub')}
                                className="hidden md:block text-lg font-black text-[#153462] hover:text-[#ee424c] transition-colors whitespace-nowrap"
                            >
                                CONNECT
                            </button>

                            <button
                                onClick={() => navigateTo('/connection-hub#availability-calendar')}
                                className="bg-[#fcb22f] border-4 border-[#153462] px-6 py-2 rounded-full font-black text-[#153462] shadow-[4px_4px_0px_0px_#153462] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all whitespace-nowrap"
                            >
                                BOOK NOW!
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </header>
    );
};

export default AltHeader;