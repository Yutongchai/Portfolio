import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Collab from '../../../assets/contact.jpg';
import { Button } from '../../../components/ui/Button';
import ClientMarquee from './ClientMarquee';
import { supabase } from '../../../config/supabaseClient';

const PhilosophySection = () => {
  const [clients, setClients] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const { data, error } = await supabase
          .from('client_logos')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (data) setClients(data.map(logo => logo.logo_url));
      } catch (error) {
        console.error('Error fetching client logos:', error);
      }
    };
    fetchClientLogos();
  }, []);

  return (
    <section className="relative bg-[#f5f7fa] border-t-8 border-[#153462]">
      {/* 1. OUR CLIENTS SECTION */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#f68921] border-4 border-[#153462] px-4 py-1 mb-6 shadow-[4px_4px_0px_0px_#153462] -rotate-1">
              <span className="text-white font-black uppercase tracking-widest text-sm">Trusted Partnerships</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-[#153462] uppercase italic tracking-tighter leading-none">
              Our <span className="text-[#f68921]">Clients_</span>
            </h2>
            <p className="mt-8 text-xl text-[#153462] font-bold leading-tight">
              We have a handsome list of clients to be proud of. Join the ranks of industry leaders
              who have experienced the EITO difference.
            </p>
          </div>

          <div className="hidden md:block pb-2">
            <div className="w-32 h-32 border-8 border-[#153462] rounded-full flex items-center justify-center font-black text-[#153462] text-4xl rotate-12 bg-[#fcb22f]">
              ★
            </div>
          </div>
        </div>

        {/* Marquee with Brutalist Border */}
        <div className="relative border-y-8 border-[#153462] bg-white py-12 -mx-6 md:mx-0">
          {clients.length > 0 && (
            <ClientMarquee
              logos={clients}
              autoScrollSpeed={0.5}
              pauseOnHover={true}
            />
          )}
        </div>
      </div>

      {/* 2. GOOGLE REVIEWS -> ENHANCED CLIENT IMPACT BANNER */}
      <div className="bg-[#fcb22f] py-24 border-y-8 border-[#153462] relative overflow-hidden">
        {/* Background Pattern for extra Brutalist texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#153462 2px, transparent 2px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <a
            href={'https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D'}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative"
          >
            {/* The Hard Shadow (Offset) */}
            <div className="absolute inset-0 bg-[#153462] translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-all duration-300" />

            {/* The Sticker Content */}
            <div className="relative bg-white border-4 border-[#153462] p-8 md:p-14 flex flex-col lg:flex-row items-center gap-10">

              {/* Left Side: The Google "Badge" */}
              <div className="flex-shrink-0 relative">
                {/* A circular "Stamp" effect */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white border-4 border-[#153462] rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_#153462] group-hover:rotate-12 transition-transform duration-500">
                  <svg viewBox="0 0 24 24" className="w-12 h-12 md:w-16 md:h-16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                {/* "VERIFIED" floating tag */}
                <div className="absolute -bottom-2 -right-4 bg-[#12a28f] text-white border-2 border-[#153462] px-2 py-1 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_#153462]">
                  Verified
                </div>
              </div>

              {/* Center: Rating & Text */}
              <div className="flex-grow text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 bg-[#f68921] border-2 border-[#153462] flex items-center justify-center text-white font-black text-xl shadow-[2px_2px_0px_0px_#153462]">★</div>
                  ))}
                  <span className="ml-4 font-black text-3xl text-[#153462]">5.0 <span className="text-sm opacity-50 uppercase tracking-widest">Rating</span></span>
                </div>

                <h3 className="text-4xl md:text-6xl font-black text-[#153462] uppercase italic tracking-tighter leading-[0.9]">
                  See what our <br /> clients say <span className="text-[#f68921] underline decoration-4 underline-offset-4">about us_</span>
                </h3>
              </div>

              {/* Right Side: Action Button */}
              <div className="flex-shrink-0">
                <div className="relative group-hover:-translate-y-1 transition-transform">
                  <div className="absolute inset-0 bg-[#153462] translate-x-2 translate-y-2" />
                  <div className="relative bg-[#153462] text-white px-10 py-5 font-black uppercase text-xl italic tracking-widest border-4 border-[#153462] group-hover:bg-white group-hover:text-[#153462] transition-colors">
                    Read Reviews
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* 3. FINAL CALL TO ACTION BANNER */}
      <div className="w-full relative min-h-[600px] flex items-center overflow-hidden bg-white">
        {/* The Image Background with Brutalist Grayscale filter */}
        <div
          className="absolute inset-0 z-0 grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700"
          style={{
            backgroundImage: `url(${Collab})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-6xl font-black text-[#153462] leading-[0.85] mb-10 uppercase italic tracking-tighter">
              Let's Design Your<br />
              <span className="bg-[#f68921] text-white px-4 inline-block transform -rotate-1">NEXT Perfect</span> <span className="whitespace-nowrap">Team Experience_</span>
            </h2>

            <p className="text-2xl font-bold text-[#153462] mb-12 max-w-xl leading-tight border-l-8 border-[#fcb22f] pl-6">
              No pressure. No fees. <br />
              Just tailored experiences that bring people together.
            </p>

            <div className="flex flex-wrap gap-6">
              {/* PRIMARY BUTTON */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#153462] translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                <button
                  onClick={() => navigate('/connection-hub#check-availability')}
                  className="relative bg-[#f68921] border-4 border-[#153462] text-white font-black px-10 py-5 text-xl uppercase italic tracking-widest"
                >
                  Plan My Session
                </button>
              </div>

              {/* SECONDARY BUTTON */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#153462] translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
                <button
                  onClick={() => navigate('/work-showcase')}
                  className="relative bg-white border-4 border-[#153462] text-[#153462] font-black px-10 py-5 text-xl uppercase italic tracking-widest"
                >
                  Explore Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;