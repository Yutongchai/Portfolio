import { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Collab from '../../../assets/contact.jpg';
import { Button } from '../../../components/ui/Button';
import ClientDomeGallery from './ClientDomeGallery';
import ClientMarquee from './ClientMarquee';
import { GoogleReviewTestimonials } from './GoogleReviewTestimonials';
import { supabase } from '../../../config/supabaseClient';

// CSS for floating blob animations
const animationStyles = `
  @keyframes float-philosophy-1 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    33% {
      transform: translate(50px, -80px) rotate(120deg) scale(1.1);
    }
    66% {
      transform: translate(-40px, 60px) rotate(240deg) scale(0.95);
    }
  }

  @keyframes float-philosophy-2 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-60px, 100px) rotate(180deg);
    }
  }

  @keyframes float-philosophy-3 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-70px, -50px) scale(1.15);
    }
    66% {
      transform: translate(40px, 80px) scale(0.9);
    }
  }

  @keyframes float-philosophy-4 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg) scale(1);
      opacity: 0.05;
    }
    50% {
      transform: translate(80px, -60px) rotate(180deg) scale(1.2);
      opacity: 0.08;
    }
  }

  .animate-float-philosophy-1 {
    animation: float-philosophy-1 28s ease-in-out infinite;
  }

  .animate-float-philosophy-2 {
    animation: float-philosophy-2 22s ease-in-out infinite;
  }

  .animate-float-philosophy-3 {
    animation: float-philosophy-3 26s ease-in-out infinite;
  }

  .animate-float-philosophy-4 {
    animation: float-philosophy-4 24s ease-in-out infinite;
  }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

// Google Reviews - replace with actual Google Review data
const googleReviews = [
  {
    quote: "EITO Group transformed our team! The activities were engaging and perfectly tailored to our needs. Our communication and collaboration have improved dramatically.",
    name: "Sarah Johnson",
    profileImage: "/Portfolio/customers/advelsoft.jpg",
    rating: 5,
    date: "2 weeks ago",
    reviewUrl: "https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    quote: "Outstanding experience! The facilitators were professional, energetic, and really knew how to bring our team together. Highly recommend for any company looking to boost morale.",
    name: "Michael Chen",
    profileImage: "/Portfolio/customers/colgate.png",
    rating: 5,
    date: "1 month ago",
    reviewUrl: "https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    quote: "We've worked with several team building companies, but EITO Group stands out. The activities were fun, meaningful, and led to real improvements in how we work together.",
    name: "Emily Rodriguez",
    profileImage: "/Portfolio/customers/advelsoft.jpg",
    rating: 5,
    date: "3 months ago",
    reviewUrl: "https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D"
  },
  {
    quote: "Absolutely fantastic! Our team had a blast and learned so much. The impact on our workplace culture has been incredible. Worth every penny!",
    name: "David Kim",
    profileImage: "/Portfolio/customers/colgate.png",
    rating: 5,
    date: "1 month ago",
    reviewUrl: "https://www.google.com.my/maps/place/EITO+Group/@4.186514,109.1677,6z/data=!4m18!1m9!3m8!1s0x4a24fc223178a71f:0xbd1437cea1df2767!2sEITO+Group!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z!3m7!1s0x4a24fc223178a71f:0xbd1437cea1df2767!8m2!3d4.186514!4d109.1677!9m1!1b1!16s%2Fg%2F11yv7g2g7z?entry=ttu&g_ep=EgoyMDI2MDIxMC4wIKXMDSoASAFQAw%3D%3D"
  }
];

interface PhilosophySectionProps {
  philosophies?: any[];
}

const PhilosophySection = ({ philosophies }: PhilosophySectionProps) => {
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

        if (data && data.length > 0) {
          // logo_url already contains the full public URL
          const logoUrls = data.map(logo => logo.logo_url);
          setClients(logoUrls);
          console.log('Fetched client logos:', logoUrls);
        } else {
          console.log('No active client logos found');
        }
      } catch (error) {
        console.error('Error fetching client logos:', error);
      }
    };

    fetchClientLogos();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative z-10 w-full">
        {/* Our Clients Section - Clean White Background */}
        <div className="py-16">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16 px-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-[#f68921] mb-4">
              Trusted Partnerships
            </p>
            <h2 className="text-4xl lg:text-6xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
              Our Clients
            </h2>
            <div className="w-20 h-1 bg-[#f68921] mx-auto mb-8 rounded-full"></div> {/* Decorative underline */}
            <p className="text-lg md:text-xl text-[#153462]/70 max-w-2xl mx-auto font-medium">
              We have a handsome list of clients to be proud of. <br className="hidden md:block" />
              <span className="text-[#153462]">Book today</span> and watch your company join the list!
            </p>
          </motion.div>

          {/* Horizontal Scrolling Carousel Wrapper */}
          <div className="relative">
            {clients.length > 0 && (
              <div className="py-10">
                <ClientMarquee
                  logos={clients}
                  autoScrollSpeed={0.5}
                  pauseOnHover={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Unified Background Section for Content + Testimonials */}
        <div className="relative overflow-hidden">
          {/* Single Continuous Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5f7fa] via-[#FFEBD2] to-white z-0">
            {/* Floating Blobs */}
            <div 
              className="absolute top-10 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.07] blur-3xl animate-float-philosophy-1" 
              style={{ backgroundColor: '#12a28f' }} 
            />
            <div 
              className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.06] blur-3xl animate-float-philosophy-2" 
              style={{ backgroundColor: '#fcb22f' }} 
            />
            <div 
              className="absolute top-1/2 -right-20 w-[450px] h-[450px] rounded-full opacity-[0.08] blur-3xl animate-float-philosophy-3" 
              style={{ backgroundColor: '#f68921' }} 
            />
            <div 
              className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl animate-float-philosophy-4" 
              style={{ backgroundColor: '#153462' }} 
            />
            
            {/* Subtle Dot Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]" 
              style={{ 
                backgroundImage: `radial-gradient(circle, #153462 1px, transparent 1px)`, 
                backgroundSize: '40px 40px' 
              }} 
            />
          </div>
          
          {/* Content Layer */}
          <div className="relative z-10">
            {/* Additional content section */}
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-2xl md:text-4xl font-black text-[#153462] mb-4 uppercase tracking-tight"
                >
                  Start building with us <span className="text-[#f68921]">today</span> and see the difference.
                </motion.h2>
                <p className="text-[#153462]/60 font-medium tracking-wide">
                  EXPERIENCE • ENGAGEMENT • RESULTS
                </p>
              </div>
            </section>

            {/* Original 3D Dome (commented out for comparison) */}
            {/* {clients.length > 0 && (
              <ClientDomeGallery
                images={clients}
                fit={0.5}
                minRadius={1000}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
                grayscale={false}
              />
            )} */}
            {/* Google Reviews banner - clickable and opens Google Reviews in a new tab */}
            <motion.div
              className="py-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a
                href={googleReviews[0]?.reviewUrl || 'https://www.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="block max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center justify-center w-28 h-16 rounded-lg bg-white">
                      <span className="text-xl font-extrabold text-gray-800">Google</span>
                      <span className="text-sm text-gray-500">Reviews</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.168L12 18.897l-7.336 3.867 1.402-8.168L.132 9.21l8.2-1.192z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-bold text-gray-800">5.0</span>
                        <span className="text-sm text-gray-500">(Google)</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">See verified client reviews on Google. Click to view full reviews.</p>
                    </div>
                  </div>

                  <div>
                    <button className="bg-[#f68921] text-white px-4 py-2 rounded-lg font-semibold">Read Reviews</button>
                  </div>
                </div>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Full-width banner section */}
        <div className="w-full">
          <div
            className="w-full flex flex-col md:flex-row items-stretch overflow-hidden relative"
            style={{ minHeight: '480px' }}
          >
            {/* Right Side: The Photo (Hidden on mobile or as background) */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${Collab})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center right',
              }}
            />

            {/* The Gradient Mask - Stronger on the left for text legibility, clear on the right */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent md:to-transparent" />

            {/* Content Layer */}
            <div className="relative z-20 flex-1 flex flex-col justify-center p-10 md:p-16 lg:p-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-6xl font-black text-[#153462] leading-[1.1] mb-6 uppercase tracking-tight">
                  Let's Design Your<br />
                  <span className="text-[#f68921]">NEXT Perfect</span> Team Experience
                </h2>

                <p className="text-lg md:text-xl font-medium text-[#153462]/80 mb-10 max-w-md leading-relaxed">
                  No pressure. No fees.<br />
                  <span className="italic relative">
                    Tailored experiences that bring teams together.
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#f68921]/20 -z-10"></span>
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-[#153462] hover:bg-[#1c447a] text-white font-bold px-8 py-7 rounded-xl text-lg shadow-xl transition-all hover:-translate-y-1"
                    onClick={() => navigate('/connection-hub#check-availability')}
                  >
                    Plan My Team Session
                  </Button>

                  <Button
                    variant="outline"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white text-[#153462] font-bold px-8 py-7 rounded-xl text-lg border-2 border-[#153462] transition-all"
                    onClick={() => navigate('/work-showcase')}
                  >
                    Explore Experiences
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
