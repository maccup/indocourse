import { Link } from 'react-router-dom';
import { Mail, Headphones, Heart, Shield, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#2D3436] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <span className="text-3xl">🐵</span>
              <span className="font-bold text-lg">Learn with Kiki</span>
            </div>
            <p className="text-white/50 text-sm">
              Free Indonesian course. Made with 🍌 and love.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/audio"
              className="flex items-center gap-2 text-white/60 hover:text-[#2EC4B6] transition-colors"
            >
              <Headphones className="w-5 h-5" />
              Audio
            </Link>
            <Link
              to="/privacy-policy"
              className="flex items-center gap-2 text-white/60 hover:text-[#2EC4B6] transition-colors"
            >
              <Shield className="w-5 h-5" />
              Privacy
            </Link>
            <Link
              to="/terms"
              className="flex items-center gap-2 text-white/60 hover:text-[#2EC4B6] transition-colors"
            >
              <FileText className="w-5 h-5" />
              Terms
            </Link>
            <a
              href="mailto:hello@indonesianbasics.com"
              className="flex items-center gap-2 text-white/60 hover:text-[#2EC4B6] transition-colors"
            >
              <Mail className="w-5 h-5" />
              Say hi!
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-[#2EC4B6]" /> for Indonesia lovers · © 2025
        </div>
      </div>
    </footer>
  );
}
