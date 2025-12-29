import { motion } from 'framer-motion';
import { BookOpen, Headphones, Download, Play, Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  scrollToDownload: () => void;
}

export function Hero({ scrollToDownload }: HeroProps) {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#E07A5F]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#81B29A]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#81B29A]/10 text-[#81B29A] px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              100% Free Course
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Speak Indonesian
              <br />
              <span className="text-[#E07A5F]">like a local.</span>
            </h1>

            <p className="text-xl text-[#2D3436]/60 max-w-lg leading-relaxed">
              Stop saying "Anda". Learn the real Indonesian that locals actually use.
              Perfect for travelers and expats in Bali.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToDownload}
                className="group bg-[#E07A5F] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#E07A5F]/90 transition-all shadow-xl shadow-[#E07A5F]/20 hover:shadow-[#E07A5F]/30 flex items-center justify-center gap-3"
              >
                Download Free PDF
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#preview"
                className="bg-white text-[#2D3436] px-8 py-4 rounded-2xl font-bold text-lg border-2 border-[#2D3436]/10 hover:border-[#2D3436]/20 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                See Preview
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-[#2D3436]/50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>PDF eBook</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                <span>Audio Files</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Instant Access</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E07A5F] to-[#81B29A] rounded-3xl blur-2xl opacity-30 scale-105" />
              <div className="relative w-72 lg:w-96 aspect-[3/4] rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="/images/cover.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/95 via-[#FDFBF7]/40 to-[#FDFBF7]/90" />
                <div className="relative h-full flex flex-col p-6 lg:p-8">
                  <div className="text-center">
                    <h2 className="font-['Lora'] text-2xl lg:text-3xl font-bold text-[#E07A5F] leading-tight drop-shadow-sm">
                      Survival Indonesian
                    </h2>
                    <p className="text-sm lg:text-base text-[#3D405B] mt-2 font-medium">
                      10 Lessons to Speak Like a Local in Bali
                    </p>
                  </div>
                  <div className="flex-1" />
                  <div className="text-center">
                    <p className="text-sm text-[#3D405B] font-medium">by Maciej Cupial</p>
                    <p className="text-xs text-[#81B29A] mt-1">indonesianbasics.com</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#81B29A] text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                FREE
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
