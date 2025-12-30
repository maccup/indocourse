import { motion } from 'framer-motion';

const units = [
  { emoji: '👋', title: 'Greetings', desc: 'Kiki learns to wave hello (a bit too enthusiastically)' },
  { emoji: '💰', title: 'Numbers & Money', desc: 'So many zeros! Kiki vs Indonesian Rupiah' },
  { emoji: '🌶️', title: 'Food & Dining', desc: 'Kiki discovers sambal is VERY spicy' },
  { emoji: '🛵', title: 'Directions', desc: 'Kiki gets lost (with map upside down)' },
  { emoji: '⏰', title: 'Time & Routine', desc: 'Kiki is late again!' },
  { emoji: '👨‍👩‍👧‍👦', title: 'Family', desc: 'Kiki meets ALL the relatives' },
  { emoji: '🥵', title: 'Adjectives', desc: 'Hot outside, freezing in the mall' },
  { emoji: '🤒', title: 'Health', desc: 'Kiki catches Bali Belly' },
  { emoji: '📅', title: 'Past & Future', desc: 'Yesterday was chaos, tomorrow will be better!' },
  { emoji: '🙏', title: 'Etiquette', desc: 'Kiki learns to bow (bows too deep)' }
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
            Kiki's 10 Adventures 🐵
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Each unit = one hilarious situation Kiki gets into while learning Indonesian
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
