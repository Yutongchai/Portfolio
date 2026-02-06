import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';
import Questionnaire from './components/Questionnaire';
import { motion } from 'framer-motion';
import { Calendar, Users, Trophy, Utensils, Mic, Settings, UserCheck, Music, Camera, Clock, Award, Lightbulb, Target, Sparkles } from 'lucide-react';
import AnnualDinnerImg from '../../assets/corporate_events/annual_dinner.jpg';
import KickoffImg from '../../assets/corporate_events/kick.jpg';
import FamilyDayImg from '../../assets/corporate_events/family_day.jpg';
import SportsDayImg from '../../assets/corporate_events/sports_day.jpg';

const subCategories = [
  {
    id: 1,
    title: 'Annual Dinner',
    description: 'Memorable celebrations to reward your team and recognize achievements.',
    icon: <Utensils size={40} />,
    color: '#f68921',
    image: AnnualDinnerImg
  },
  {
    id: 2,
    title: 'Kick-off Meeting',
    description: 'Aligning vision and energy for the year ahead with impactful gatherings.',
    icon: <Target size={40} />,
    color: '#153462',
    image: KickoffImg
  },
  {
    id: 3,
    title: 'Family Day',
    description: 'Fun-filled gatherings bringing teams and families together.',
    icon: <Users size={40} />,
    color: '#79989f',
    image: FamilyDayImg
  },
  {
    id: 4,
    title: 'Sports Day',
    description: 'Competitive events fostering team spirit and wellness.',
    icon: <Trophy size={40} />,
    color: '#fcb22f',
    image: SportsDayImg
  }
];

const offerings = [
  { icon: <Mic size={32} />, title: 'Professional Emcee' },
  { icon: <Settings size={32} />, title: 'Event Execution' },
  { icon: <UserCheck size={32} />, title: 'Crew Support' },
  { icon: <Music size={32} />, title: 'Entertainment' },
  { icon: <Camera size={32} />, title: 'Photography & Videography' },
  { icon: <Utensils size={32} />, title: 'Catering Coordination' },
  { icon: <Lightbulb size={32} />, title: 'Creative Theming' },
  { icon: <Award size={32} />, title: 'Awards & Recognition' },
  { icon: <Clock size={32} />, title: 'Timeline Management' },
  { icon: <Calendar size={32} />, title: 'Venue Selection' },
  { icon: <Users size={32} />, title: 'Registration Management' },
  { icon: <Trophy size={32} />, title: 'Branding & Signage' },
  { icon: <Sparkles size={32} />, title: 'Gift & Merchandise' },
  { icon: <Target size={32} />, title: 'Technical Support' },
  { icon: <UserCheck size={32} />, title: 'Safety & Security' },
  { icon: <Settings size={32} />, title: 'Post-Event Analysis' },
];

const howWeWork = [
  {
    id: 1,
    title: 'Activities & Entertainment',
    description: 'We design engaging activities and entertainment that align with your event objectives, ensuring every attendee is captivated and energized throughout the experience.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 2,
    title: 'Corporate Culture Integration',
    description: 'Every event is crafted to reflect and reinforce your corporate values, creating experiences that resonate with your team and strengthen organizational identity.',
    image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 3,
    title: 'Seamless Coordination',
    description: 'Our experienced team handles all logistics, vendor management, and on-site coordination, allowing you to focus on connecting with your team while we manage every detail.',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 4,
    title: 'Memorable Moments',
    description: 'We create unforgettable experiences through thoughtful design, personalized touches, and attention to detail that leave lasting positive impressions on every participant.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200'
  }
];

const whyChooseUs = [
  {
    icon: <Sparkles size={48} />,
    title: 'Excellence in Execution',
    description: 'We believe in delivering exceptional experiences through meticulous planning and flawless execution. Every detail matters, and we ensure your event exceeds expectations.',
    color: '#f68921'
  },
  {
    icon: <Users size={48} />,
    title: 'People-Centered Approach',
    description: 'At EITO, we put people first. Our events are designed to foster genuine connections, celebrate achievements, and create meaningful moments that strengthen team bonds.',
    color: '#153462'
  },
  {
    icon: <Lightbulb size={48} />,
    title: 'Innovation & Creativity',
    description: 'We bring fresh ideas and innovative concepts to every event. Our creative approach ensures your corporate gathering stands out and leaves a lasting impact on all attendees.',
    color: '#18616e'
  }
];


