import { motion } from 'framer-motion';
import { BookOpen, Headphones, Play, Sparkles, ArrowRight, Heart } from 'lucide-react';

interface HeroProps {
  scrollToDownload: () => void;
}

export function Hero({ scrollToDownload }: HeroProps) {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#2EC4B6]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFE66D]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#FFE66D] text-[#2D3436] px-4 py-2 rounded-full text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              100% Free & Fun!
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Learn Indonesian
              <br />
              <span className="text-[#2EC4B6]">the fun way!</span>
            </h1>

            <p className="text-xl text-[#2D3436]/70 max-w-lg leading-relaxed">
              Join <strong>Kiki the Monkey</strong> on hilarious adventures through Indonesia!
              No boring textbooks - just real phrases locals actually use.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToDownload}
                className="group bg-[#2EC4B6] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#2EC4B6]/90 transition-all shadow-xl shadow-[#2EC4B6]/25 hover:shadow-[#2EC4B6]/40 hover:scale-105 flex items-center justify-center gap-3"
              >
                Get Free eBook
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#preview"
                className="bg-white text-[#2D3436] px-8 py-4 rounded-2xl font-bold text-lg border-2 border-[#2D3436]/10 hover:border-[#2EC4B6] hover:text-[#2EC4B6] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Sneak Peek
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-[#2D3436]/60 font-medium">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2EC4B6]" />
                <span>Beginner (A1-A2)</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#2EC4B6]" />
                <span>Audio Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#2EC4B6]" />
                <span>Made with Love</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-5 bg-white text-2xl p-3 rounded-2xl shadow-lg z-10"
              >
                🍌
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -right-5 bg-white text-2xl p-3 rounded-2xl shadow-lg z-10"
              >
                🏝️
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 -left-5 bg-white text-2xl p-3 rounded-2xl shadow-lg z-10"
              >
                🛵
              </motion.div>

              {/* Book cover - professional design */}
              <div className="absolute inset-0 bg-[#65a9a5] rounded-3xl blur-2xl opacity-30 scale-105" />
              <div className="relative w-72 lg:w-96 aspect-[5/6] rounded-3xl shadow-2xl overflow-hidden bg-[#65a9a5]">
                {/* Cover image - positioned to show Kiki with map */}
                <img
                  src="/images/cover.jpg"
                  alt="Learn Indonesian the fun way - with Kiki the Monkey"
                  className="absolute inset-0 w-full h-full object-cover transform translate-y-[5%] scale-110"
                />
                {/* Title overlay at top */}
                <div className="absolute top-0 left-0 right-0 pt-6 pb-8 px-4 text-center bg-gradient-to-b from-[#65a9a5] via-[#65a9a5]/90 to-transparent">
                  <h2 className="text-white font-black text-2xl lg:text-3xl leading-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                    Learn Indonesian
                  </h2>
                  <p className="text-[#FFE66D] font-bold text-lg lg:text-xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]">
                    the fun way!
                  </p>
                  <p className="text-white/95 font-medium text-xs lg:text-sm mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    Beginner Course (A1-A2)
                  </p>
                </div>
                {/* Authors at bottom */}
                <div className="absolute bottom-0 left-0 right-0 pb-2 pt-4 px-3 text-center">
                  <p className="text-white/95 font-medium text-xs lg:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                    10 lessons to speak like a local
                  </p>
                  <p className="text-white/80 font-medium text-[8px] lg:text-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                    Maciej Cupial & Fawwaz Faishal
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -top-2 -right-4 bg-[#FFE66D] text-[#2D3436] px-5 py-2 rounded-xl font-black text-base shadow-lg rotate-6 z-10"
              >
                FREE! 🎉
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
