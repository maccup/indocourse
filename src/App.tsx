import { useState, useEffect } from 'react';
import { Navbar, Footer } from './components/layout';
import { Hero, Features, WhatsInside, Preview, FAQ, Download } from './components/sections';

export default function App() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['features', 'preview', 'faq', 'download'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D3436] antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#E07A5F] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} scrollToDownload={scrollToDownload} />

      <main id="main-content">
        <Hero scrollToDownload={scrollToDownload} />
        <Features />
        <WhatsInside />
        <Preview />
        <FAQ />
        <Download />
      </main>

      <Footer />
    </div>
  );
}
