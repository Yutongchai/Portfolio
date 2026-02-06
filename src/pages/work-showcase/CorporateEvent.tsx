import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';
import Questionnaire from './components/Questionnaire';
import PageHero from './components/PageHero';
import HRDCorBanner from './components/HRDCorBanner';
import OfferingsGrid, { Offering } from './components/OfferingsGrid';
import {
  CrewIcon,
  VenueIcon,
  MusicIcon,
  EventIcon,
  GiftIcon,
  SettingsIcon,
  EmceeIcon,
  DecorationIcon,
  TalentIcon,
} from '../../assets/corporate_event';

const corporateEventOfferings: Offering[] = [
  {
    id: 'crew-logistics',
    icon: <img src={CrewIcon} alt="Event crew icon" className="h-7 w-7" />,
    title: 'Event Crew & Logistics Support',
    description: 'Operational manpower and logistical support to ensure smooth event flow and execution.',
  },
  {
    id: 'venue',
    icon: <img src={VenueIcon} alt="Venue scouting icon" className="h-7 w-7" />,
    title: 'Venue Scouting & Assessment',
    description: 'Identification and evaluation of suitable venues based on event requirements and capacity.',
  },
  {
    id: 'entertainment',
    icon: <img src={MusicIcon} alt="Music and entertainment icon" className="h-7 w-7" />,
    title: 'Sound, Music & Entertainment',
    description: 'Professional audio solutions and entertainment arrangements for corporate events.',
  },
  {
    id: 'concept-planning',
    icon: <img src={EventIcon} alt="Event planning icon" className="h-7 w-7" />,
    title: 'Event Concept & Planning',
    description: 'Structured planning and concept development aligned with corporate objectives.',
  },
  {
    id: 'branding-gifts',
    icon: <img src={GiftIcon} alt="Custom gifts icon" className="h-7 w-7" />,
    title: 'Custom Door Gifts & Branding',
    description: 'Customised door gifts and branded items to enhance event identity and recall.',
  },
  {
    id: 'event-day',
    icon: <img src={SettingsIcon} alt="Event day management icon" className="h-7 w-7" />,
    title: 'Event Day Management',
    description: 'On-site coordination to manage programme flow and operational activities.',
  },
  {
    id: 'emcee',
    icon: <img src={EmceeIcon} alt="Emcee icon" className="h-7 w-7" />,
    title: 'Emcee & Program Hosting',
    description: 'Professional emcee and hosting services to guide the event programme effectively.',
  },
  {
    id: 'setup-styling',
    icon: <img src={DecorationIcon} alt="Event decoration icon" className="h-7 w-7" />,
    title: 'Set-Up, Styling & Decoration',
    description: 'Event setup, styling, and decorative arrangements based on the approved concept.',
  },
  {
    id: 'talent',
    icon: <img src={TalentIcon} alt="Talent coordination icon" className="h-7 w-7" />,
    title: 'Talent & Host Coordination',
    description: 'Coordination of hosts, speakers, and performers to support programme delivery.',
  },
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
    <PageHero
      title="Corporate Events"
      description="Make your next corporate event memorable and seamless with our expert planning and execution services."
    />
    <HRDCorBanner />
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .offerings-label {
          animation: fadeInDown 0.8s ease-out;
        }

        .offerings-title {
          animation: fadeInDown 0.8s ease-out 0.1s both;
        }

        .offerings-description {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
      `}</style>
      <div className="mb-20">
        {/* Decorative Label */}
        <div className="offerings-label flex items-center justify-center gap-6 mb-8">
          <span className="uppercase tracking-[0.4em] text-xs font-black text-[#fcb22f]">
            What We Offer
          </span>
        </div>

        {/* Title */}
        <h2 className="offerings-title text-4xl md:text-6xl font-black text-center mb-6 text-slate-900 tracking-tight">
          Comprehensive Event Solutions
        </h2>

        {/* Description */}
        <p className="offerings-description text-center text-slate-600 text-lg md:text-xl mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
          From concept to execution, we deliver seamless corporate events that leave lasting impressions.
        </p>

        <OfferingsGrid offerings={corporateEventOfferings} />
      </div>
    </section>
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <Questionnaire formType="corporate_event" />
    </section>
    <Footer />
  </>
);

export default CorporateEvent;
