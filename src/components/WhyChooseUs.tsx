import React from 'react';
import { WHY_CHOOSE_US, WhyChooseUsItem } from '../data/cafeData';
import { Leaf, Award, Coffee, Wifi, Truck, Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper to map string names to components
const iconMap: Record<string, React.ComponentType<any>> = {
  Leaf: Leaf,
  Award: Award,
  Coffee: Coffee,
  Wifi: Wifi,
  Truck: Truck,
  Music: Music,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-24 bg-dark-espresso text-cream-beige relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-glow opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> The BrewNest Difference
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Why Coffee Lovers Choose Us
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            We combine artisanal roasting, world-class hospitality, and a cozy environment to create the ultimate cafe experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {WHY_CHOOSE_US.map((feature, idx) => {
            const IconComponent = iconMap[feature.iconName] || Coffee;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-6 sm:p-8 rounded-3xl glass-card-dark hover:border-accent-gold/40 hover:shadow-2xl hover:shadow-accent-gold/5 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent Corner Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:bg-accent-gold group-hover:text-dark-espresso group-hover:scale-110 transition-all duration-300 mb-6">
                  <IconComponent className="w-6.5 h-6.5 transition-transform group-hover:rotate-6" />
                </div>

                {/* Feature Text */}
                <h3 className="font-serif text-xl font-bold text-cream-beige mb-3 group-hover:text-accent-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="font-sans text-sm text-cream-beige/70 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
