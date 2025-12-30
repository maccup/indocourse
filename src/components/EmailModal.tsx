import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Globe, Loader2, AlertCircle, Check } from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Locale {
  code: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://api.indonesianbasics.com';

const AVAILABLE_LOCALES: Locale[] = [
  { code: 'en', name: 'English' }
];

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locale, setLocale] = useState('en');
  const [termsConsent, setTermsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          locale,
          termsConsent,
          marketingConsent,
          consentDate: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

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
      setTermsConsent(false);
      setMarketingConsent(false);
      setStatus('idle');
      setErrorMessage('');
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
              <div className="bg-[#2EC4B6] p-6 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={status === 'loading'}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🐵</span>
                  <div>
                    <h2 className="text-2xl font-bold">Join Kiki's Adventure!</h2>
                    <p className="text-white/80 mt-1">Get your free eBook + audio files</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {status === 'success' ? (
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-bold text-[#2D3436] mb-2">Woohoo! Check Your Email!</h3>
                    <p className="text-[#2D3436]/60 mb-4">
                      Kiki sent your download links to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-[#2D3436]/40">
                      Don't see it? Check your spam folder (Kiki promises it's not junk!)
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-6 w-full py-3 px-4 bg-[#2EC4B6] text-white rounded-xl font-bold hover:bg-[#2EC4B6]/90 transition-colors"
                    >
                      Awesome! 🐵
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          required
                          minLength={2}
                          className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent transition-all"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent transition-all"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="locale" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                        eBook Language
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <select
                          id="locale"
                          value={locale}
                          onChange={(e) => setLocale(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent transition-all appearance-none bg-white"
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
                        <p className="text-xs text-[#1A1A1A]/40 mt-1">More languages coming soon!</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={termsConsent}
                            onChange={(e) => setTermsConsent(e.target.checked)}
                            className="sr-only peer"
                            disabled={status === 'loading'}
                            required
                          />
                          <div className="w-5 h-5 border-2 border-[#E5E5E5] rounded peer-checked:border-[#2EC4B6] peer-checked:bg-[#2EC4B6] transition-all flex items-center justify-center group-hover:border-[#2EC4B6]/50">
                            {termsConsent && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className="text-sm text-[#2D3436]/70 leading-snug">
                          I agree to the{' '}
                          <Link
                            to="/privacy-policy"
                            target="_blank"
                            className="text-[#2EC4B6] hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Privacy Policy
                          </Link>
                          {' '}and{' '}
                          <Link
                            to="/terms"
                            target="_blank"
                            className="text-[#2EC4B6] hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Terms of Service
                          </Link>
                          .{' '}
                          <span className="text-[#2D3436]/40">(Required)</span>
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="sr-only peer"
                            disabled={status === 'loading'}
                          />
                          <div className="w-5 h-5 border-2 border-[#E5E5E5] rounded peer-checked:border-[#2EC4B6] peer-checked:bg-[#2EC4B6] transition-all flex items-center justify-center group-hover:border-[#2EC4B6]/50">
                            {marketingConsent && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <span className="text-sm text-[#2D3436]/70 leading-snug">
                          I want to receive the newsletter and marketing information about new Indonesian learning resources via email.{' '}
                          <span className="text-[#2D3436]/40">(Optional)</span>
                        </span>
                      </label>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading' || !termsConsent}
                      className="w-full py-3.5 px-4 bg-[#2EC4B6] text-white rounded-xl font-bold hover:bg-[#2EC4B6]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Kiki's preparing your files...
                        </>
                      ) : (
                        'Send Me the eBook! 🍌'
                      )}
                    </button>

                    <p className="text-xs text-center text-[#2D3436]/40">
                      🔒 No spam, ever. Kiki pinky promises!
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
