import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoImg from '/black.png';
import { Menu, X } from 'lucide-react';

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
    const [open, setOpen] = useState(false); // Services Dropdown
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Drawer

    function navigateTo(path: string) {
        navigate(path);
        setMobileMenuOpen(false);
        setOpen(false);

        const hashIndex = path.indexOf('#');
        if (hashIndex !== -1) {
            const hash = path.slice(hashIndex + 1);
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    return (
        <header className="fixed top-6 left-0 right-0 z-50 px-4">
            <div
                className="max-w-6xl mx-auto flex justify-center"
                onMouseLeave={() => setOpen(false)}
            >
                {/* Stagnant Nav Container */}
                <div className="w-full h-20 px-4 md:px-10 bg-white border-4 border-[#153462] flex items-center justify-center shadow-[6px_6px_0px_0px_#153462] rounded-full md:rounded-[2.5rem]">

                    <div className="flex items-center justify-between w-full relative">

                        {/* MOBILE: HAMBURGER */}
                        <div className="md:hidden flex-1">
                            <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[#153462]">
                                <Menu size={28} strokeWidth={3} />
                            </button>
                        </div>

                        {/* DESKTOP: LEFT NAV */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => navigateTo('/')}
                                className={`text-lg font-black px-4 py-1 rounded-xl transition-all hover:rotate-2 ${pathname === '/' ? 'bg-[#fcb22f] text-[#153462]' : 'border-transparent text-[#153462]'}`}
                            >
                                HOME
                            </button>

                            <div className="relative">
                                <button
                                    onMouseEnter={() => setOpen(true)}
                                    className="flex items-center text-lg font-black gap-2 px-4 py-1 rounded-xl transition-all shadow-[3px_3px_0px_0px_#153462] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                    style={selectedService ? { backgroundColor: services.find(s => s.id === selectedService)?.color, color: '#ffffff' } : { color: '#153462' }}
                                >
                                    SERVICES <span className="text-xs">{open ? '▲' : '▼'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className={`absolute top-[140%] left-0 w-64 bg-white border-4 border-[#153462] rounded-2xl shadow-[6px_6px_0px_0px_#153462] transition-all duration-200 ${open ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                                    <div className="p-2 flex flex-col gap-2">
                                        {services.map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => navigateTo(s.path)}
                                                className="w-full text-left px-4 py-3 rounded-xl font-bold text-white border-2 border-[#153462] hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_#153462]"
                                                style={{ backgroundColor: s.color }}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LOGO: CENTERED */}
                        <div className="flex-1 flex justify-center items-center">
                            <button onClick={() => navigateTo('/')} className="flex items-center gap-2 group">
                                <img src={LogoImg} alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform" />
                                <span className="text-xl md:text-2xl font-black tracking-tighter text-[#153462]">
                                    EITO&nbsp;GROUP
                                </span>
                            </button>
                        </div>

                        {/* DESKTOP: RIGHT NAV */}
                        <div className="hidden md:flex items-center gap-6">
                            <button
                                onClick={() => navigateTo('/connection-hub')}
                                className={`text-lg font-black px-4 py-1 rounded-xl hover:text-[#153462] transition-colors hover:rotate-2 ${isActive('/connection-hub') ? 'bg-[#fcb22f] text-[#153462]' : 'text-[#153462]'}`}
                            >
                                CONNECT
                            </button>
                            <button
                                onClick={() => navigateTo('/connection-hub#availability-calendar')}
                                className="bg-[#fcb22f] border-4 border-[#153462] px-6 py-2 rounded-full font-black text-[#153462] shadow-[4px_4px_0px_0px_#153462] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                BOOK NOW!
                            </button>
                        </div>

                        {/* MOBILE: MINI BOOK */}
                        <div className="md:hidden flex-1 flex justify-end">
                            <button onClick={() => navigateTo('/connection-hub#availability-calendar')} className="bg-[#fcb22f] border-2 border-[#153462] px-4 py-1.5 rounded-full font-black text-[10px] shadow-[2px_2px_0px_0px_#153462]">
                                BOOK
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            <div className={`fixed inset-0 bg-[#153462]/60 backdrop-blur-sm z-50 transition-opacity md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white border-l-8 border-[#153462] p-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-10">
                        <span className="font-black text-2xl text-[#153462] italic">MENU_</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-[#ee424c] text-white border-2 border-[#153462] rounded-lg shadow-[3px_3px_0px_0px_#153462]">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-4">
                        <button onClick={() => navigateTo('/')} className="text-left text-3xl font-black text-[#153462] hover:text-[#fcb22f]">HOME</button>
                        <div className="h-1 bg-[#153462]/10 my-2" />
                        <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Our Services</span>
                        {services.map(s => (
                            <button
                                key={s.id}
                                onClick={() => navigateTo(s.path)}
                                className="w-full text-left p-4 rounded-xl font-bold text-white shadow-[4px_4px_0px_0px_#153462] border-2 border-[#153462]"
                                style={{ backgroundColor: s.color }}
                            >
                                {s.label}
                            </button>
                        ))}
                        <div className="h-1 bg-[#153462]/10 my-2" />
                        <button onClick={() => navigateTo('/connection-hub')} className="text-left text-3xl font-black text-[#153462] hover:text-[#ee424c]">CONNECT</button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default AltHeader;