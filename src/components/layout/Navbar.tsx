import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, Download } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollToDownload: () => void;
}

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'FAQ', href: '#faq' }
];

export function Navbar({ activeSection, scrollToDownload }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E07A5F] to-[#E07A5F]/80 flex items-center justify-center shadow-lg shadow-[#E07A5F]/20 group-hover:shadow-[#E07A5F]/40 transition-shadow">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Indonesian<span className="text-[#E07A5F]">Basics</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === item.href.slice(1)
                    ? 'bg-[#E07A5F]/10 text-[#E07A5F]'
                    : 'text-[#2D3436]/60 hover:text-[#2D3436] hover:bg-black/5'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={scrollToDownload}
              className="ml-4 bg-[#2D3436] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#2D3436]/90 transition-all shadow-lg shadow-[#2D3436]/10 hover:shadow-[#2D3436]/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Get Free Course
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDFBF7] border-t border-black/5"
          >
            <div className="px-6 py-6 space-y-2">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-xl text-[#2D3436]/70 hover:bg-black/5 font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToDownload();
                }}
                className="w-full bg-[#2D3436] text-white py-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Get Free Course
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
