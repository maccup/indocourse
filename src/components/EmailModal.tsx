import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Locale {
  code: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://indonesian-basics-api.workers.dev';

const AVAILABLE_LOCALES: Locale[] = [
  { code: 'en', name: 'English' }
];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locale, setLocale] = useState('en');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadLinks, setDownloadLinks] = useState<{ pdf: string; audio: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, locale })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setDownloadLinks(data.links);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to subscribe');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status !== 'loading') {
      setName('');
      setEmail('');
      setLocale('en');
      setStatus('idle');
      setErrorMessage('');
      setDownloadLinks(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#E07A5F] to-[#d4684f] p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={status === 'loading'}
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold">Get Your Free eBook</h2>
                <p className="text-white/80 mt-1">Enter your details to receive the download link</p>
              </div>

              <div className="p-6">
                {status === 'success' ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#81B29A]/10 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-[#81B29A]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2D3436] mb-2">Check Your Email!</h3>
                    <p className="text-[#636e72] mb-6">
                      We've sent your download links to <strong>{email}</strong>
                    </p>
                    {downloadLinks && (
                      <div className="space-y-3">
                        <p className="text-sm text-[#636e72]">Or download directly:</p>
                        <a
                          href={downloadLinks.pdf}
                          className="block w-full py-3 px-4 bg-[#E07A5F] text-white rounded-xl font-semibold hover:bg-[#d4684f] transition-colors"
                        >
                          Download PDF
                        </a>
                        <a
                          href={downloadLinks.audio}
                          className="block w-full py-3 px-4 bg-[#81B29A] text-white rounded-xl font-semibold hover:bg-[#6fa389] transition-colors"
                        >
                          Download Audio
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#2D3436] mb-1.5">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                          minLength={2}
                          className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-all"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#2D3436] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-all"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="locale" className="block text-sm font-medium text-[#2D3436] mb-1.5">
                        eBook Language
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
                        <select
                          id="locale"
                          value={locale}
                          onChange={(e) => setLocale(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#e0e0e0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-all appearance-none bg-white"
                          disabled={status === 'loading'}
                        >
                          {AVAILABLE_LOCALES.map((l) => (
                            <option key={l.code} value={l.code}>
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {AVAILABLE_LOCALES.length === 1 && (
                        <p className="text-xs text-[#a0a0a0] mt-1">More languages coming soon!</p>
                      )}
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3.5 px-4 bg-[#E07A5F] text-white rounded-xl font-semibold hover:bg-[#d4684f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Get Free Download'
                      )}
                    </button>

                    <p className="text-xs text-center text-[#a0a0a0]">
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
