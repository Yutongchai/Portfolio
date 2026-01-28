import PillNav from '../../components/ui/PillNav';
import Footer from '../../components/ui/Footer';
import LogoImg from '../../components/Logo.png';

const CSR = () => (
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
      <h1 className="text-3xl font-bold mb-4">CSR</h1>
      <p className="text-lg text-center max-w-xl mb-8">Create positive impact through meaningful CSR initiatives that align with your company values.</p>
    </section>
    <Footer />
  </>
);

export default CSR;
