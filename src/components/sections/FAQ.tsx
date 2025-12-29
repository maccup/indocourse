import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is Indonesian easy to learn?',
    a: 'Yes! Indonesian uses the Latin alphabet, has no verb conjugations, no gendered nouns, and no tones. Most beginners can hold basic conversations within 2 weeks.'
  },
  {
    q: 'How long does it take to learn basic Indonesian?',
    a: 'With 15-20 minutes of daily practice, you can reach conversational level (A1-A2) in 2-4 weeks. Our course is designed for quick results.'
  },
  {
    q: 'Do I need to learn Indonesian for Bali?',
    a: 'While many speak English in tourist areas, knowing basic Indonesian dramatically improves your experience. Locals appreciate the effort and you\'ll get better prices at markets.'
  },
  {
    q: 'What format is the course?',
    a: 'You get a downloadable PDF eBook plus MP3 audio files. No internet needed after download - perfect for offline study.'
  },
  {
    q: 'Is this really free?',
    a: 'Yes, completely free. No email signup, no hidden fees. Just download and start learning.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32 px-6 bg-white scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Common questions
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Everything you need to know about learning Indonesian
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-[#FDFBF7] rounded-2xl overflow-hidden border border-black/5"
            >
              <summary className="cursor-pointer p-6 font-bold text-lg flex items-center justify-between hover:text-[#E07A5F] transition-colors list-none">
                <span>{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-[#2D3436]/30 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-[#2D3436]/60 leading-relaxed -mt-2">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
