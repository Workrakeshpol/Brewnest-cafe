import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../data/cafeData';
import { Sparkles, X, ShoppingBag, Clock } from 'lucide-react';

export const DailySpecialModal: React.FC = () => {
  const { isSpecialModalOpen, setIsSpecialModalOpen, addToCart, menuItems } = useApp();

  // Pick a special bundle: Traditional Tiramisu and BrewNest Signature Cold Brew
  const tiramisu = menuItems.find(m => m.name === 'Traditional Tiramisu') || {
    id: 'm7',
    name: 'Traditional Tiramisu',
    description: 'Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with premium dark cocoa powder.',
    category: 'Desserts' as const,
    price: 6.50,
    rating: 4.95,
    image: '/images/tiramisu.jpg',
    tags: ['Sweet', 'House Special'],
  };
  const coldBrew = menuItems.find(m => m.name === 'BrewNest Signature Cold Brew') || {
    id: 'm5',
    name: 'BrewNest Signature Cold Brew',
    description: 'Single-origin Ethiopian beans cold-steeped for 18 hours, infused with a touch of sweet orange zest and nitrogen charge.',
    category: 'Cold Brew' as const,
    price: 4.50,
    rating: 4.8,
    image: '/images/cold-brew.jpg',
    tags: ['Cold', 'Organic', '18hr Steep'],
  };

  const handleAddBundle = () => {
    addToCart(tiramisu as MenuItem, 1);
    addToCart(coldBrew as MenuItem, 1);
    setIsSpecialModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isSpecialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSpecialModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-accent-gold/30 bg-dark-espresso text-cream-beige shadow-2xl z-10"
          >
            {/* Top Banner */}
            <div className="relative h-48 overflow-hidden bg-coffee-brown">
              <img
                src="/images/cafe-interior.jpg"
                alt="BrewNest Ambience"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-espresso via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 bg-accent-gold text-dark-espresso font-sans font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Chef's Daily Special
              </div>
              
              <button
                onClick={() => setIsSpecialModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-cream-beige hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-accent-gold mb-2">
                The Cozy Afternoon Duo
              </h3>
              <p className="text-cream-beige/70 font-sans text-sm mb-6">
                Treat yourself to the ultimate pairing. Indulge in our premium espresso-soaked <strong className="text-cream-beige">Traditional Tiramisu</strong> paired perfectly with our slow-steeped <strong className="text-cream-beige">18-Hour Signature Cold Brew</strong>.
              </p>

              {/* Items Detail */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <img src="/images/tiramisu.jpg" alt="Tiramisu" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-sm">Traditional Tiramisu</h4>
                    <p className="text-xs text-cream-beige/50">Mascarpone & espresso-soaked cake</p>
                  </div>
                  <span className="font-serif font-bold text-accent-gold text-sm">$6.50</span>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <img src="/images/cold-brew.jpg" alt="Cold Brew" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-sans font-semibold text-sm">Signature Cold Brew</h4>
                    <p className="text-xs text-cream-beige/50">18hr slow cold-steeped coffee</p>
                  </div>
                  <span className="font-serif font-bold text-accent-gold text-sm">$4.50</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <div>
                  <div className="flex items-center gap-2 text-xs text-cream-beige/50 font-sans uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" /> Limited Time Bundle
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl font-bold text-accent-gold">$9.50</span>
                    <span className="text-sm text-cream-beige/40 line-through">$11.00</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsSpecialModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-cream-beige/80 hover:text-cream-beige hover:bg-white/5 text-sm font-semibold font-sans transition-colors"
                  >
                    No thanks
                  </button>
                  <button
                    onClick={handleAddBundle}
                    className="px-5 py-2.5 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-semibold font-sans text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add Duo to Cart
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
