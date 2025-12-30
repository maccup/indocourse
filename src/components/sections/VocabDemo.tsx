import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const vocabCards = [
  {
    indonesian: 'Selamat pagi',
    english: 'Good morning',
    audio: '/audio/en/unit01_vocab_selamat_pagi.mp3',
    tip: 'Used until ~11 AM. Drop "Selamat" for casual: just say "Pagi!"'
  },
  {
    indonesian: 'Apa kabar?',
    english: 'How are you?',
    audio: '/audio/en/unit01_vocab_apa_kabar?.mp3',
    tip: 'Literally means "What news?" - respond with "Baik" (Good)!'
  },
  {
    indonesian: 'Makasih',
    english: 'Thanks',
    audio: '/audio/en/unit01_vocab_makasih.mp3',
    tip: 'Casual version of "Terima kasih". Locals use this way more!'
  },
  {
    indonesian: 'Berapa?',
    english: 'How much?',
    audio: '/audio/en/unit02_vocab_berapa?.mp3',
    tip: 'Essential for markets! Point at something and ask "Berapa?"'
  },
  {
    indonesian: 'Pedas',
    english: 'Spicy',
    audio: '/audio/en/unit03_vocab_pedas.mp3',
    tip: 'Say "Tidak pedas" (not spicy) to save yourself from sambal!'
  }
];

export function VocabDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentCard = vocabCards[currentIndex];

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(currentCard.audio);
    audioRef.current = audio;

    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabCards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + vocabCards.length) % vocabCards.length);
    }, 150);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <section className="py-24 lg:py-32 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#FFE66D] text-[#2D3436] px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            Try it now!
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Learn your first words
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            Tap the card to flip it. Click the speaker to hear native pronunciation!
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          {/* Flashcard */}
          <div className="relative w-full max-w-md aspect-[4/3] perspective-1000">
            <motion.div
              className="w-full h-full cursor-pointer"
              onClick={flipCard}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front - Indonesian */}
              <div
                className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-[#2EC4B6] to-[#20A99D] p-8 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wider">
                  Indonesian
                </p>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={currentCard.indonesian}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-4xl md:text-5xl font-bold text-white text-center"
                  >
                    {currentCard.indonesian}
                  </motion.h3>
                </AnimatePresence>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  className={`mt-6 p-4 rounded-full transition-all ${
                    isPlaying
                      ? 'bg-white text-[#2EC4B6] scale-110'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Play pronunciation"
                >
                  <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
                </button>
                <p className="text-white/50 text-sm mt-4">Tap to see English</p>
              </div>

              {/* Back - English + Tip */}
              <div
                className="absolute inset-0 backface-hidden rounded-3xl bg-white border-2 border-[#2EC4B6] p-8 flex flex-col items-center justify-center shadow-xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="text-[#2EC4B6] text-sm font-medium mb-4 uppercase tracking-wider">
                  English
                </p>
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={currentCard.english}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-4xl md:text-5xl font-bold text-[#2D3436] text-center"
                  >
                    {currentCard.english}
                  </motion.h3>
                </AnimatePresence>
                <div className="mt-6 bg-[#FFE66D]/30 rounded-xl p-4 max-w-sm">
                  <p className="text-[#2D3436]/70 text-sm text-center">
                    <span className="font-bold">Pro tip:</span> {currentCard.tip}
                  </p>
                </div>
                <p className="text-[#2D3436]/40 text-sm mt-4">Tap to flip back</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevCard}
              className="p-3 rounded-full bg-[#F8F9FA] hover:bg-[#2EC4B6] hover:text-white transition-all"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {vocabCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[#2EC4B6] w-6' : 'bg-[#2D3436]/20 hover:bg-[#2D3436]/40'
                  }`}
                  aria-label={`Go to card ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextCard}
              className="p-3 rounded-full bg-[#F8F9FA] hover:bg-[#2EC4B6] hover:text-white transition-all"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Card counter */}
          <p className="text-[#2D3436]/50 text-sm">
            Card {currentIndex + 1} of {vocabCards.length} • <span className="font-medium">234 total in the full course</span>
          </p>
        </div>
      </div>
    </section>
  );
}
