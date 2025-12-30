import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';

const messages = [
  {
    speaker: 'Budi',
    emoji: '👨',
    text: 'Pagi, Mba.',
    translation: 'Morning, Miss.',
    side: 'right' as const,
    audio: '/audio/en/unit01_dialogue_0_budi.mp3'
  },
  {
    speaker: 'Sarah',
    emoji: '👩',
    text: 'Pagi, Mas.',
    translation: 'Morning, Sir.',
    side: 'left' as const,
    audio: '/audio/en/unit01_dialogue_1_sarah.mp3'
  },
  {
    speaker: 'Budi',
    emoji: '👨',
    text: 'Apa kabar?',
    translation: 'How are you?',
    side: 'right' as const,
    audio: '/audio/en/unit01_dialogue_2_budi.mp3'
  },
  {
    speaker: 'Sarah',
    emoji: '👩',
    text: 'Baik. Mas gimana?',
    translation: 'Good! How about you?',
    side: 'left' as const,
    audio: '/audio/en/unit01_dialogue_3_sarah.mp3'
  },
  {
    speaker: 'Budi',
    emoji: '👨',
    text: 'Baik juga. Makasih.',
    translation: 'Good too. Thanks!',
    side: 'right' as const,
    audio: '/audio/en/unit01_dialogue_4_budi.mp3'
  }
];

function AudioBubble({
  message,
  index,
  currentPlaying,
  onPlay
}: {
  message: typeof messages[0];
  index: number;
  currentPlaying: number | null;
  onPlay: (index: number) => void;
}) {
  const isPlaying = currentPlaying === index;

  return (
    <motion.div
      initial={{ opacity: 0, x: message.side === 'right' ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex ${message.side === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <button
        onClick={() => onPlay(index)}
        className={`max-w-[85%] p-4 rounded-2xl text-left transition-all group hover:scale-105 ${
          message.side === 'right'
            ? 'bg-[#2EC4B6] text-white rounded-tr-sm hover:bg-[#2EC4B6]/90'
            : 'bg-[#F8F9FA] text-[#2D3436] rounded-tl-sm hover:bg-[#EBEBEB]'
        }`}
        aria-label={`Play: ${message.text}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{message.emoji}</span>
          <div>
            <p className="font-bold">{message.text}</p>
            <p className={`text-xs mt-1 ${message.side === 'right' ? 'text-white/70' : 'text-[#2D3436]/50'}`}>
              {message.translation}
            </p>
          </div>
          {isPlaying ? (
            <Pause className="w-4 h-4 animate-pulse flex-shrink-0" />
          ) : (
            <Play className="w-4 h-4 opacity-40 group-hover:opacity-100 flex-shrink-0" />
          )}
        </div>
      </button>
    </motion.div>
  );
}

export function Preview() {
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (index: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (currentPlaying === index) {
      setCurrentPlaying(null);
      return;
    }

    const audio = new Audio(messages[index].audio);
    audioRef.current = audio;

    audio.onended = () => setCurrentPlaying(null);
    audio.onerror = () => setCurrentPlaying(null);

    audio.play().then(() => {
      setCurrentPlaying(index);
    }).catch(() => {
      setCurrentPlaying(null);
    });
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
              Listen to Budi
              <br />
              <span className="text-[#2EC4B6]">make a friend!</span>
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Tap to hear native pronunciation! This is from Unit 1 - Budi meets Sarah at a Bali co-working space. Easy, right?
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
                  <p className="text-white/50 text-sm">Practice saying it out loud</p>
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
                🎧
              </div>
              <div>
                <h3 className="font-bold">Meeting at the Cafe</h3>
                <p className="text-xs text-[#2D3436]/50">Unit 01: Greetings</p>
              </div>
            </div>

            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <AudioBubble
                  key={idx}
                  message={msg}
                  index={idx}
                  currentPlaying={currentPlaying}
                  onPlay={handlePlay}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 text-center">
              <p className="text-sm text-[#2D3436]/50">
                Budi made a friend! That was easy! 234 audio files in the full course.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
