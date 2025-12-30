import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollToDownload: () => void;
}

const navItems = [
  { label: 'Why Kiki?', href: '#features' },
  { label: 'Preview', href: '#preview' },
  { label: 'FAQ', href: '#faq' }
];

export function Navbar({ activeSection, scrollToDownload }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <a href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="text-3xl"
            >
              🐵
            </motion.div>
            <span className="font-bold text-xl tracking-tight">
              Learn with <span className="text-[#2EC4B6]">Kiki</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === item.href.slice(1)
                    ? 'bg-[#2EC4B6]/10 text-[#2EC4B6]'
                    : 'text-[#2D3436]/60 hover:text-[#2D3436] hover:bg-black/5'
                }`}
              >
                {item.label}
              </a>
            ))}
            <motion.button
              onClick={scrollToDownload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4 bg-[#2EC4B6] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#2EC4B6]/90 transition-all shadow-lg shadow-[#2EC4B6]/20 hover:shadow-[#2EC4B6]/30"
            >
              Get Free eBook 🎉
            </motion.button>
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
            className="md:hidden bg-white border-t border-black/5"
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
                className="w-full bg-[#2EC4B6] text-white py-4 rounded-xl font-bold mt-4"
              >
                Get Free eBook 🎉
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
