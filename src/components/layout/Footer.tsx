import { Link } from 'react-router-dom';
import { Globe, Mail, Headphones } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#E07A5F] flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">IndonesianBasics</span>
            </div>
            <p className="text-white/50 text-sm">
              Free Indonesian for beginners. Learn like a local.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/audio"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <Headphones className="w-5 h-5" />
              Audio
            </Link>
            <a
              href="mailto:hello@indonesianbasics.com"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              hello@indonesianbasics.com
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
          © 2025 IndonesianBasics.com
        </div>
      </div>
    </footer>
  );
}
