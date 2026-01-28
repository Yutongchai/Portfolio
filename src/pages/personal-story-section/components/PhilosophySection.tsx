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
        <motion.div
          className="text-center mb-12 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg uppercase tracking-wider text-muted-foreground mb-3">
            TAKE A LOOK AT
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We have a handsome list of clients to be proud of. Book today and watch your company join the list!
          </p>
        </motion.div>

        {/* Horizontal Scrolling Carousel */}
        {clients.length > 0 && (
          <ClientMarquee
            logos={clients}
            autoScrollSpeed={0.5}
            pauseOnHover={true}
          />
        )}

        {/* Additional content section */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Start building with us today and see the difference.
            </h2>
            {/* <p className="text-muted-foreground">
              Start building with us today and see the difference.
            </p> */}
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
        <div className="w-full flex justify-center my-20">
          <div
            className="w-full md:w-[80%] border-2 border-[#695da5] rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center justify-between overflow-visible"
            style={{ minHeight: '340px', background: 'white' }}
          >
            <div className="flex-1 min-w-0 z-10">
              <h2 className="text-4xl md:text-5xl font-black text-[#695da5] leading-tight mb-2 uppercase tracking-tight">
                Ready to<br className="hidden md:block" /> Get Started?
              </h2>
              <div className="text-2xl md:text-3xl font-medium text-[#fcb22f] mb-8 italic">
                No fee required.
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-white hover:bg-gray-50 text-[#695da5] font-bold px-10 py-6 rounded-2xl text-lg shadow-sm border-2 border-[#695da5] transition-all active:scale-95"
                  onClick={() => navigate('/connection-hub')}
                >
                  Get in Touch
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-[#695da5] hover:bg-[#574a8e] text-white font-bold px-10 py-6 rounded-2xl text-lg shadow-lg transition-all active:scale-95"
                  onClick={() => navigate('/work-showcase')}
                >
                  Our Services
                </Button>
              </div>
            </div>

            {/* Right Side: Image with no background container */}
            <div className="flex-1 flex justify-center items-center mt-10 md:mt-0 relative">
              {/* Optional: Decorative EITO Element behind the person */}
              <div className="absolute w-64 h-64 bg-[#695da5] opacity-5 rounded-full blur-3xl" />

              <img
                src={import.meta.env.BASE_URL + "/ready.svg"}
                alt="Ready to start"
                className="relative z-10 w-full max-w-[400px] h-auto object-contain transform md:scale-125 transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;