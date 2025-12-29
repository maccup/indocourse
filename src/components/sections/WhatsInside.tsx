import { motion } from 'framer-motion';
import { BookOpen, Headphones, MessageCircle, Coffee, MapPin, Globe } from 'lucide-react';

const units = [
  { icon: <MessageCircle className="w-4 h-4" />, text: 'Greetings & Introductions' },
  { icon: <Coffee className="w-4 h-4" />, text: 'Food & Dining' },
  { icon: <MapPin className="w-4 h-4" />, text: 'Directions & Transport' },
  { icon: <Globe className="w-4 h-4" />, text: 'Numbers & Bargaining' }
];

const bonusMaterials = [
  'Audio pronunciation files',
  'Quick reference cheat sheet',
  'Cultural notes for Bali',
  'Common mistakes to avoid'
];

export function WhatsInside() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            What's inside
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Everything you need to start speaking Indonesian
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl border border-black/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#E07A5F]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#E07A5F]" />
              </div>
              <h3 className="text-2xl font-bold">10 Essential Units</h3>
            </div>
            <div className="grid gap-4">
              {units.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FDFBF7]">
                  <span className="text-[#E07A5F]">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
              <p className="text-sm text-[#2D3436]/50 pl-3">+ 6 more units...</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl border border-black/5"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#81B29A]/10 flex items-center justify-center">
                <Headphones className="w-6 h-6 text-[#81B29A]" />
              </div>
              <h3 className="text-2xl font-bold">Bonus Materials</h3>
            </div>
            <div className="grid gap-4">
              {bonusMaterials.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#FDFBF7]">
                  <div className="w-2 h-2 rounded-full bg-[#81B29A]" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
              <p className="text-sm text-[#2D3436]/50 pl-3">+ practice exercises</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
