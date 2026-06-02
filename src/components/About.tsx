import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Coffee, Heart } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Coffee Quality', value: 98 },
    { label: 'Customer Satisfaction', value: 99 },
    { label: 'Fresh Ingredients', value: 97 },
  ];

  return (
    <section id="about" className="py-24 bg-dark-espresso text-cream-beige relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-radial-glow opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Overlapping Image Collage */}
          <div className="lg:col-span-5 relative h-[480px] w-full max-w-md mx-auto lg:mx-0">
            {/* Main background image (Cafe Interior) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="absolute top-4 left-4 w-4/5 h-4/5 rounded-3xl overflow-hidden border-2 border-accent-gold/20 shadow-2xl z-10"
            >
              <img
                src="/images/cafe-interior.jpg"
                alt="BrewNest Interior"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlapping foreground image (Barista Craft) */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 50, rotate: 3 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute bottom-4 right-4 w-3/5 h-3/5 rounded-3xl overflow-hidden border-2 border-accent-gold/30 shadow-2xl z-20"
            >
              <img
                src="/images/barista.jpg"
                alt="Barista Pouring Coffee"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Decorative Gold Badges */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.5 }}
              className="absolute -top-4 -right-2 bg-accent-gold text-dark-espresso w-24 h-24 rounded-full flex flex-col items-center justify-center font-serif font-black shadow-xl z-30 border-4 border-dark-espresso"
            >
              <span className="text-sm leading-none">SINCE</span>
              <span className="text-xl leading-none">2020</span>
            </motion.div>
          </div>

          {/* Right: Narrative & Animated Progress Bars */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Our Story
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
                Crafting Moments, <br />
                <span className="text-accent-gold text-glow-gold">One Cup at a Time</span>
              </h2>
            </div>

            <div className="font-sans text-sm sm:text-base text-cream-beige/75 space-y-4 leading-relaxed">
              <p>
                Founded in the summer of 2020, <strong className="text-cream-beige">BrewNest Café</strong> was born out of a simple dream: to combine the scientific precision of specialty coffee extraction with the warm, comforting hospitality of a neighborhood sanctuary.
              </p>
              <p>
                We source our single-origin arabica beans through ethical, direct-trade partnerships with micro-lot farms across East Africa and South America. Every batch is roasted in-house in small quantities to preserve the bean's unique geographical flavor profile.
              </p>
              <p>
                Whether you are seeking a quiet Japanese-inspired minimalist corner for deep work, a lively acoustic evening with friends, or simply the perfect cup of espresso, BrewNest is your cozy nest away from home.
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-5 pt-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-baseline font-sans text-sm font-semibold">
                    <span className="text-cream-beige/90">{stat.label}</span>
                    <span className="text-accent-gold">{stat.value}%</span>
                  </div>
                  
                  {/* Track */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    {/* Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.15 }}
                      className="h-full bg-gradient-to-r from-coffee-brown to-accent-gold rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
