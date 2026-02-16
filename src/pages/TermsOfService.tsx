import React from 'react';
import Footer from '../components/ui/Footer';
import LogoImg from '../components/Logo.png';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <>
      {/* Global AltHeader handles site navigation */}
      
      <div className="min-h-screen bg-gray-50 py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-[#153462] mb-4 uppercase tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: February 6, 2026</p>

          <div className="prose prose-lg max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to EITO Group ("we," "us," or "our"). These Terms of Use govern your access to and use 
                of our website and the inquiry/booking services provided. By accessing our site, you agree to be 
                bound by these Terms. If you do not agree, please discontinue use of the site.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">2. Use of the Site & Inquiries</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use this site only for lawful purposes. When using our inquiry forms or booking a 
                consultation, you agree:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>To provide accurate, current, and complete information about yourself.</li>
                <li>Not to use the site to submit fraudulent inquiries or "spam" our communication channels (WhatsApp, Email, or Instagram).</li>
                <li>Not to attempt to interfere with the proper working of the site or introduce any malicious software/viruses.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">3. Consultation Bookings</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Informational Purpose:</strong> Any initial consultation or information provided on this 
                site does not constitute a formal professional-client relationship until a separate service agreement 
                is signed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Cancellations:</strong> We reserve the right to cancel or reschedule consultation meetings 
                at our discretion.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">4. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content on this site—including text, logos, graphics, and images—is the property of EITO Group 
                and is protected by Malaysian and international copyright laws. You may not use, copy, or distribute 
                our content for commercial purposes without our express written consent.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">5. Third-Party Links (WhatsApp & Social Media)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our site contains links to external platforms like WhatsApp and Instagram.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>We are not responsible for the content, security, or availability of these third-party platforms.</li>
                <li>Your interactions with us on those platforms are also subject to their respective terms and conditions.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">6. Disclaimers & Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>"As Is" Basis:</strong> This site is provided on an "as is" basis. We do not guarantee that 
                the site will always be available, error-free, or free of viruses.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Liability:</strong> To the fullest extent permitted by Malaysian law, EITO Group shall not 
                be liable for any loss or damage (including but not limited to loss of data or profits) arising from 
                your use of, or inability to use, this website.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">7. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless EITO Group from any claims, damages, or expenses (including 
                legal fees) arising from your breach of these Terms or your misuse of the website.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">8. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by and construed in accordance with the laws of Malaysia. Any disputes shall 
                be subject to the exclusive jurisdiction of the courts of Malaysia.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">9. Changes to These Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to update these Terms at any time. Changes will be effective immediately upon 
                posting to this page. Your continued use of the site signifies your acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-[#153462] mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For any questions regarding these Terms, please contact us:
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

export default TermsOfService;
