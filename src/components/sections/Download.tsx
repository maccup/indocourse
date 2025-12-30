import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EmailModal } from '../EmailModal';

export function Download() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="download" className="py-24 lg:py-32 px-6 bg-[#2EC4B6] text-white scroll-mt-20 relative overflow-hidden">
        {/* Floating decorations */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          🐵
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-10 right-10 text-6xl opacity-20"
        >
          🍌
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-20 text-4xl opacity-20"
        >
          🌴
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-8"
          >
            🐵
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Ready to join Kiki?
          </h2>

          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get the complete course FREE! Kiki's already packed the bananas... 🍌
          </p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-[#FFE66D] text-[#2D3436] px-10 py-5 rounded-2xl font-black text-lg hover:bg-yellow-300 transition-all shadow-xl inline-flex items-center justify-center gap-3"
          >
            Get Free eBook Now!
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <p className="text-white/70 text-sm mt-6">
            📚 PDF eBook + 🎧 Audio files + 🎁 Bonus materials
          </p>
        </motion.div>
      </section>

      <EmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
