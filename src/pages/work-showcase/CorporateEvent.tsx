import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';
import Questionnaire from './components/Questionnaire';

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
    <section className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">Corporate Event</h1>
      <p className="text-lg text-center max-w-xl mb-8">Make your next corporate event memorable and seamless with our expert planning and execution services.</p>
    </section>
    <section className="py-32 px-8 max-w-7xl mx-auto">
      <Questionnaire formType="corporate_event" />
    </section>
    <Footer />
  </>
);

export default CorporateEvent;
