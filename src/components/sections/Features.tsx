import { motion } from 'framer-motion';
import { MessageCircle, Headphones, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <MessageCircle className="w-7 h-7" />,
    color: '#E07A5F',
    title: 'No Robot Language',
    desc: 'We ban the word "Anda". Learn to use "Mas", "Mba", "Pak", and "Bu" like locals do in Bali.'
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    color: '#81B29A',
    title: 'Audio Included',
    desc: 'Every phrase includes clear audio pronunciation. Listen and repeat to perfect your accent.'
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    color: '#3D405B',
    title: 'Zero Grammar Fluff',
    desc: 'Indonesian has no verb conjugations. We show you the shortcuts that make it easy to learn.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 px-6 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Why this course is different
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Most courses teach formal Indonesian. We teach you how locals actually speak.
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
              className="group p-8 rounded-3xl bg-[#FDFBF7] hover:bg-white border border-transparent hover:border-black/5 hover:shadow-xl transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#E07A5F] transition-colors">
                {feature.title}
              </h3>
              <p className="text-[#2D3436]/60 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
