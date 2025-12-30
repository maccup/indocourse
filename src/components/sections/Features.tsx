import { motion } from 'framer-motion';

const features = [
  {
    emoji: '🙅‍♂️',
    title: 'No Robot Talk!',
    desc: 'We banned "Anda" (the formal you nobody uses). Learn "Mas", "Mba", "Pak" & "Bu" like real Indonesians!'
  },
  {
    emoji: '🎧',
    title: 'Hear It Right',
    desc: 'Every phrase has audio so you don\'t sound like a confused tourist. Listen, repeat, impress locals!'
  },
  {
    emoji: '🚀',
    title: 'Zero Grammar Pain',
    desc: 'No verb conjugations, no gender, no plurals. Indonesian is actually EASY - we\'ll prove it!'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 px-6 bg-[#F8F9FA] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Why learn with Kiki? 🐵
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Forget boring textbooks! This course is actually fun (we promise).
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group p-8 rounded-3xl bg-white hover:bg-[#2EC4B6] border-2 border-transparent hover:border-[#2EC4B6] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-5xl mb-6"
              >
                {feature.emoji}
              </motion.div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#2D3436]/60 group-hover:text-white/80 leading-relaxed transition-colors">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
