import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../data/cafeData';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingBag, Sparkles, Flame } from 'lucide-react';

const CATEGORIES = ['All', 'Coffee', 'Cold Brew', 'Desserts', 'Breakfast', 'Signature Drinks'] as const;

export const Menu: React.FC = () => {
  const { menuItems, addToCart, favorites, toggleFavorite } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  // Simulate skeleton loading on category change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (activeCategory === 'All') {
        setFilteredItems(menuItems);
      } else {
        setFilteredItems(menuItems.filter(item => item.category === activeCategory));
      }
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [activeCategory, menuItems]);

  return (
    <section id="menu" className="py-24 bg-dark-espresso text-cream-beige relative">
      {/* Background Orbs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-radial-glow opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-radial-glow opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted Menu
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Our Artisan Creations
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Sip on single-origin coffees brewed to perfection, and indulge in our exquisite, freshly baked pastries and signature treats.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-sans tracking-wide transition-all duration-300 border cursor-pointer ${
                activeCategory === category
                  ? 'bg-accent-gold border-accent-gold text-dark-espresso shadow-lg shadow-accent-gold/20 scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-cream-beige/80 hover:text-cream-beige'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Skeleton Loaders (6 items)
              Array.from({ length: 6 }).map((_, idx) => (
                <motion.div
                  key={`skeleton_${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border border-white/5 bg-white/5 p-4 space-y-4 animate-pulse"
                >
                  <div className="w-full h-52 bg-white/10 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded-md w-2/3" />
                    <div className="h-3 bg-white/10 rounded-md w-full" />
                    <div className="h-3 bg-white/10 rounded-md w-5/6" />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-white/10 rounded-md w-1/4" />
                    <div className="h-10 bg-white/10 rounded-xl w-1/3" />
                  </div>
                </motion.div>
              ))
            ) : (
              // Actual Menu Cards
              filteredItems.map((item) => {
                const isFavorited = favorites.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group rounded-3xl border border-white/5 hover:border-accent-gold/20 bg-dark-espresso/50 backdrop-blur-md p-4 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Card Image Area */}
                    <div className="relative h-52 overflow-hidden rounded-2xl mb-4 bg-coffee-brown">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Dark gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Floating Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {item.isSignature && (
                          <span className="bg-accent-gold text-dark-espresso font-sans font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Sparkles className="w-2.5 h-2.5" /> Signature
                          </span>
                        )}
                        {item.isPopular && (
                          <span className="bg-coffee-brown border border-accent-gold/20 text-accent-gold font-sans font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Flame className="w-2.5 h-2.5" /> Popular
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(item.id)}
                        className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border shadow-md transition-all active:scale-90 ${
                          isFavorited
                            ? 'bg-red-500/20 border-red-500 text-red-500'
                            : 'bg-black/40 border-white/10 text-cream-beige hover:text-red-400 hover:border-red-400/30'
                        }`}
                        title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating & Category */}
                        <div className="flex items-center justify-between text-xs text-cream-beige/50 font-medium mb-1.5">
                          <span className="font-sans">{item.category}</span>
                          <span className="flex items-center gap-1 font-semibold text-accent-gold font-sans">
                            <Star className="w-3.5 h-3.5 fill-accent-gold text-accent-gold" /> {item.rating}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg font-bold text-cream-beige group-hover:text-accent-gold transition-colors">
                          {item.name}
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-xs text-cream-beige/60 leading-relaxed mt-1.5 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-medium font-sans px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-cream-beige/50">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                        <span className="font-serif text-xl font-bold text-accent-gold">
                          ${item.price.toFixed(2)}
                        </span>

                        <button
                          onClick={() => addToCart(item, 1)}
                          className="px-4 py-2 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
