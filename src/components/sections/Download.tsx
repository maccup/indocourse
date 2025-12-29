import { motion } from 'framer-motion';
import { Download as DownloadIcon, BookOpen, Headphones, ArrowRight } from 'lucide-react';

export function Download() {
  return (
    <section id="download" className="py-24 lg:py-32 px-6 bg-gradient-to-br from-[#E07A5F] to-[#E07A5F]/90 text-white scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-8">
          <DownloadIcon className="w-10 h-10" />
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
          Start speaking Indonesian today
        </h2>

        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Download the complete course for free. No email required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/indonesian-basics.pdf"
            download
            className="group bg-white text-[#E07A5F] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#FDFBF7] transition-all shadow-xl flex items-center justify-center gap-3"
          >
            <BookOpen className="w-5 h-5" />
            Download PDF
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/indonesian-basics-audio.zip"
            download
            className="bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/20 flex items-center justify-center gap-2"
          >
            <Headphones className="w-5 h-5" />
            Download Audio
          </a>
        </div>
      </motion.div>
    </section>
  );
}
