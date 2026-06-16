import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '/black_opt.webp';
import { Menu, X, ChevronDown } from 'lucide-react';

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
    { id: 'team-building', label: 'Team Building', path: '/services/team-building', color: COLORS.TEAL },
    { id: 'training', label: 'Training Program', path: '/services/training-program', color: COLORS.PURPLE },
    { id: 'corporate', label: 'Corporate Event', path: '/services/corporate-event', color: COLORS.ORANGE },
    { id: 'csr', label: 'CSR', path: '/services/csr', color: COLORS.CORAL },
];

// Items inside the "Connect" dropdown
const connectItems = [
    {
        id: 'connect',
        label: 'Connect With Us',
        description: 'Get in touch & check availability',
        path: '/connection-hub',
        emoji: '🤝',
        color: COLORS.CORAL,
    },
    {
        id: 'blog',
        label: 'Blog & Insights',
        description: 'Articles, tips & industry news',
        path: '/blog',
        emoji: '✍️',
        color: COLORS.NAVY,
    },
];

const AltHeader: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [servicesOpen, setServicesOpen] = useState(false);
    const [connectOpen, setConnectOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const connectRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close connect dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (connectRef.current && !connectRef.current.contains(e.target as Node)) {
                setConnectOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isShrunk = isScrolled && !isHovered && window.innerWidth > 768;

    function navigateTo(path: string) {
        navigate(path);
        setMobileMenuOpen(false);
        setServicesOpen(false);
        setConnectOpen(false);
        const hashIndex = path.indexOf('#');
        if (hashIndex !== -1) {
            const hash = path.slice(hashIndex + 1);
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.replaceState(null, '', window.location.pathname);
                }
            }, 150);
        }
    }

    const pathname = location.pathname;
    const isActive = (p: string) => pathname === p || pathname.startsWith(p);

    const [selectedService, setSelectedService] = useState<string | null>(null);

    useEffect(() => {
        const match = services.find((s) => pathname.startsWith(s.path));
        setSelectedService(match ? match.id : null);
    }, [pathname]);

    // Is any "connect" item active?
    const activeConnectItem = connectItems.find(i => isActive(i.path));

    return (
        <header className="fixed top-6 left-0 right-0 z-50 px-4">
            <div
                className="max-w-6xl mx-auto flex justify-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setServicesOpen(false);
                    // Don't close connectOpen on nav hover-out — it has its own ref handler
                }}
            >
                {/* Main Nav Container */}
                <div
                    className={`
                        pointer-events-auto bg-white border-4 border-[#153462]
                        flex items-center justify-center
                        shadow-[6px_6px_0px_0px_rgba(21,52,98,1)]
                        transition-all duration-500 ease-out
                        ${isShrunk
                            ? 'scale-[0.92] w-20 h-20 px-0 rounded-full'
                            : 'scale-100 w-full h-20 px-4 md:px-10 rounded-full md:rounded-[2.5rem]'
                        }
                    `}
                >
                    <div className="flex items-center justify-between w-full relative">

                        {/* MOBILE: HAMBURGER */}
                        <div className="md:hidden flex-1">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 text-[#153462]"
                                aria-label="Open menu"
                            >
                                <Menu size={28} strokeWidth={3} />
                            </button>
                        </div>

                        {/* DESKTOP: LEFT SIDE */}
                        <div className={`hidden md:flex items-center gap-6 transition-all duration-350
                            ${isShrunk ? 'opacity-0 -translate-x-8 pointer-events-none absolute' : 'opacity-100 translate-x-0'}`}
                        >
                            {/* Home */}
                            <button
                                onClick={() => navigateTo('/')}
                                className={`text-lg font-black px-3 py-1 rounded-lg transition-all hover:rotate-3
                                    ${pathname === '/' ? 'bg-[#fcb22f] text-white' : 'text-[#153462]'}`}
                            >
                                HOME
                            </button>

                            {/* Services dropdown */}
                            <div className="relative group">
                                <button
                                    onMouseEnter={() => !isShrunk && setServicesOpen(true)}
                                    className="flex items-center text-lg font-black gap-1 px-3 py-1 rounded-lg transition-all hover:-rotate-3"
                                    style={
                                        selectedService
                                            ? { backgroundColor: services.find(s => s.id === selectedService)?.color, color: '#ffffff' }
                                            : { color: '#153462' }
                                    }
                                >
                                    SERVICES <span>{servicesOpen ? '▲' : '▼'}</span>
                                </button>

                                <div className={`absolute top-[130%] left-0 w-64 bg-white border-4 border-[#153462] rounded-2xl shadow-[6px_6px_0px_0px_#153462] transition-all duration-300
                                    ${servicesOpen && !isShrunk ? 'scale-100 opacity-100 visible' : 'scale-90 opacity-0 invisible'}`}
                                >
                                    <div className="p-2 flex flex-col gap-2">
                                        {services.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => navigateTo(s.path)}
                                                className="w-full text-left px-4 py-3 rounded-xl font-bold text-white border-2 border-[#153462]"
                                                style={{ backgroundColor: s.color }}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LOGO */}
                        <div className={`flex justify-center items-center transition-all duration-500 ${isShrunk ? 'absolute inset-0' : 'flex-1'}`}>
                            <button onClick={() => navigateTo('/')} className="flex items-center gap-2 group">
                                <img
                                    src={LogoImg}
                                    alt="EITO Group Logo"
                                    className={`${isShrunk ? 'w-10 h-10' : 'w-8 h-8 md:w-10 md:h-10'} object-contain`}
                                />
                                <span className={`text-xl md:text-2xl font-black tracking-tighter text-[#153462] ${isShrunk ? 'hidden' : 'block'}`}>
                                    EITO&nbsp;GROUP
                                </span>
                            </button>
                        </div>

                        {/* DESKTOP: RIGHT SIDE */}
                        <div className={`hidden md:flex items-center gap-4 transition-all duration-300
                            ${isShrunk ? 'opacity-0 translate-x-8 pointer-events-none absolute' : 'opacity-100 translate-x-0'}`}
                        >
                            {/* ── CONNECT dropdown ── */}
                            <div className="relative" ref={connectRef}>
                                <button
                                    onClick={() => setConnectOpen(prev => !prev)}
                                    className={`flex items-center gap-1.5 text-lg font-black px-3 py-1 rounded-lg transition-all hover:rotate-2`}
                                    style={
                                        activeConnectItem
                                            ? { backgroundColor: activeConnectItem.color, color: '#fff' }
                                            : { color: COLORS.NAVY }
                                    }
                                >
                                    CONNECT
                                    <ChevronDown
                                        size={16}
                                        strokeWidth={3}
                                        className={`transition-transform duration-200 ${connectOpen ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                </button>

                                {/* Dropdown panel */}
                                <div
                                    className={`absolute top-[130%] right-0 w-72 bg-white border-4 border-[#153462] rounded-2xl shadow-[6px_6px_0px_0px_#153462] transition-all duration-300 overflow-hidden
                                        ${connectOpen ? 'scale-100 opacity-100 visible' : 'scale-90 opacity-0 invisible'}`}
                                >
                                    <div className="p-2 flex flex-col gap-2">
                                        {connectItems.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => navigateTo(item.path)}
                                                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 border-[#153462] transition-all hover:scale-[1.02]
                                                    ${isActive(item.path) ? 'opacity-90' : ''}`}
                                                style={{
                                                    backgroundColor: item.id === 'blog' ? '#f7f9fc' : item.color,
                                                    color: item.id === 'blog' ? COLORS.NAVY : '#fff',
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{item.emoji}</span>
                                                    <div>
                                                        <div className="font-black text-sm">{item.label}</div>
                                                        <div
                                                            className="text-xs mt-0.5 font-medium opacity-80"
                                                        >
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Enquire CTA */}
                            <button
                                onClick={() => navigateTo('/connection-hub#availability-calendar')}
                                className="bg-[#fcb22f] border-4 border-[#153462] px-6 py-2 rounded-full font-black text-[#153462] shadow-[4px_4px_0px_0px_#153462] hover:shadow-[2px_2px_0px_0px_#153462] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                            >
                                ENQUIRE NOW
                            </button>
                        </div>

                        {/* MOBILE: BOOK button */}
                        <div className="md:hidden flex-1 flex justify-end">
                            <button
                                onClick={() => navigateTo('/connection-hub#availability-calendar')}
                                className="bg-[#fcb22f] border-2 border-[#153462] px-4 py-1.5 rounded-full font-black text-[10px]"
                            >
                                BOOK
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── MOBILE SLIDE-OVER MENU ── */}
            <div className={`fixed inset-0 bg-[#153462]/60 backdrop-blur-sm z-50 transition-opacity md:hidden
                ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            >
                <div className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white border-l-8 border-[#153462] p-6 transition-transform duration-300 overflow-y-auto
                    ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex justify-between items-center mb-10">
                        <span className="font-black text-2xl text-[#153462]">MENU</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 bg-[#ee424c] text-white border-2 border-[#153462] rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-4">
                        <button
                            onClick={() => navigateTo('/')}
                            className="text-left text-3xl font-black text-[#153462]"
                        >
                            HOME
                        </button>

                        <div className="h-1 bg-slate-100 my-2" />
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Our Services</span>
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => navigateTo(s.path)}
                                className="w-full text-left p-4 rounded-xl font-bold text-white shadow-[4px_4px_0px_0px_#153462]"
                                style={{ backgroundColor: s.color }}
                            >
                                {s.label}
                            </button>
                        ))}

                        <div className="h-1 bg-slate-100 my-2" />
                        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">More</span>
                        {connectItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(item.path)}
                                className="w-full text-left p-4 rounded-xl font-bold border-2 border-[#153462] flex items-center gap-3"
                                style={{
                                    backgroundColor: item.id === 'blog' ? '#f0f4f8' : item.color,
                                    color: item.id === 'blog' ? COLORS.NAVY : '#fff',
                                }}
                            >
                                <span className="text-xl">{item.emoji}</span>
                                <div>
                                    <div className="text-sm font-black">{item.label}</div>
                                    <div className="text-xs opacity-75 mt-0.5">{item.description}</div>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            <style>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .animate-float { animation: float 4s ease-in-out infinite; }
            `}</style>
        </header>
    );
};

export default AltHeader;