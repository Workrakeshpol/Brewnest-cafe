import React, { useState, useEffect } from 'react';
import { TESTIMONIALS, TestimonialItem } from '../data/cafeData';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1));
  };

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0));
  };

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -100 : 100,
      opacity: 0,
    }),
  };

  const current: TestimonialItem = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-dark-espresso text-cream-beige relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-radial-glow opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Customer Reviews
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            What Our Guests Say
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Read the genuine experiences of remote professionals, coffee connoisseurs, and dessert lovers who visit BrewNest.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[340px] flex items-center justify-center">
          
          {/* Navigation Chevrons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 lg:-left-12 p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-accent-gold hover:text-dark-espresso transition-all duration-300 z-10 hover:scale-105 active:scale-95 cursor-pointer"
            title="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 lg:-right-12 p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-accent-gold hover:text-dark-espresso transition-all duration-300 z-10 hover:scale-105 active:scale-95 cursor-pointer"
            title="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Testimonial Card */}
          <div className="w-full max-w-3xl overflow-hidden px-6 sm:px-12">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="p-8 sm:p-12 rounded-3xl glass-card-dark border border-accent-gold/15 text-center flex flex-col items-center shadow-2xl relative"
              >
                {/* Large Quote Mark */}
                <Quote className="w-12 h-12 text-accent-gold/15 absolute top-6 left-6" />

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(current.rating)
                          ? 'text-accent-gold fill-accent-gold'
                          : 'text-white/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="font-sans text-base sm:text-lg text-cream-beige/90 italic leading-relaxed mb-8 max-w-2xl">
                  "{current.comment}"
                </p>

                {/* Customer Details */}
                <div className="flex items-center gap-4">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-accent-gold/40 shadow-lg"
                  />
                  <div className="text-left">
                    <h4 className="font-serif text-base font-bold text-cream-beige">
                      {current.name}
                    </h4>
                    <p className="text-xs text-accent-gold font-sans font-medium">
                      {current.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 'right' : 'left');
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex ? 'w-8 bg-accent-gold' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