const CorporateEvent = () => (
  <>
    <PillNav
      logo={LogoImg}
      logoAlt="EITO Group Logo"
      items={[
        { label: "Home", href: "/personal-story-section" },
        { label: "Services", href: "/work-showcase" },
        { label: "Connect", href: "/connection-hub" },
      ]}
      activeHref={"/work-showcase"}
    />

    {/* 1. INTRO SECTION */}
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(80px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          animation: slideInUp 0.8s ease-out;
        }
      `}</style>

      <div className="absolute inset-0">
        <img
          src={AnnualDinnerImg}
          alt="Corporate Events"
          className="h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#0f1e38]/70 to-[#f68921]/35" />
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 text-center">
        <div className="hero-title flex items-center justify-center gap-6 mb-6">
          <div className="h-[2px] w-20 bg-[#fcb22f]" />
          <span className="uppercase tracking-[0.6em] text-xs font-black text-[#fcb22f]">
            Corporate Events
          </span>
          <div className="h-[2px] w-20 bg-[#fcb22f]" />
        </div>

        <h1 className="hero-title text-6xl md:text-8xl font-black tracking-tight mb-8">
          Events That<br />Matter
        </h1>

        <p className="text-lg md:text-xl font-medium leading-relaxed text-white/85 mb-10">
          Transform your corporate gatherings into unforgettable experiences that inspire,
          engage, and strengthen your team culture.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#event-categories"
            className="rounded-full bg-[#fcb22f] px-10 py-3 font-bold text-[#153462] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(246,137,33,0.65)]"
          >
            Explore Events
          </a>
          <a
            href="#corporate-event-questionnaire"
            className="rounded-full border border-white/70 px-10 py-3 font-bold backdrop-blur transition-colors duration-300 hover:bg-white/10"
          >
            Plan Your Event
          </a>
        </div>
      </div>
    </section>

    {/* 2. SUB-CATEGORIES */}
    <section id="event-categories" className="py-24 px-6 bg-white">
      <style>{`
        .flip-card {
          perspective: 1000px;
          height: 450px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front,
        .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 2rem;
          overflow: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
            Event Categories
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            From celebrations to strategic gatherings, we deliver exceptional corporate events tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {subCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="flip-card"
            >
              <div className="flip-card-inner">
                {/* FRONT SIDE - Image + Title */}
                <div className="flip-card-front shadow-2xl border-2 border-slate-100">
                  <div className="relative w-full h-full">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm"
                        style={{ backgroundColor: `${category.color}90`, color: 'white' }}
                      >
                        {category.icon}
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE - Description */}
                <div
                  className="flip-card-back shadow-2xl border-2 border-slate-100 flex items-center justify-center p-8"
                  style={{ backgroundColor: `${category.color}` }}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-white/20 backdrop-blur-sm">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed font-medium text-lg">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 3. WHAT WE OFFER */}
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Complete Solutions</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
            What We Offer
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Comprehensive services covering every aspect of your corporate event.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerings.map((offering, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group flex flex-col items-center text-center"
            >
              <div className="text-[#f68921] mb-4 group-hover:scale-110 transition-transform duration-300">
                {offering.icon}
              </div>
              <h3 className="text-xl font-black text-[#153462] uppercase tracking-tight">{offering.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 4. HOW WE WORK */}
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Process</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
            How We Work
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Our proven approach to delivering exceptional corporate events.
          </p>
        </div>

        <div className="space-y-32">
          {howWeWork.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="inline-block px-4 py-2 bg-[#f68921] text-white font-black rounded-full text-sm uppercase tracking-wider">
                  Step {step.id}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-[#153462] uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#153462]/60 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 5. WHY CHOOSE US */}
    <section className="py-24 px-6 bg-[#153462] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#fcb22f] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">EITO Core Values</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">
            Why Choose Us
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">
            Our commitment to excellence drives everything we do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {whyChooseUs.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-10 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div
                className="mb-6"
                style={{ color: reason.color }}
              >
                {reason.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{reason.title}</h3>
              <p className="text-white/80 leading-relaxed font-medium">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* 6. QUESTIONNAIRE FORM */}
    <section id="corporate-event-questionnaire" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#f68921] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Get Started</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#153462] mb-6 uppercase tracking-tighter">
            Plan Your Event
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            Share your vision with us and let's create an unforgettable corporate event together.
          </p>
        </div>
        <Questionnaire formType="corporate_event" />
      </div>
    </section>

    <Footer />
  </>
);

export default CorporateEvent;
