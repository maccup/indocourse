import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, ArrowLeft, BookOpen } from 'lucide-react';

interface VocabItem {
  indonesian: string;
  english: string;
}

interface DialogueLine {
  speaker: string;
  text: string;
}

interface UnitData {
  unit: string;
  vocabulary: VocabItem[];
  dialogue: DialogueLine[];
}

function slugify(text: string): string {
  return text
    .replace(/[\/\s]+/g, '_')
    .toLowerCase();
}

function sanitizeSpeaker(name: string): string {
  return name.replace(/[\/\s]+/g, '_').toLowerCase();
}

function getAudioPath(unitNum: string, type: 'vocab' | 'dialogue', item: VocabItem | DialogueLine, index?: number): string {
  if (type === 'vocab') {
    const vocab = item as VocabItem;
    const slug = slugify(vocab.indonesian);
    return `/audio/en/unit${unitNum}_vocab_${slug}.mp3`;
  } else {
    const dialogue = item as DialogueLine;
    const speaker = sanitizeSpeaker(dialogue.speaker);
    return `/audio/en/unit${unitNum}_dialogue_${index}_${speaker}.mp3`;
  }
}

function AudioPlayer({ src, label, sublabel }: { src: string; label: string; sublabel?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current || error) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => setIsPlaying(false);
  const handleError = () => setError(true);

  return (
    <button
      onClick={togglePlay}
      disabled={error}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left group ${
        error
          ? 'bg-gray-100 cursor-not-allowed opacity-50'
          : 'bg-white hover:bg-[#2EC4B6]/5 hover:shadow-md border border-[#2EC4B6]/10'
      }`}
    >
      <audio ref={audioRef} src={src} onEnded={handleEnded} onError={handleError} preload="none" />
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
        isPlaying ? 'bg-[#2EC4B6] text-white' : 'bg-[#2EC4B6]/10 text-[#2EC4B6] group-hover:bg-[#2EC4B6]/20'
      }`}>
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#1A1A1A] truncate">{label}</div>
        {sublabel && <div className="text-sm text-[#1A1A1A]/60 truncate">{sublabel}</div>}
      </div>
      <Volume2 className="w-4 h-4 text-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </button>
  );
}

function UnitSection({ data, unitNum }: { data: UnitData; unitNum: string }) {
  const unitTitle = data.unit.replace(/^Unit \d+:\s*/, '');

  return (
    <section id={`unit-${unitNum}`} className="scroll-mt-24">
      <div className="bg-[#F5F5F5] rounded-2xl p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#2EC4B6] text-white flex items-center justify-center font-bold text-lg">
            {unitNum}
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-[#1A1A1A]">{unitTitle}</h2>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
              Vocabulary
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {data.vocabulary.map((vocab, idx) => (
                <AudioPlayer
                  key={idx}
                  src={getAudioPath(unitNum, 'vocab', vocab)}
                  label={vocab.indonesian}
                  sublabel={vocab.english}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#2EC4B6]" />
              Dialogue
            </h3>
            <div className="grid gap-2">
              {data.dialogue.map((line, idx) => (
                <AudioPlayer
                  key={idx}
                  src={getAudioPath(unitNum, 'dialogue', line, idx)}
                  label={`${line.speaker}: "${line.text}"`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AudioPage() {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch('/data/audio_production_script_EN.json')
      .then(res => res.json())
      .then(data => {
        setUnits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, location.hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2EC4B6] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[#1A1A1A]/10 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#2EC4B6] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div className="text-sm text-[#1A1A1A]/60">
            {units.length} Units &bull; 234 Audio Files
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
            Audio Companion
          </h1>
          <p className="text-[#1A1A1A]/70 max-w-2xl mx-auto">
            Listen to native Indonesian pronunciation for all vocabulary and dialogues.
            Use these audio files while reading the ebook.
          </p>
        </motion.div>

        <nav className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {units.map((_, idx) => {
              const unitNum = String(idx + 1).padStart(2, '0');
              return (
                <a
                  key={unitNum}
                  href={`#unit-${unitNum}`}
                  className="px-4 py-2 rounded-full bg-white border border-[#1A1A1A]/20 text-[#1A1A1A] hover:bg-[#2EC4B6] hover:text-white hover:border-[#2EC4B6] transition-all font-medium text-sm"
                >
                  Unit {idx + 1}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="space-y-8">
          {units.map((unit, idx) => {
            const unitNum = String(idx + 1).padStart(2, '0');
            return (
              <motion.div
                key={unitNum}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <UnitSection data={unit} unitNum={unitNum} />
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer className="bg-[#1A1A1A] text-white py-8 px-4 text-center">
        <p className="text-white/60 text-sm">
          Part of <Link to="/" className="text-white hover:text-[#2EC4B6] transition-colors">IndonesianBasics.com</Link>
        </p>
      </footer>
    </div>
  );
}
