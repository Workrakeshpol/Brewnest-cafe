import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SPECIAL_OFFERS, SpecialOfferItem } from '../data/cafeData';
import { Sparkles, Clock, Copy, Check, Percent, Gift, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const SpecialOffers: React.FC = () => {
  const { addToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target is end of today (midnight)
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Promo code "${code}" copied to clipboard! 🎟️`, 'success');
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <section id="special-offers" className="py-24 bg-dark-espresso text-cream-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Exclusive Deals
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Special Offers & Events
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Take advantage of our limited-time coffee deals and check out our upcoming acoustic music events.
          </p>
        </div>

        {/* Global Countdown Timer Banner */}
        <div className="max-w-3xl mx-auto mb-12 p-6 rounded-3xl border border-accent-gold/20 bg-coffee-brown/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-accent-gold/15 flex items-center justify-center text-accent-gold animate-bounce">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Today’s Flash Deals Expiry</h3>
              <p className="text-xs text-cream-beige/60 font-sans mt-0.5">Grab these exclusive discounts before the clock runs out!</p>
            </div>
          </div>

          {/* Countdown Clock UI */}
          <div className="flex items-center gap-3 font-mono text-cream-beige">
            <div className="flex flex-col items-center">
              <div className="bg-dark-espresso border border-accent-gold/20 px-3.5 py-2.5 rounded-xl font-bold text-xl sm:text-2xl text-accent-gold shadow-md">
                {formatNumber(timeLeft.hours)}
              </div>
              <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-cream-beige/50 mt-1">Hours</span>
            </div>
            <span className="text-xl font-bold text-accent-gold -mt-5 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-dark-espresso border border-accent-gold/20 px-3.5 py-2.5 rounded-xl font-bold text-xl sm:text-2xl text-accent-gold shadow-md">
                {formatNumber(timeLeft.minutes)}
              </div>
              <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-cream-beige/50 mt-1">Mins</span>
            </div>
            <span className="text-xl font-bold text-accent-gold -mt-5 animate-pulse">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-dark-espresso border border-accent-gold/20 px-3.5 py-2.5 rounded-xl font-bold text-xl sm:text-2xl text-accent-gold shadow-md">
                {formatNumber(timeLeft.seconds)}
              </div>
              <span className="text-[9px] uppercase font-sans font-bold tracking-wider text-cream-beige/50 mt-1">Secs</span>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SPECIAL_OFFERS.map((offer, idx) => {
            let bgGradient = 'from-coffee-brown/30 to-dark-espresso';
            let icon = <Percent className="w-6 h-6 text-accent-gold" />;
            
            if (offer.id === 'o1') {
              bgGradient = 'from-accent-gold/10 to-dark-espresso';
              icon = <Gift className="w-6 h-6 text-accent-gold" />;
            } else if (offer.id === 'o3') {
              bgGradient = 'from-coffee-brown/50 to-dark-espresso';
              icon = <Calendar className="w-6 h-6 text-accent-gold" />;
            }

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-6 sm:p-8 rounded-3xl border border-accent-gold/15 bg-gradient-to-br ${bgGradient} flex flex-col justify-between shadow-xl hover:shadow-2xl hover:border-accent-gold/30 hover:-translate-y-1 transition-all duration-300 relative group`}
              >
                {/* Accent Corner glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Top Row: Icon & Discount Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center">
                      {icon}
                    </div>
                    <span className="bg-accent-gold text-dark-espresso font-sans font-extrabold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                      {offer.discount}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-serif text-xl font-bold text-cream-beige mb-2 group-hover:text-accent-gold transition-colors">
                    {offer.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-cream-beige/70 leading-relaxed mb-6">
                    {offer.description}
                  </p>
                </div>

                {/* Promo Code Box */}
                <div
                  onClick={() => handleCopyCode(offer.code)}
                  className="mt-4 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-accent-gold/5 hover:border-accent-gold/20 cursor-pointer flex items-center justify-between transition-all"
                  title="Click to copy promo code"
                >
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-cream-beige/40 block">Coupon Code</span>
                    <span className="font-mono text-sm font-bold text-accent-gold tracking-wide">{offer.code}</span>
                  </div>
                  
                  <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cream-beige/60 hover:text-accent-gold transition-colors flex-shrink-0">
                    {copiedCode === offer.code ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
