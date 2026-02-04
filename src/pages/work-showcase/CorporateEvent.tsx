import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';
import Questionnaire from './components/Questionnaire';
import PageHero from './components/PageHero';
import HRDCorBanner from './components/HRDCorBanner';
import OfferingsGrid, { Offering } from './components/OfferingsGrid';

const corporateEventOfferings: Offering[] = [
  {
    id: 'planning',
    icon: '📋',
    title: 'Event Planning',
    description: 'End-to-end event planning from concept to execution with attention to every detail.'
  },
  {
    id: 'venue',
    icon: '🏢',
    title: 'Venue Selection',
    description: 'Access to premium venues that match your event style, budget, and logistics requirements.'
  },
  {
    id: 'catering',
    icon: '🍽️',
    title: 'Catering & Dining',
    description: 'Curated menus and professional catering services tailored to your corporate standards.'
  },
  {
    id: 'entertainment',
    icon: '🎭',
    title: 'Entertainment',
    description: 'Live entertainment, performers, DJs, and interactive experiences to elevate your event.'
  },
  {
    id: 'audio',
    icon: '🎤',
    title: 'Audio & Visual',
    description: 'Professional AV equipment, sound systems, and technical support for seamless presentations.'
  },
  {
    id: 'coordination',
    icon: '👥',
    title: 'Event Coordination',
    description: 'Dedicated on-site coordinators ensuring smooth execution and handling of all logistics.'
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
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">What We Offer</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Comprehensive services covering every aspect of your corporate event.
        </p>
        <OfferingsGrid offerings={corporateEventOfferings} columns={3} />
      </div>
    </section>
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <Questionnaire formType="corporate_event" />
    </section>
    <Footer />
  </>
);

export default CorporateEvent;
