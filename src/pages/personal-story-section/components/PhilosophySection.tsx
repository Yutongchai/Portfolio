import { motion } from 'framer-motion';
import ClientDomeGallery from './ClientDomeGallery';
import { GoogleReviewTestimonials } from './GoogleReviewTestimonials';

// Client logos - you can replace these URLs with actual client logos
const clients = [
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
  '/Portfolio/customers/advelsoft.jpg',
  '/Portfolio/customers/colgate.png',
];

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
        <ClientDomeGallery
          images={clients}
          fit={0.5}
          minRadius={1000}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
        />

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
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;