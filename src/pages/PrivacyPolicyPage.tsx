import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Building2, Shield } from 'lucide-react';

export function PrivacyPolicyPage() {
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
          <Shield className="w-5 h-5 text-[#2EC4B6]" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">
          Privacy Policy
        </h1>
        <p className="text-[#1A1A1A]/60 mb-8">Last updated: December 30, 2025</p>

        <div className="prose prose-lg max-w-none text-[#1A1A1A]/80">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2EC4B6]" />
              1. Data Controller
            </h2>
            <p>The controller of your personal data is:</p>
            <div className="bg-[#F5F5F5] rounded-xl p-4 mt-4">
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
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">2. What Data We Collect</h2>
            <p>When you download our free Indonesian language course, we collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your name</li>
              <li>Email address</li>
              <li>Language preference</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">3. Why We Process Your Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A]/10">
                    <th className="text-left py-3 pr-4 font-semibold">Purpose</th>
                    <th className="text-left py-3 font-semibold">Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#1A1A1A]/10">
                    <td className="py-3 pr-4">Deliver the free eBook and audio files you requested</td>
                    <td className="py-3">Contract performance (Art. 6(1)(b) GDPR)</td>
                  </tr>
                  <tr className="border-b border-[#1A1A1A]/10">
                    <td className="py-3 pr-4">Send marketing communications about new Indonesian learning resources and products (optional)</td>
                    <td className="py-3">Your consent (Art. 6(1)(a) GDPR)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-[#1A1A1A]/60">
              Marketing communications are optional. You can opt out at any time by clicking the unsubscribe
              link in any email or by contacting us directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">4. Data Recipients</h2>
            <p>Your data may be processed by:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Brevo (Sendinblue SAS)</strong> – email delivery (France, EU)</li>
              <li><strong>Cloudflare, Inc.</strong> – hosting and database (USA, EU Standard Contractual Clauses)</li>
            </ul>
            <p className="mt-4">We do not sell your data to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">5. Data Retention</h2>
            <p>We process your data for different periods depending on the purpose:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Course Delivery (Contract):</strong> For the duration of the service and up to 5 years thereafter for the purpose of defending against potential legal claims.</li>
              <li><strong>Marketing:</strong> Until you withdraw your consent or unsubscribe.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">6. Automated Decision-Making</h2>
            <p>
              We do not use your data for automated decision-making, including profiling as defined in Art. 22 GDPR.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">7. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data ("right to be forgotten")</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with the Polish Data Protection Authority (UODO)</li>
            </ul>
            <div className="bg-[#F5F5F5] rounded-xl p-4 mt-4">
              <p className="font-semibold">Urząd Ochrony Danych Osobowych (UODO)</p>
              <p>ul. Stawki 2, 00-193 Warszawa</p>
              <p>
                <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer" className="text-[#2EC4B6] hover:underline">
                  https://uodo.gov.pl
                </a>
              </p>
            </div>
            <p className="mt-4">
              To exercise your rights, contact us at{' '}
              <a href="mailto:hello@indonesianbasics.com" className="text-[#2EC4B6] hover:underline">
                hello@indonesianbasics.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">8. International Transfers</h2>
            <p>
              Data transferred to the USA (Cloudflare) is protected by EU Standard Contractual Clauses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">9. Cookies and Analytics</h2>
            <p>
              This website uses essential cookies for basic functionality only.
            </p>
            <p className="mt-4">
              We use <strong>Cloudflare Web Analytics</strong> to understand how visitors use our website.
              This service is privacy-focused and:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Does not use cookies</li>
              <li>Does not collect personal data</li>
              <li>Does not track individual users across sites</li>
              <li>Collects only aggregate, anonymized metrics (page views, referrers, device types)</li>
            </ul>
            <p className="mt-4">
              For more information, see{' '}
              <a
                href="https://www.cloudflare.com/web-analytics/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2EC4B6] hover:underline"
              >
                Cloudflare Web Analytics
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">10. Changes to This Policy</h2>
            <p>
              Updates to this policy will be published at{' '}
              <Link to="/privacy-policy" className="text-[#2EC4B6] hover:underline">
                https://indonesianbasics.com/privacy-policy
              </Link>
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
