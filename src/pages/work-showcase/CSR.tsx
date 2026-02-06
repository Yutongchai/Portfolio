import React, { useState, useEffect } from 'react';
import Questionnaire from './components/Questionnaire';
import { motion, AnimatePresence } from 'framer-motion';
import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';
import { Globe, Heart, GraduationCap, TreePine, Users, Smile, Target, CheckCircle, Award, ArrowUp } from 'lucide-react';
import HRDCorSection from './components/HRDCorBanner';
import EnvironmentImg from '../../assets/csr/environment.jpg';
import CommunityImg from '../../assets/csr/community.jpg';
import WellbeingImg from '../../assets/csr/wellbeing.jpg';
// Slider Images Data
const sliderImages = [
  {
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
    caption: "Building a Greener Future"
  },
  {
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
    caption: "Empowering Local Communities"
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
    caption: "Nurturing the Next Generation"
  }
];

type CategoryCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

const CategoryCard = ({ title, description, icon, color }: CategoryCardProps) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.02 }}
    className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col group cursor-default"
  >
    <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="text-2xl font-black mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed flex-grow font-medium">{description}</p>
    <div className="mt-8 h-1.5 w-12 rounded-full transition-all duration-500 group-hover:w-full" style={{ backgroundColor: color }} />
  </motion.div>
);


