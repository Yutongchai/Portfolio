import { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import ClientDomeGallery from './ClientDomeGallery';
import ClientMarquee from './ClientMarquee';
import { GoogleReviewTestimonials } from './GoogleReviewTestimonials';
import { supabase } from '../../../config/supabaseClient';

// Google Reviews - replace with actual Google Review data
const googleReviews = [
  {
    quote: "EITO Group transformed our team! The activities were engaging and perfectly tailored to our needs. Our communication and collaboration have improved dramatically.",
    name: "Sarah Johnson",
    profileImage: "/Portfolio/customers/advelsoft.jpg",
    rating: 5,
    date: "2 weeks ago",
    reviewUrl: "https://www.google.com/maps"
  },
  {
    quote: "Outstanding experience! The facilitators were professional, energetic, and really knew how to bring our team together. Highly recommend for any company looking to boost morale.",
    name: "Michael Chen",
    profileImage: "/Portfolio/customers/colgate.png",
    rating: 5,
    date: "1 month ago",
    reviewUrl: "https://www.google.com/maps"
  },
  {
    quote: "We've worked with several team building companies, but EITO Group stands out. The activities were fun, meaningful, and led to real improvements in how we work together.",
    name: "Emily Rodriguez",
    profileImage: "/Portfolio/customers/advelsoft.jpg",
    rating: 5,
    date: "3 months ago",
    reviewUrl: "https://www.google.com/maps"
  },
  {
    quote: "Absolutely fantastic! Our team had a blast and learned so much. The impact on our workplace culture has been incredible. Worth every penny!",
    name: "David Kim",
    profileImage: "/Portfolio/customers/colgate.png",
    rating: 5,
    date: "1 month ago",
    reviewUrl: "https://www.google.com/maps"
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
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="relative z-10 w-full">
        {/* Section Header */}
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
        {/* Added a subtle gradient mask on the sides to make logos fade in/out */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {clients.length > 0 && (
            <div className="py-10 bg-[#153462]/[0.02]">
              <ClientMarquee
                logos={clients}
                autoScrollSpeed={0.5}
                pauseOnHover={true}
              />
            </div>
          )}
        </div>

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

        {/* Google Reviews Testimonials */}
        {/* Original testimonials section (optional, can be moved below banner) */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8 px-6">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Clients Say
            </h3>
          </div>
          <GoogleReviewTestimonials reviews={googleReviews} autoplay={true} />
        </motion.div>

        {/* Framed banner section */}
        {/* Framed banner section */}
        <div className="w-full flex justify-center my-20 px-6">
          <div
            className="w-full md:w-[85%] border-[1px] border-[#153462]/20 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden relative shadow-2xl shadow-[#153462]/10"
            style={{
              minHeight: '400px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
            }}
          >
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f68921] opacity-[0.03] rounded-full -mr-20 -mt-20 blur-3xl" />

            <div className="flex-[1.2] min-w-0 z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-[#153462] leading-[1.1] mb-4 uppercase tracking-tighter">
                Let's Design<br className="hidden md:block" />
                <span className="text-[#f68921]">Your Next</span> Team Session
              </h2>

              <p className="text-xl md:text-2xl font-medium text-[#153462]/70 mb-10 max-w-xl">
                No obligation. No consultation fee. <br className="hidden sm:block" />
                <span className="italic border-b-2 border-[#f68921]/30">Just ideas that work.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-[#153462] hover:bg-[#1c447a] text-white font-bold px-10 py-7 rounded-2xl text-lg shadow-lg transition-all hover:-translate-y-1 active:scale-95"
                  onClick={() => navigate('/connection-hub')}
                >
                  Book a Free Consultation
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent hover:bg-[#153462]/5 text-[#153462] font-bold px-10 py-7 rounded-2xl text-lg border-2 border-[#153462] transition-all active:scale-95"
                  onClick={() => navigate('/work-showcase')}
                >
                  Explore Our Services
                </Button>
              </div>
            </div>

            {/* Right Side: Image with floating animation */}
            <div className="flex-1 flex justify-center items-center mt-12 md:mt-0 relative">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <img
                  src={import.meta.env.BASE_URL + "/ready.svg"}
                  alt="Ready to start"
                  className="w-full max-w-[380px] h-auto object-contain md:scale-125 drop-shadow-2xl"
                />
              </motion.div>

              {/* Decorative glow behind image */}
              <div className="absolute w-48 h-48 bg-[#153462] opacity-10 rounded-full blur-[80px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
