import React from 'react';
import PillNav from '../components/ui/PillNav';
import Footer from '../components/ui/Footer';
import LogoImg from '../components/Logo.png';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <>
      <PillNav
        logo={LogoImg}
        logoAlt="EITO Group Logo"
        items={[
          { label: "Home", href: "/personal-story-section" },
          { label: "Services", href: "/work-showcase" },
          { label: "Connect", href: "/connection-hub" },
        ]}
        activeHref={"/"}
      />
      
      <div className="min-h-screen bg-gray-50 py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-[#153462] mb-4 uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: February 6, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to EITO Group. We are committed to protecting your personal data and your privacy. 
                This Privacy Policy outlines how we collect, use, and protect your information in compliance 
                with the Malaysian <strong>Personal Data Protection Act 2010 (PDPA)</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using our website and providing your information, you consent to the practices described in this policy.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">2. Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information that you voluntarily provide to us when you express an interest in 
                obtaining information about us or our services. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Personal Identifiers:</strong> Name, email address, and contact number.</li>
                <li><strong>Inquiry Details:</strong> Information regarding the specific services you are interested in and any details you provide in the inquiry forms.</li>
                <li><strong>Consultation Data:</strong> Information provided when booking a consultation meeting (date, time, and meeting preferences).</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect specifically to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Respond to your inquiries made via our website forms.</li>
                <li>Schedule and manage your consultation meetings.</li>
                <li>Communicate with you via WhatsApp, Email, or Instagram based on your preferred contact method.</li>
                <li>Improve our service offerings based on the feedback and details you provide.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">4. Third-Party Platforms (WhatsApp & Instagram)</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website provides links to connect with us via third-party platforms (WhatsApp and Instagram).
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Please note:</strong> Once you click these links, you are leaving our website.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                We do not control and are not responsible for the privacy practices of Meta (WhatsApp/Instagram). 
                We encourage you to review their respective privacy policies.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">5. Data Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell or rent your personal data to third parties. We only share your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With your explicit consent.</li>
                <li>To comply with legal obligations under Malaysian law.</li>
                <li>With service providers who assist in our operations (e.g., website hosting or booking systems), provided they agree to keep this information confidential.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">6. Your Rights (PDPA Compliance)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under the PDPA, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction:</strong> Request that we update or correct any inaccurate information.</li>
                <li><strong>Withdraw Consent:</strong> You may withdraw your consent for us to contact you at any time by notifying us via email.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">7. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement reasonable administrative and technical measures to safeguard your personal information 
                from unauthorized access or disclosure. However, please be aware that no method of transmission over 
                the internet is 100% secure.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">8. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Our website may use cookies to improve your browsing experience and analyze site traffic. 
                You can choose to disable cookies through your browser settings, though this may affect some 
                website functionalities.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">9. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights regarding 
                your data, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-800 font-bold mb-2">EITO Group</p>
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:info@eitogroup.com.my" className="text-[#f68921] hover:underline">info@eitogroup.com.my</a>
                </p>
                <p className="text-gray-700">
                  <strong>WhatsApp:</strong> <a href="https://wa.me/60163287947" target="_blank" rel="noopener noreferrer" className="text-[#f68921] hover:underline">+6016-328 7947</a>
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> Malaysia
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <a 
              href="/personal-story-section" 
              className="inline-block bg-[#153462] hover:bg-[#1c447a] text-white font-bold px-8 py-4 rounded-xl transition-all"
            >
              Back to Home
            </a>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
