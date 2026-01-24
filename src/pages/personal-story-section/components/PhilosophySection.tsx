import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import ClientDomeGallery from './ClientDomeGallery';
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

        {/* 3D Dome Gallery */}
        {clients.length > 0 && (
          <ClientDomeGallery
            images={clients}
            fit={0.5}
            minRadius={1000}
            maxVerticalRotationDeg={0}
            segments={34}
            dragDampening={2}
            grayscale={false}
          />
        )}

        {/* Google Reviews Testimonials */}
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
            {/* <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real reviews from real teams who've experienced the EITO difference
            </p> */}
          </div>
          <GoogleReviewTestimonials reviews={googleReviews} autoplay={true} />

          <div className="mt-8 text-center">
            <Button
              variant="default"
              size="lg"
              className="bg-[#ee424c] hover:bg-[#d73b45] text-white font-semibold px-6 py-3"
              onClick={() => navigate('/work-showcase')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;