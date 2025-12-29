import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const messages = [
  { speaker: 'Budi', text: 'Pagi, Mba.', translation: 'Morning, Miss.', side: 'left' as const },
  { speaker: 'Sarah', text: 'Pagi, Mas.', translation: 'Morning, Sir.', side: 'right' as const },
  { speaker: 'Budi', text: 'Apa kabar?', translation: 'How are you?', side: 'left' as const },
  { speaker: 'Sarah', text: 'Baik. Mas gimana?', translation: 'Good. How about you?', side: 'right' as const },
  { speaker: 'Budi', text: 'Baik juga.', translation: 'Good too.', side: 'left' as const }
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Real conversations,
              <br />
              <span className="text-[#E07A5F]">not textbook phrases.</span>
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Tap any message to hear the pronunciation. This is a preview from Unit 01: Greetings.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E07A5F] flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-lg">Listen</h4>
                  <p className="text-white/50">Tap to hear pronunciation</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#81B29A] flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-lg">Repeat</h4>
                  <p className="text-white/50">Practice the natural rhythm</p>
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#E07A5F] to-[#81B29A] rounded-full flex items-center justify-center text-white font-bold">
                ID
              </div>
              <div>
                <h3 className="font-bold">Meeting Someone New</h3>
                <p className="text-xs text-[#2D3436]/50">Unit 01 Preview</p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}>
                  <button
                    onClick={() => toggleAudio(`msg-${idx}`)}
                    className={`max-w-[80%] p-4 rounded-2xl text-left transition-all group ${
                      msg.side === 'right'
                        ? 'bg-[#E07A5F] text-white rounded-tr-sm hover:bg-[#E07A5F]/90'
                        : 'bg-[#F4F4F4] text-[#2D3436] rounded-tl-sm hover:bg-[#EBEBEB]'
                    }`}
                    aria-label={`Play: ${msg.text}`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{msg.text}</p>
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
