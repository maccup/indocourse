import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    emoji: '🤔',
    q: 'Is Indonesian hard to learn?',
    a: 'Nope! It\'s one of the EASIEST languages for English speakers. No verb conjugations, no gendered nouns, no tones. Even Kiki learned the basics in a week! 🐵'
  },
  {
    emoji: '⏱️',
    q: 'How long until I can actually talk to people?',
    a: 'With just 15-20 minutes a day, you\'ll be having basic conversations in 2-4 weeks. Our course is designed for fast results - no fluff, just the stuff you\'ll actually use!'
  },
  {
    emoji: '🏝️',
    q: 'Do I really need Indonesian for Bali?',
    a: 'Technically no, but... locals LOVE when you try! You\'ll get better prices at markets, make genuine connections, and have way more fun. Plus, it feels amazing to order "Nasi Goreng tidak pedas" like a pro! 🍳'
  },
  {
    emoji: '📱',
    q: 'What do I actually get?',
    a: 'A beautiful PDF eBook with Kiki\'s adventures + MP3 audio files for every phrase. Works offline - perfect for practicing on the plane to Bali! ✈️'
  },
  {
    emoji: '💸',
    q: 'Wait, it\'s really FREE free?',
    a: 'Yep! 100% free. No credit card, no "premium upgrade" tricks. We made this because we love Indonesia and want more people to experience it like locals do. Kiki approves! 🐵👍'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 lg:py-32 px-6 bg-[#F8F9FA] scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Got questions? 🙋
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Kiki had the same ones when starting out!
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
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <summary className="cursor-pointer p-6 font-bold text-lg flex items-center gap-4 hover:text-[#2EC4B6] transition-colors list-none">
                <span className="text-2xl">{faq.emoji}</span>
                <span className="flex-1">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-[#2D3436]/30 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6 text-[#2D3436]/70 leading-relaxed pl-16">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
