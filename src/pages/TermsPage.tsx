import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, FileText, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/10 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#2EC4B6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <FileText className="w-5 h-5 text-[#2EC4B6]" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">
          Terms of Service
        </h1>
        <p className="text-[#1A1A1A]/60 mb-8">Last updated: December 30, 2025</p>

        <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2EC4B6]" />
              1. Service Provider
            </h2>
            <div className="bg-[#F5F5F5] rounded-xl p-4">
              <p className="font-semibold">MPR Spółka z ograniczoną odpowiedzialnością</p>
              <p>Floriańska Street 6/02, 03-707 Warsaw, Poland</p>
              <p>KRS: 0000788188</p>
              <p>NIP: PL5783137225</p>
              <p className="mt-2">
                <a href="mailto:hello@indonesianbasics.com" className="text-[#2EC4B6] hover:underline">
                  hello@indonesianbasics.com
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">2. Service Description</h2>
            <p>
              Indonesian Basics provides free Indonesian language learning materials, including
              a PDF eBook and audio files, delivered via email after registration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">3. Intellectual Property</h2>
            <p>
              All content, including text, audio recordings, graphics, and design, is the property
              of MPR Sp. z o.o. and is protected by Polish and international copyright law.
            </p>
            <p className="mt-4">
              You may not:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Redistribute, sell, or share the materials with third parties</li>
              <li>Modify or create derivative works without permission</li>
              <li>Use the materials for commercial purposes</li>
              <li>Remove any copyright notices from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">4. Permitted Use</h2>
            <p>
              The materials are provided for your personal, non-commercial educational use only.
              You may download and store copies on your personal devices for offline learning.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">5. Disclaimer</h2>
            <p>
              The materials are provided "as is" for educational purposes. We make no guarantees
              regarding learning outcomes or language proficiency. The content is not a substitute
              for formal language instruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MPR Sp. z o.o. shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the materials.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">7. Complaint Procedure</h2>
            <p>
              You have the right to file a complaint regarding the service. Please send your complaint
              to{' '}
              <a href="mailto:hello@indonesianbasics.com" className="text-[#2EC4B6] hover:underline">
                hello@indonesianbasics.com
              </a>.
              We will respond to your complaint within 14 days of receipt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">8. Governing Law and Disputes</h2>
            <p>
              These terms are governed by Polish law. Any disputes between MPR Sp. z o.o. and a user
              who is not a consumer shall be resolved by the courts of Warsaw, Poland.
            </p>
            <p className="mt-4">
              If you are a consumer, you may also use out-of-court complaint and redress mechanisms.
              You can use the EU Online Dispute Resolution (ODR) platform available at:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2EC4B6] hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">9. Changes to Terms</h2>
            <p>
              We may update these terms at any time. The current version is always available at{' '}
              <Link to="/terms" className="text-[#2EC4B6] hover:underline">
                https://indonesianbasics.com/terms
              </Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">10. Contact</h2>
            <p>
              For questions about these terms, contact us at{' '}
              <a href="mailto:hello@indonesianbasics.com" className="text-[#2EC4B6] hover:underline">
                hello@indonesianbasics.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-[#1A1A1A] text-white py-8 px-4 text-center">
        <p className="text-white/60 text-sm flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          <a href="mailto:hello@indonesianbasics.com" className="hover:text-[#2EC4B6] transition-colors">
            hello@indonesianbasics.com
          </a>
        </p>
      </footer>
    </div>
  );
}
