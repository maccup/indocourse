import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';

const messages = [
  { speaker: '🐵', text: 'Pagi, Mba!', translation: 'Morning, Miss!', side: 'right' as const },
  { speaker: '👩', text: 'Pagi, Mas.', translation: 'Morning, Sir.', side: 'left' as const },
  { speaker: '🐵', text: 'Apa kabar?', translation: 'How are you?', side: 'right' as const },
  { speaker: '👩', text: 'Baik! Mas gimana?', translation: 'Good! How about you?', side: 'left' as const },
  { speaker: '🐵', text: 'Baik juga! 🍌', translation: 'Good too! (excited monkey noises)', side: 'right' as const }
];

export function Preview() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const toggleAudio = (id: string) => {
    if (isPlaying === id) {
      setIsPlaying(null);
    } else {
      setIsPlaying(id);
      setTimeout(() => setIsPlaying(null), 3000);
    }
  };

  return (
    <section id="preview" className="py-24 lg:py-32 px-6 bg-[#2D3436] text-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FFE66D] text-[#2D3436] px-4 py-2 rounded-full text-sm font-bold mb-6">
              <Volume2 className="w-4 h-4" />
              Try it out!
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Watch Kiki
              <br />
              <span className="text-[#2EC4B6]">make friends! 🐵</span>
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Tap the messages to hear how it sounds. This is Kiki's first conversation in Indonesia!
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                <div className="text-3xl">👂</div>
                <div>
                  <h4 className="font-bold">Listen</h4>
                  <p className="text-white/50 text-sm">Tap any bubble to hear it</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
                <div className="text-3xl">🗣️</div>
                <div>
                  <h4 className="font-bold">Repeat</h4>
                  <p className="text-white/50 text-sm">Say it out loud (like Kiki!)</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white text-[#2D3436] rounded-3xl p-6 shadow-2xl max-w-md mx-auto w-full"
          >
            <div className="flex items-center gap-3 border-b border-black/10 pb-4 mb-6">
              <div className="w-12 h-12 bg-[#2EC4B6] rounded-full flex items-center justify-center text-2xl">
                🐵
              </div>
              <div>
                <h3 className="font-bold">Kiki's First Hello!</h3>
                <p className="text-xs text-[#2D3436]/50">Unit 01: Greetings</p>
              </div>
            </div>

            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.side === 'right' ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
                >
                  <button
                    onClick={() => toggleAudio(`msg-${idx}`)}
                    className={`max-w-[85%] p-4 rounded-2xl text-left transition-all group hover:scale-105 ${
                      msg.side === 'right'
                        ? 'bg-[#2EC4B6] text-white rounded-tr-sm hover:bg-[#2EC4B6]/90'
                        : 'bg-[#F8F9FA] text-[#2D3436] rounded-tl-sm hover:bg-[#EBEBEB]'
                    }`}
                    aria-label={`Play: ${msg.text}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{msg.speaker}</span>
                      <div>
                        <p className="font-bold">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.side === 'right' ? 'text-white/70' : 'text-[#2D3436]/50'}`}>
                          {msg.translation}
                        </p>
                      </div>
                      {isPlaying === `msg-${idx}` ? (
                        <Pause className="w-4 h-4 animate-pulse flex-shrink-0" />
                      ) : (
                        <Play className="w-4 h-4 opacity-40 group-hover:opacity-100 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 text-center">
              <p className="text-sm text-[#2D3436]/50">
                🎉 Kiki made a friend! That was easy!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
