import { motion } from 'framer-motion';

const authors = [
  {
    name: 'Maciej Cupial',
    role: 'Content Architect',
    photo: '/images/authors/maciej.jpg',
    bio: 'A digital nomad based in Ubud, Bali. Having learned four languages (Polish, English, Spanish, German), Maciej designed this course using the same frameworks that helped him master European languages.',
    highlight: 'Built for learners, by a learner'
  },
  {
    name: 'Fawwaz Faishal',
    role: 'Language Expert',
    photo: '/images/authors/fawwaz.jpg',
    bio: 'A native Indonesian speaker with years of experience teaching Bahasa Indonesia to foreigners. Fawwaz ensures every phrase sounds natural and is actually used by locals.',
    highlight: 'Native speaker authenticity'
  }
];

export function Authors() {
  return (
    <section id="authors" className="py-24 lg:py-32 px-6 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Meet the authors
          </h2>
          <p className="text-xl text-[#2D3436]/60">
            A learner who knows what works + a native who keeps it real.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {authors.map((author, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-white border-2 border-[#2D3436]/5 shadow-lg flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-16 h-16 rounded-2xl object-cover object-top"
                />
                <div>
                  <h3 className="text-xl font-bold">{author.name}</h3>
                  <p className="text-sm font-semibold text-[#2EC4B6] uppercase tracking-wide">
                    {author.role}
                  </p>
                </div>
              </div>
              <p className="text-[#2D3436]/70 leading-relaxed flex-grow">
                {author.bio}
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center gap-2 bg-[#FFE66D]/30 text-[#2D3436] px-4 py-2 rounded-full text-sm font-medium">
                  {author.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
