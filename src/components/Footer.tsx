import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coffee, Mail, Facebook, Instagram, Twitter, ArrowUp, Send, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    addToast('Subscribed! Welcome to the BrewNest Club. ☕🥐', 'success');
    setEmail('');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-dark-espresso text-cream-beige border-t border-accent-gold/15 pt-16 pb-8 relative overflow-hidden font-sans">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-radial-glow opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/5">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToTop();
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-dark-espresso transition-all">
                <Coffee className="w-5.5 h-5.5 text-accent-gold group-hover:text-dark-espresso transition-colors" />
              </div>
              <div>
                <span className="font-serif text-xl font-black tracking-wide block leading-none text-accent-gold">
                  BrewNest
                </span>
                <span className="text-[9px] font-sans font-medium tracking-widest uppercase block mt-0.5 text-cream-beige/80">
                  Crafted Coffee, Cozy Moments
                </span>
              </div>
            </a>
            
            <p className="text-xs sm:text-sm text-cream-beige/60 leading-relaxed max-w-sm">
              We are a premium specialty coffee shop dedicated to roasting organic micro-lot beans, handcrafting exquisite desserts, and building cozy, minimalist spaces for creators and communities.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Facebook, label: 'Facebook', url: 'https://facebook.com' },
                { icon: Instagram, label: 'Instagram', url: 'https://instagram.com' },
                { icon: Twitter, label: 'Twitter', url: 'https://twitter.com' },
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-accent-gold border border-white/5 hover:border-accent-gold text-cream-beige hover:text-dark-espresso flex items-center justify-center transition-all duration-300 hover:scale-105"
                    title={social.label}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2.5 text-left space-y-4">
            <h4 className="font-serif text-base font-bold text-accent-gold uppercase tracking-wider">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5 text-sm font-medium">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Artisan Menu', id: 'menu' },
                { label: 'Our Story', id: 'about' },
                { label: 'Aesthetic Gallery', id: 'gallery' },
                { label: 'Testimonials', id: 'testimonials' },
                { label: 'Book Table', id: 'reservation' },
                { label: 'Contact Us', id: 'contact' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(link.id);
                  }}
                  className="text-cream-beige/70 hover:text-accent-gold transition-colors text-xs sm:text-sm self-start"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Opening Hours (2.5 cols) */}
          <div className="lg:col-span-2.5 text-left space-y-4">
            <h4 className="font-serif text-base font-bold text-accent-gold uppercase tracking-wider">
              Opening Hours
            </h4>
            <div className="space-y-3 text-xs sm:text-sm font-medium text-cream-beige/75">
              <div>
                <span className="text-accent-gold/80 text-xs block font-bold uppercase tracking-wider">Mon - Thu</span>
                <span className="mt-0.5 block">7:00 AM - 10:00 PM</span>
              </div>
              <div>
                <span className="text-accent-gold/80 text-xs block font-bold uppercase tracking-wider">Fri - Sat</span>
                <span className="mt-0.5 block">7:00 AM - 11:00 PM</span>
                <span className="text-[10px] text-accent-gold italic block mt-0.5">Live Acoustic Nights!</span>
              </div>
              <div>
                <span className="text-accent-gold/80 text-xs block font-bold uppercase tracking-wider">Sunday</span>
                <span className="mt-0.5 block">8:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 text-left space-y-4">
            <h4 className="font-serif text-base font-bold text-accent-gold uppercase tracking-wider">
              Join the Nest
            </h4>
            <p className="text-xs text-cream-beige/60 leading-relaxed">
              Subscribe to our newsletter to receive secret coffee recipes, promo codes, and early access to acoustic night tickets.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1.5">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-11 py-3 text-xs text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-accent-gold text-dark-espresso hover:bg-accent-gold/90 transition-colors flex items-center justify-center cursor-pointer"
                  title="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[9px] text-cream-beige/40 block">
                * We value your privacy. Unsubscribe at any time.
              </span>
            </form>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-beige/40">
          <p>© 2025 BrewNest Café. Crafted Coffee, Cozy Moments. All rights reserved.</p>
          
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>for final year showcase.</span>
          </div>

          <button
            onClick={handleScrollToTop}
            className="p-2 rounded-xl bg-white/5 hover:bg-accent-gold border border-white/5 hover:border-accent-gold text-cream-beige hover:text-dark-espresso transition-all shadow-md group"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
};