const CSR = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fdfdfb] text-[#23242b] overflow-x-hidden">
      {/* Fixed Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-100/30 blur-[120px]" />
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[50%] rounded-full bg-blue-50/50 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-teal-50/40 blur-[120px]" />
      </div>

      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/work-showcase" },
          { label: "Connect", href: "/connection-hub" },
        ]}
        activeHref={"/work-showcase"}
      />

      {/* --- HERO SLIDER SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={sliderImages[currentSlide].url}
              className="w-full h-full object-cover"
              alt="CSR Showcase"
            />
          </motion.div>
        </AnimatePresence>

        {/* Floating Content Overlay */}
        <div className="relative z-20 text-center text-white px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-6 mb-6"
          >
            {/* The "Line indicating the topic" */}
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
            <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">
              Social Responsibility
            </span>
            <div className="h-[2px] w-20 bg-[#fcb22f]" />
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter leading-tight"
          >
            Corporate Social<br />Responsibility
          </motion.h1>
          {/* <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl font-bold text-[#fcb22f] mb-6 tracking-[0.3em] uppercase"
          >
            (CSR)
          </motion.p> */}
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-90 leading-relaxed mb-10">
            Create positive impact through meaningful CSR initiatives that align with your company values.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#csr-categories"
              className="rounded-full bg-[#fcb22f] px-10 py-3 font-bold text-[#153462] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(246,137,33,0.65)]"
            >
              Explore Activities
            </a>
            <a
              href="#csr-inquiry"
              className="rounded-full border border-white/70 px-10 py-3 font-bold backdrop-blur transition-colors duration-300 hover:bg-white/10"
            >
              Make Inquiry
            </a>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {sliderImages.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-[#fcb22f]' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* --- HELPING SECTION --- */}
      <section className="relative py-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center bg-gradient-to-b from-white via-orange-50/20 to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#fcb22f] to-transparent" />
        <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight">
          How CSR with EITO <br /><span className="text-[#fcb22f]">helps your organization</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-3xl leading-relaxed mb-16 font-medium">
          We bridge corporate vision with grassroots needs. Our approach ensures your
          initiatives are HRD-claimable, operationally seamless, and leave a measurable impact
          on both the community and your brand equity.
        </p>
      </section>

      {/* --- HRD CORP BANNER --- */}
      <HRDCorSection />

      {/* --- FOCUS AREAS (3 CATEGORIES WITH NUMBERS) --- */}
      <section id="csr-categories" className="py-24 px-6 bg-[#23242b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#fcb22f] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Focus Areas</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              Our CSR Categories
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
              Creating meaningful impact across environmental, social, and employee wellbeing initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Environmental Sustainability",
                description: "Initiatives to reduce waste, conserve energy, and protect natural resources.",
                image: EnvironmentImg,
                tag: "Ecology"
              },
              {
                title: "Community Engagement",
                description: "Volunteering, charity drives, and programs that support local communities.",
                image: CommunityImg,
                tag: "Society"
              },
              {
                title: "Employee Wellbeing",
                description: "Programs that promote diversity, mental health, and workplace support.",
                image: WellbeingImg,
                tag: "People"
              },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative h-[600px] overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700"
              >
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {/* Multi-layered Overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#153462] via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* Floating Category Tag */}
                <div className="absolute top-8 left-8 z-20">
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    {card.tag}
                  </span>
                </div>

                {/* Large Stylized Number (Replaces Icon) */}
                <div className="absolute top-4 right-8 z-10 pointer-events-none">
                  <span className="text-[120px] font-black text-white/10 leading-none select-none transition-all duration-500 group-hover:text-white/20">
                    0{idx + 1}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
                  {/* Decorative Line */}
                  <div className="w-12 h-1 bg-[#fcb22f] mb-6 transition-all duration-500 group-hover:w-full" />

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tighter uppercase">
                    {card.title}
                  </h3>

                  <div className="overflow-hidden">
                    <p className="text-white/80 text-lg leading-relaxed transform transition-all duration-500 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      {card.description}
                    </p>
                  </div>

                  {/* Subtle "Explore" call to action that appears on hover */}
                  {/* <div className="mt-6 flex items-center gap-2 text-[#fcb22f] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    LEARN MORE <div className="h-[1px] w-4 bg-[#fcb22f]" />
                  </div> */}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHAT WE DO --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter text-[#153462]">
              What We Do
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              Comprehensive CSR solutions from strategy to execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Target size={32} />, title: 'Strategic Planning', desc: 'Align CSR initiatives with your business objectives and values' },
              { icon: <Users size={32} />, title: 'Community Partnerships', desc: 'Connect with NGOs and local organizations for greater impact' },
              { icon: <TreePine size={32} />, title: 'Environmental Programs', desc: 'Design and execute sustainability initiatives' },
              { icon: <Heart size={32} />, title: 'Volunteer Coordination', desc: 'Organize employee volunteering and charity drives' },
              { icon: <Award size={32} />, title: 'Impact Measurement', desc: 'Track and report on social and environmental outcomes' },
              { icon: <CheckCircle size={32} />, title: 'HRD Compliance', desc: 'Ensure all programs meet HRD Corp claimability requirements' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                className="bg-white border border-slate-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-[#f68921] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-[#153462] mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <a
              href="#csr-inquiry"
              className="inline-flex items-center gap-3 bg-[#f68921] text-white px-12 py-4 rounded-full font-black text-lg uppercase tracking-wider hover:bg-[#d67419] transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(246,137,33,0.5)] hover:-translate-y-1"
            >
              <span>Start Your CSR Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- WHY CHOOSE US (Sticky Spotlight Section) --- */}
      <section className="py-32 px-6 bg-[#0f172a] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Left Column: Sticky Title */}
            <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-[#fcb22f] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
                  EITO Advantage
                </span>
                <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase tracking-tighter leading-none">
                  Why <br /> <span className="text-white/20">Choose</span> <br /> Us
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed">
                  Partner with us for CSR initiatives that create lasting positive change and align with your corporate DNA.
                </p>

                {/* Decorative element */}
                <div className="mt-10 hidden lg:block">
                  <div className="h-1 w-20 bg-[#fcb22f]" />
                </div>
              </motion.div>
            </div>

            {/* Right Column: Large Interactive Cards */}
            <div className="lg:w-2/3 space-y-8">
              {[
                {
                  t: "Measurable Impact",
                  d: "We don't just 'do' CSR; we track it. We provide detailed reports on the social and environmental outcomes of your project, giving you data to share with stakeholders.",
                  icon: <Award size={48} />,
                  color: "from-blue-500/20"
                },
                {
                  t: "Strategic Alignment",
                  d: "We tailor initiatives to match your company's core values and industry focus, ensuring your social efforts support your business brand identity.",
                  icon: <Target size={48} />,
                  color: "from-orange-500/20"
                },
                {
                  t: "End-to-End Management",
                  d: "From logistics to NGO coordination and HRD Corp claim processing, we handle every detail so your team can focus on their core work.",
                  icon: <CheckCircle size={48} />,
                  color: "from-emerald-500/20"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className={`relative group bg-gradient-to-r ${item.color} to-transparent border-l-4 border-[#fcb22f] p-12 rounded-r-[2rem] hover:bg-white/5 transition-all duration-500`}
                >
                  {/* Background Accent */}
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    {item.icon}
                  </div>

                  <div className="relative z-10">
                    <div className="text-[#fcb22f] mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">
                      {item.t}
                    </h3>
                    <p className="text-white/70 text-lg leading-relaxed font-medium max-w-xl">
                      {item.d}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- INQUIRY FORM --- */}
      <section id="csr-inquiry" className="py-24 px-6 bg-gradient-to-t from-white via-slate-50/40 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Get Started</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
              Plan Your CSR Initiative
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              Share your vision with us and let's create meaningful social impact together.
            </p>
          </div>
          <Questionnaire formType="csr" />
        </div>
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 left-8 z-50 bg-white text-[#153462] rounded-full px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 flex items-center gap-2 font-bold text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={20} />
            <span className="uppercase tracking-wider">Top of page</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CSR;