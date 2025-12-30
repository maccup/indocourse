import { motion } from 'framer-motion';

const units = [
  { emoji: '👋', title: 'Greetings', desc: 'Say hello without sounding like a robot!' },
  { emoji: '💰', title: 'Numbers & Money', desc: 'So many zeros! Master rupiah like a pro' },
  { emoji: '🌶️', title: 'Food & Dining', desc: 'Order nasi goreng, survive the sambal' },
  { emoji: '🛵', title: 'Directions', desc: 'Tell your Grab driver where to go' },
  { emoji: '⏰', title: 'Time & Routine', desc: 'Never be "jam karet" (rubber time)' },
  { emoji: '👨‍👩‍👧‍👦', title: 'Family', desc: 'Meet the whole big Indonesian family' },
  { emoji: '🥵', title: 'Adjectives', desc: 'Hot, cold, big, small - describe it all!' },
  { emoji: '🤒', title: 'Health', desc: 'Bali belly? Get help at the pharmacy' },
  { emoji: '📅', title: 'Past & Future', desc: 'Yesterday was fun, tomorrow will be better' },
  { emoji: '🙏', title: 'Etiquette', desc: 'Learn the 3 types of "please"!' }
];

export function WhatsInside() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            What's inside?
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            10 lessons for real situations - Kiki picked only the useful stuff!
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {units.map((unit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#F8F9FA] hover:bg-[#2EC4B6] group p-5 rounded-2xl text-center transition-all cursor-default"
            >
              <div className="text-4xl mb-3">{unit.emoji}</div>
              <h3 className="font-bold text-sm mb-1 group-hover:text-white transition-colors">
                {unit.title}
              </h3>
              <p className="text-xs text-[#2D3436]/50 group-hover:text-white/70 transition-colors">
                {unit.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bonus callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-[#FFE66D] rounded-2xl p-6 text-center">
            <p className="font-bold text-[#2D3436]">
              🎁 BONUS: Audio files + Cultural tips + Practice exercises included!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
