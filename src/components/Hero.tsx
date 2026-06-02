import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Calendar, Star, Award, Users, ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-dark-espresso text-cream-beige"
    >
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cafe-interior.jpg"
          alt="BrewNest Cozy Cafe"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-espresso via-dark-espresso/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-espresso via-transparent to-dark-espresso/40" />
      </div>

      {/* Floating Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-radial-glow opacity-40 animate-pulse-slow pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest"
            >
              <Coffee className="w-3.5 h-3.5" /> Crafted Coffee, Cozy Moments
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-cream-beige"
            >
              Experience Coffee <br />
              <span className="text-accent-gold text-glow-gold">Like Never Before</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-base sm:text-lg text-cream-beige/80 max-w-xl leading-relaxed"
            >
              Freshly brewed artisan coffee, handcrafted desserts, and peaceful vibes. Step into BrewNest, where every cup is crafted with precision and passion.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={() => handleScrollTo('menu')}
                className="px-7 py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-accent-gold/20 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <Coffee className="w-4 h-4" /> Explore Menu
              </button>
              
              <button
                onClick={() => handleScrollTo('reservation')}
                className="px-7 py-4 rounded-xl border border-accent-gold/30 hover:border-accent-gold bg-white/5 hover:bg-accent-gold/10 text-cream-beige font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-accent-gold" /> Book Table
              </button>
            </motion.div>

            {/* Stats Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-8"
            >
              {/* Stat 1 */}
              <div className="p-4 rounded-2xl glass-card-dark hover:border-accent-gold/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center mb-2.5 text-accent-gold group-hover:bg-accent-gold group-hover:text-dark-espresso transition-all">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-serif text-lg sm:text-2xl font-black text-accent-gold">50K+</div>
                <div className="text-[10px] sm:text-xs text-cream-beige/60 uppercase font-sans font-semibold tracking-wider mt-0.5">Happy Customers</div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 rounded-2xl glass-card-dark hover:border-accent-gold/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center mb-2.5 text-accent-gold group-hover:bg-accent-gold group-hover:text-dark-espresso transition-all">
                  <Award className="w-4 h-4" />
                </div>
                <div className="font-serif text-lg sm:text-2xl font-black text-accent-gold">120+</div>
                <div className="text-[10px] sm:text-xs text-cream-beige/60 uppercase font-sans font-semibold tracking-wider mt-0.5">Coffee Recipes</div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 rounded-2xl glass-card-dark hover:border-accent-gold/30 transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center mb-2.5 text-accent-gold group-hover:bg-accent-gold group-hover:text-dark-espresso transition-all">
                  <Star className="w-4 h-4 fill-accent-gold" />
                </div>
                <div className="font-serif text-lg sm:text-2xl font-black text-accent-gold">4.9</div>
                <div className="text-[10px] sm:text-xs text-cream-beige/60 uppercase font-sans font-semibold tracking-wider mt-0.5">Average Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Coffee Cup Illustration with Floating Steam */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="relative w-72 h-72 sm:w-85 sm:h-85 animate-float"
            >
              {/* Circular Background Glow */}
              <div className="absolute inset-0 bg-radial-glow opacity-50 scale-110 pointer-events-none" />

              {/* Coffee Cup SVG */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_20px_50px_rgba(200,155,60,0.2)]"
              >
                {/* Floating Steam Lines */}
                <g stroke="#D9B99B" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.8">
                  {/* Steam Line 1 */}
                  <path
                    d="M 85 60 Q 80 45 90 35 T 85 10"
                    className="steam-line"
                  />
                  {/* Steam Line 2 (Delayed) */}
                  <path
                    d="M 100 60 Q 105 45 95 35 T 105 10"
                    className="steam-line-delayed-1"
                  />
                  {/* Steam Line 3 (Delayed) */}
                  <path
                    d="M 115 60 Q 110 45 120 35 T 115 10"
                    className="steam-line-delayed-2"
                  />
                </g>

                {/* Cup Body */}
                <path
                  d="M 50 70 C 50 140 150 140 150 70 Z"
                  fill="#4B2E2B"
                  stroke="#C89B3C"
                  stroke-width="5"
                />

                {/* Cup Rim */}
                <ellipse
                  cx="100"
                  cy="70"
                  rx="50"
                  ry="12"
                  fill="#1E1A18"
                  stroke="#C89B3C"
                  stroke-width="5"
                />

                {/* Coffee Liquid inside Cup */}
                <ellipse
                  cx="100"
                  cy="72"
                  rx="44"
                  ry="9"
                  fill="#C89B3C"
                  opacity="0.9"
                />
                
                {/* Coffee Crema Swirl */}
                <path
                  d="M 85 72 Q 100 75 115 70"
                  stroke="#F5E6D3"
                  stroke-width="2"
                  stroke-linecap="round"
                  fill="none"
                  opacity="0.7"
                />

                {/* Cup Handle */}
                <path
                  d="M 150 85 C 180 85 180 115 150 115"
                  fill="none"
                  stroke="#C89B3C"
                  stroke-width="5"
                  stroke-linecap="round"
                />

                {/* Elegant Saucer */}
                <path
                  d="M 30 145 C 30 170 170 170 170 145 Z"
                  fill="#1E1A18"
                  stroke="#C89B3C"
                  stroke-width="5"
                />
                
                <ellipse
                  cx="100"
                  cy="145"
                  rx="70"
                  ry="10"
                  fill="#1E1A18"
                  stroke="#C89B3C"
                  stroke-width="3"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer z-10" onClick={() => handleScrollTo('menu')}>
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-cream-beige/80">Scroll Down</span>
          <ChevronDown className="w-5 h-5 text-accent-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
};
