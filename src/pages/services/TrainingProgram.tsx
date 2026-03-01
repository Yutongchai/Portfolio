import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, Award, Star, CheckCircle, Users, Target, Lightbulb, ArrowRight, TrendingUp, Clock, Shield, ArrowUp } from 'lucide-react';
import TrainingImg from '../../assets/corporate_training/training.webp';
import SoftSkillsImg from '../../assets/corporate_training/soft.webp';
import LeadershipImg from '../../assets/corporate_training/leader.webp';
import MentalHealthImg from '../../assets/corporate_training/mental.webp';
import ExpertiseImg from '../../assets/corporate_training/expertise.webp';
import DNAImg from '../../assets/corporate_training/dna.webp';
import VisionImg from '../../assets/corporate_training/vision.webp';
import SuccessImg from '../../assets/corporate_training/success.webp';
import TruthImg from '../../assets/corporate_training/truth.webp';
import ExcellenceImg from '../../assets/corporate_training/excellence.webp';
import ResultImg from '../../assets/corporate_training/results.webp';
import Hero from '../../components/ui/Hero';
import Footer from '../../components/ui/Footer';
import ScrollableCards from '../../components/ui/ScrollableCards';
// Lazy load heavy components for faster initial load
const QuestionnaireTP = lazy(() => import('./components/QuestionnaireTP'));
const HRDCorBanner = lazy(() => import('./components/HRDCorBanner'));

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const TrainingProgram = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const trainingTypes = [
    {
      title: 'Mental Health & Wellbeing',
      description: 'Fostering workplace wellness and emotional resilience through comprehensive mental health support and stress management strategies.',
      icon: Heart,
      color: '#12a28f',
      image: MentalHealthImg,
      size: 'large' // Takes 2 columns on desktop
    },
    {
      title: 'Leadership & Management',
      description: 'Strategic coaching for current and future leaders, empowering them to inspire teams and drive organizational excellence.',
      icon: Award,
      color: '#153462',
      image: LeadershipImg,
      size: 'medium'
    },
    {
      title: 'Personal Development & Soft Skills',
      description: 'Enhancing individual effectiveness and soft skills to boost confidence, communication, and professional growth.',
      icon: Star,
      color: '#f68921',
      image: SoftSkillsImg,
      size: 'medium'
    }
  ];

  const methodology = [
    { step: 1, title: 'Needs Assessment', desc: 'We begin with a comprehensive analysis of your team\'s current skills and organizational goals.', icon: Target },
    { step: 2, title: 'Custom Design', desc: 'Our experts craft tailored training modules aligned with your specific business objectives.', icon: Lightbulb },
    { step: 3, title: 'Engaging Delivery', desc: 'Interactive workshops and hands-on activities ensure maximum engagement and retention.', icon: Users },
    { step: 4, title: 'Ongoing Support', desc: 'Post-training follow-ups and resources to sustain learning and measure long-term impact.', icon: CheckCircle }
  ];

  const improvements = [
    { metric: 3, suffix: 'x', label: 'Team Performance', color: '#e1620b' },
    { metric: 85, suffix: '%', label: 'Employee Satisfaction', color: '#12a28f' },
    { metric: 40, suffix: '%', label: 'Productivity Increase', color: '#695da5' },
    { metric: 90, suffix: '%', label: 'Retention Rate', color: '#0074b4' }
  ];

  const coreValues = [
    {
      title: 'Driven by Your Vision.',
      description: 'We understand that every organization has unique goals. Our training programs are designed to align with your vision, ensuring that every session contributes meaningfully to your strategic objectives.',
      value: 'Excellence',
      image: VisionImg
    },
    {
      title: 'Truth in Every Session.',
      description: 'We deliver training with honesty and transparency. Our facilitators are committed to providing genuine insights and practical knowledge that your team can trust and apply immediately.',
      value: 'Integrity',
      image: TruthImg
    },
    {
      title: 'Together We Achieve More.',
      description: 'Collaboration is at the heart of learning. We foster an environment where participants engage, share experiences, and learn from one another, building stronger teams through every interaction.',
      value: 'Teamwork',
      image: SuccessImg
    },
    {
      title: 'Excellence Without Compromise.',
      description: 'We are dedicated to delivering training excellence that goes beyond expectations. Our programs are meticulously crafted to ensure measurable outcomes and lasting impact on your organization.',
      value: 'Outstanding',
      image: ExcellenceImg
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % coreValues.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToForm = () => {
    document.getElementById('training-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 1. Get the ID from storage
    const formId = sessionStorage.getItem('scrollToFormId');

    if (formId) {
      // 2. We use a slightly longer timeout (600ms) because 
      // these pages use Lazy Loading for the forms.
      const timer = setTimeout(() => {
        const el = document.getElementById(formId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // 3. Clean up so it doesn't scroll again on refresh
          sessionStorage.removeItem('scrollToFormId');
        }
      }, 600);

      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <>
      {/* Global AltHeader handles site navigation */}

      {/* --- HERO SECTION (Consistent with other service pages) --- */}

      <Hero background={TrainingImg}>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="h-[2px] w-20 bg-[#fcb22f]" />
          <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">Training Programme</span>
          <div className="h-[2px] w-20 bg-[#fcb22f]" />
        </div>
        <h1 className="hero-title text-3xl md:text-6xl font-black tracking-tight mb-8">
          Empower Your Team.<br />Unlock Their Potential.
        </h1>

        <p className="hero-description text-sm md:text-lg font-medium leading-relaxed text-white/85 mb-10">
          Engaging training experiences designed around your people and goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            className="rounded-full bg-[#fcb22f] px-10 py-3 font-bold text-[#153462] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(246,137,33,0.65)]"
            onClick={() => {
              const section = document.getElementById('training-types');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              }
            }}
          >
            Explore Programmes
          </button>
          <button
            type="button"
            className="rounded-full border border-white/70 px-10 py-3 font-bold backdrop-blur transition-colors duration-300 hover:bg-white/10"
            onClick={() => {
              const section = document.getElementById('training-form');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                if (window.history.replaceState) {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              }
            }}
          >
            Plan My Programme
          </button>
        </div>
      </Hero>


      {/* 2. TYPES OF TRAINING - BENTO GRID */}
      <section id="training-types" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#153462] mb-4">Our Training Programmes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive training solutions designed to elevate every aspect of your team's capabilities
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <ScrollableCards desktopColumns={2} gap={6}>
            {/* Mental Health - Tall (Left side, spans 2 rows) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0, duration: 0.4 }}
              className="md:row-span-2 relative overflow-hidden rounded-3xl group cursor-pointer h-[400px] md:h-full"
            >
              {/* Background Image */}
              <img
                src={trainingTypes[0].image}
                alt={trainingTypes[0].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

              {/* Content with Glassmorphism */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                {/* Icon Badge */}
                <div className="self-start">
                  <div
                    className="w-16 h-16 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center shadow-xl"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    {(() => {
                      const IconComponent = trainingTypes[0].icon;
                      return <IconComponent size={32} className="text-white" />;
                    })()}
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {trainingTypes[0].title}
                  </h3>
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl">
                    {trainingTypes[0].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Leadership - Top Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl group cursor-pointer h-[400px]"
            >
              {/* Background Image */}
              <img
                src={trainingTypes[1].image}
                alt={trainingTypes[1].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

              {/* Content with Glassmorphism */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Icon Badge */}
                <div className="self-start">
                  <div
                    className="w-14 h-14 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center shadow-xl"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    {(() => {
                      const IconComponent = trainingTypes[1].icon;
                      return <IconComponent size={28} className="text-white" />;
                    })()}
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {trainingTypes[1].title}
                  </h3>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    {trainingTypes[1].description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Soft Skills - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative overflow-hidden rounded-3xl group cursor-pointer h-[400px]"
            >
              {/* Background Image */}
              <img
                src={trainingTypes[2].image}
                alt={trainingTypes[2].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

              {/* Content with Glassmorphism */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Icon Badge */}
                <div className="self-start">
                  <div
                    className="w-14 h-14 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center shadow-xl"
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    {(() => {
                      const IconComponent = trainingTypes[2].icon;
                      return <IconComponent size={28} className="text-white" />;
                    })()}
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {trainingTypes[2].title}
                  </h3>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    {trainingTypes[2].description}
                  </p>
                </div>
              </div>
            </motion.div>
          </ScrollableCards>
        </div>
      </section>

      {/* 3. HRD CERTIFICATION */}
      <Suspense fallback={<div className="py-20 bg-white" />}>
        <HRDCorBanner />
      </Suspense>

      {/* 4. WHY CHOOSE US - CHECKERBOARD LAYOUT */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#153462] mb-4">Why Choose EITO Group?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three pillars that set us apart in delivering exceptional training experiences
            </p>
          </motion.div>

          <div className="space-y-24">
            {/* Row 1: Expertise - Image Right, Text Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-[#153462] mb-6 uppercase tracking-tight">
                  Expertise that resonates
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We don't just read from slides. Our facilitators are industry veterans who bring
                  real-world scars and successes to the table. Each trainer has walked the path your
                  team is about to embark on, bringing authenticity and credibility that can't be taught.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>10+ years industry experience minimum</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Proven track record of transformation</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Engaging storytelling that inspires action</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl relative group">
                <img
                  src={ExpertiseImg}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Expert Facilitators" loading="lazy"
                  decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#153462]/60 to-transparent" />
              </div>
            </motion.div>

            {/* Row 2: Tailored - Image Left, Text Right (Reversed) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row-reverse items-center gap-12"
            >
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-[#f68921] mb-6 uppercase tracking-tight">
                  Tailored for your DNA
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Your culture is unique. Your training should be too. We design modules that
                  speak your company's language and solve your specific friction points. No generic
                  off-the-shelf content—every session is crafted to address your real challenges.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Comprehensive pre-training needs analysis</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Industry-specific case studies and scenarios</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Flexible formats adapted to your workflow</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl relative group">
                <img
                  src={DNAImg}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Tailored Content" loading="lazy"
                  decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f68921]/50 to-transparent" />
              </div>
            </motion.div>

            {/* Row 3: Impact - Image Right, Text Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-12"
            >
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-[#12a28f] mb-6 uppercase tracking-tight">
                  Results you can measure
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We're obsessed with impact. Every programme includes pre and post-training assessments,
                  clear KPIs, and ongoing support to ensure the learning sticks. You'll see the difference
                  in performance, engagement, and bottom-line results.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Data-driven evaluation frameworks</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Documented ROI with measurable outcomes</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-[#12a28f] flex-shrink-0" />
                    <span>Post-training support to sustain change</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl relative group">
                <img
                  src={ResultImg}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Real-World Impact" loading="lazy"
                  decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12a28f]/50 to-transparent" />
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToForm}
              className="bg-[#f68921] hover:bg-[#e1620b] text-white px-10 py-4 rounded-full text-lg font-bold flex items-center gap-3 mx-auto transition-colors shadow-lg"
            >
              Start Your Transformation <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* 5. METHODOLOGY - VISUAL ROADMAP WITH INTERACTIVE TIMELINE */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#153462] mb-4">How We Shape Excellence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our proven methodology ensures training that delivers lasting impact
            </p>
          </motion.div>

          {/* Horizontal Timeline */}
          <div className="relative">
            {/* Desktop: Horizontal Timeline */}
            <div className="hidden lg:block">
              {/* SVG Path */}
              <div className="relative h-32 mb-12">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <motion.path
                    d="M 50 50 Q 350 20, 400 50 T 800 50 T 1150 50"
                    stroke="url(#timeline-gradient)"
                    strokeWidth="4"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  <defs>
                    <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f68921" />
                      <stop offset="50%" stopColor="#12a28f" />
                      <stop offset="100%" stopColor="#153462" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Step Circles */}
                {methodology.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.3, duration: 0.5 }}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${(idx * 28) + 8}%` }}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f68921] to-[#e1620b] flex items-center justify-center shadow-xl border-4 border-white">
                        <span className="text-2xl font-bold text-white">{item.step}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Step Cards */}
              <div className="grid grid-cols-4 gap-6">
                {methodology.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow group"
                  >
                    {/* Watermark Background Image */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <img
                        src={[MentalHealthImg, LeadershipImg, TrainingImg, SoftSkillsImg][idx]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f68921]/20 to-[#e1620b]/20 flex items-center justify-center">
                          <item.icon size={20} className="text-[#f68921]" />
                        </div>
                        <h3 className="text-lg font-bold text-[#153462]">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#f68921] to-[#e1620b] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="lg:hidden space-y-8">
              {methodology.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative"
                >
                  <div className="flex gap-6">
                    {/* Step Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f68921] to-[#e1620b] flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        {item.step}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 relative overflow-hidden rounded-2xl bg-white shadow-lg p-6">
                      {/* Watermark */}
                      <div className="absolute inset-0 opacity-5">
                        <img
                          src={[MentalHealthImg, LeadershipImg, TrainingImg, SoftSkillsImg][idx]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="relative space-y-3">
                        <div className="flex items-center gap-3">
                          <item.icon size={24} className="text-[#f68921]" />
                          <h3 className="text-xl font-bold text-[#153462]">{item.title}</h3>
                        </div>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {idx < methodology.length - 1 && (
                    <div className="absolute left-7 top-14 w-0.5 h-8 bg-gradient-to-b from-[#f68921] to-[#12a28f]" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEASURABLE IMPACT - DATA OVERLAY WITH PARALLAX */}
      {/* <section
        className="py-32 px-4 relative"
        style={{
          backgroundImage: `url(${TrainingImg})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      > */}
      {/* Dark Overlay for Readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#153462]/90 via-[#18616e]/85 to-[#153462]/90" /> */}

      {/* Content */}
      {/* <div className="max-w-7xl mx-auto relative z-10"> */}
      {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-bold uppercase tracking-wider mb-6 border border-white/20"
            >
              Real Results, Real People
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Measurable Impact</h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Our training programmes deliver tangible results that transform organizations
            </p>
          </motion.div> */}

      {/*  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {improvements.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border-2 border-white/20 p-6 md:p-8 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-2xl">
         
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f68921] to-[#fcb22f]" />

                  <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3">
                    <AnimatedCounter end={item.metric} suffix={item.suffix} />
                  </div>

                  <div className="text-white/90 text-base md:text-lg font-semibold leading-tight">
                    {item.label}
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>

                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-[#fcb22f]/20 blur-2xl -z-10"
                />
              </motion.div>
            ))}
          </div> */}

      {/* Bottom CTA */}
      {/*  <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Join hundreds of organizations achieving breakthrough results with EITO Group training
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToForm}
              className="bg-white text-[#153462] hover:bg-[#fcb22f] hover:text-white px-10 py-4 rounded-full text-lg font-bold flex items-center gap-3 mx-auto transition-colors shadow-2xl"
            >
              Start Achieving Results <ArrowRight size={24} />
            </motion.button>
          </motion.div>
        </div> */}

      {/* Parallax Decorative Elements */}
      {/*  <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#fcb22f]/30 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#12a28f]/30 blur-3xl"
        /> */}
      {/* </section> */}

      {/* 7. CORE VALUES CAROUSEL */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#153462] mb-4">Why Choose EITO?</h2>
            <p className="text-lg text-gray-600">Our core values drive everything we do</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <motion.div
              key={`image-${activeValue}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1"
            >
              <img
                src={coreValues[activeValue].image}
                alt={coreValues[activeValue].value}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#153462]/60 to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <motion.div
                key={activeValue}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Value Badge */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="inline-block bg-[#fcb22f] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest mb-6 shadow-lg"
                >
                  {coreValues[activeValue].value}
                </motion.div>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#153462] mb-6 leading-tight"
                >
                  {coreValues[activeValue].title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-lg md:text-xl leading-relaxed text-gray-700 mb-8"
                >
                  {coreValues[activeValue].description}
                </motion.p>

                {/* Navigation */}
                <div className="flex items-center gap-6">
                  {/* Arrows */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveValue((prev) => (prev - 1 + coreValues.length) % coreValues.length)}
                      className="w-12 h-12 rounded-full bg-[#153462] hover:bg-[#f68921] text-white flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Previous slide"
                    >
                      <ArrowRight size={20} className="rotate-180" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveValue((prev) => (prev + 1) % coreValues.length)}
                      className="w-12 h-12 rounded-full bg-[#153462] hover:bg-[#f68921] text-white flex items-center justify-center transition-colors shadow-lg"
                      aria-label="Next slide"
                    >
                      <ArrowRight size={20} />
                    </motion.button>
                  </div>

                  {/* Dots */}
                  <div className="flex gap-3">
                    {coreValues.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveValue(idx)}
                        className="group relative"
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        <div className={`h-3 rounded-full transition-all duration-300 ${idx === activeValue
                          ? 'w-12 bg-[#fcb22f]'
                          : 'w-3 bg-gray-300 group-hover:bg-gray-400'
                          }`} />

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#153462] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {coreValues[idx].value}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FORM */}
      <section id="training-form" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="text-gray-400">Loading form...</div></div>}>
            <QuestionnaireTP />
          </Suspense>
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
    </>
  );
};

export default TrainingProgram;
