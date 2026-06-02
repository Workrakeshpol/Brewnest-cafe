import React, { useState } from 'react';
import { GALLERY_ITEMS, GalleryItem } from '../data/cafeData';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : GALLERY_ITEMS.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < GALLERY_ITEMS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="gallery" className="py-24 bg-dark-espresso text-cream-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Aesthetic Gallery
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Cozy Corners & Coffee Crafts
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Take a visual tour of our workspace corners, handcrafted latte art, and premium desserts. Every angle is designed for inspiration.
          </p>
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:auto-rows-[220px]">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onClick={() => handleOpenLightbox(index)}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${item.spanClass} h-[250px] md:h-auto`}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-espresso via-dark-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out space-y-1.5">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-accent-gold bg-accent-gold/10 border border-accent-gold/20 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-cream-beige pt-1">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-accent-gold font-medium">
                    <Maximize2 className="w-3 h-3" /> Click to enlarge
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            {/* Close trigger on backdrop */}
            <div className="absolute inset-0" onClick={handleCloseLightbox} />

            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream-beige hover:text-accent-gold transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-cream-beige hover:text-accent-gold transition-colors z-10 hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-cream-beige hover:text-accent-gold transition-colors z-10 hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[80vh] w-full flex flex-col items-center z-10"
            >
              <img
                src={GALLERY_ITEMS[lightboxIndex].image}
                alt={GALLERY_ITEMS[lightboxIndex].title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl border border-white/10 shadow-2xl"
              />
              
              {/* Image info */}
              <div className="text-center mt-4 max-w-md">
                <span className="text-xs text-accent-gold uppercase tracking-widest font-sans font-bold">
                  {GALLERY_ITEMS[lightboxIndex].category}
                </span>
                <h3 className="font-serif text-xl font-bold text-cream-beige mt-1">
                  {GALLERY_ITEMS[lightboxIndex].title}
                </h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instagram Feed Section */}
      <div className="mt-24 pt-16 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs text-accent-gold font-bold uppercase tracking-widest font-sans flex items-center justify-center gap-1.5">
            <Instagram className="w-4 h-4" /> Instagram Feed
          </span>
          <h3 className="font-serif text-2xl font-bold text-cream-beige">
            Join Our Digital Nest
          </h3>
          <p className="text-xs sm:text-sm text-cream-beige/50 font-sans">
            Share your cozy moments at <strong className="text-accent-gold">#BrewNestCafe</strong> or follow us <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-gold transition-colors">@brewnest.cafe</a>
          </p>
        </div>

        {/* Instagram Grid (4 columns) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {[
            { img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400', likes: '1.2k', comments: '42' },
            { img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=400', likes: '894', comments: '28' },
            { img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400', likes: '1.5k', comments: '64' },
            { img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400', likes: '952', comments: '31' },
          ].map((post, idx) => (
            <motion.a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-white/5 block shadow-md"
            >
              <img
                src={post.img}
                alt={`Instagram Post ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-cream-beige text-sm font-sans font-bold">
                <span className="flex items-center gap-1.5 hover:text-accent-gold transition-colors">
                  ❤️ {post.likes}
                </span>
                <span className="flex items-center gap-1.5 hover:text-accent-gold transition-colors">
                  💬 {post.comments}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
