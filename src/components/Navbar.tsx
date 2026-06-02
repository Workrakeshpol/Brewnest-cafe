import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_ITEMS } from '../data/cafeData';
import { Menu, X, Search, ShoppingBag, Sun, Moon, Coffee, ArrowRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    cartCount,
    setIsCartOpen,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll handler to make navbar solid on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered search results
  const searchResults = searchQuery
    ? MENU_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleScrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-dark-espresso/90 dark:bg-dark-espresso/90 bg-cream-beige/90 dark:text-cream-beige text-dark-espresso shadow-xl backdrop-blur-md border-b border-accent-gold/15'
            : 'py-5 bg-transparent text-cream-beige'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleScrollToSection('home');
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-dark-espresso transition-all duration-300">
                <Coffee className="w-5.5 h-5.5 text-accent-gold group-hover:text-dark-espresso transition-colors" />
              </div>
              <div>
                <span className="font-serif text-xl font-black tracking-wide block leading-none text-accent-gold">
                  BrewNest
                </span>
                <span className="text-[9px] font-sans font-medium tracking-widest uppercase block mt-0.5 text-cream-beige opacity-80">
                  Crafted Coffee
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-sans font-medium">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Menu', id: 'menu' },
                { label: 'About', id: 'about' },
                { label: 'Gallery', id: 'gallery' },
                { label: 'Testimonials', id: 'testimonials' },
                { label: 'Reservation', id: 'reservation' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(link.id);
                  }}
                  className={`relative py-1 hover:text-accent-gold transition-colors group ${
                    isScrolled ? 'text-current' : 'text-cream-beige'
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent-gold transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 rounded-xl transition-all hover:bg-white/10 ${
                  isScrolled ? 'text-current' : 'text-cream-beige'
                }`}
                title="Search Menu"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition-all hover:bg-white/10 ${
                  isScrolled ? 'text-current' : 'text-cream-beige'
                }`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5 text-accent-gold" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Cart Icon with Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`p-2 rounded-xl relative transition-all hover:bg-white/10 ${
                  isScrolled ? 'text-current' : 'text-cream-beige'
                }`}
                title="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-accent-gold text-dark-espresso font-sans font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-espresso"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Order Now Button */}
              <button
                onClick={() => handleScrollToSection('menu')}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md shadow-accent-gold/10"
              >
                Order Now <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-xl transition-all hover:bg-white/10 ${
                  isScrolled ? 'text-current' : 'text-cream-beige'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 right-0 z-30 bg-dark-espresso/95 backdrop-blur-lg border-b border-accent-gold/10 text-cream-beige block md:hidden max-h-[calc(100vh-72px)] overflow-y-auto"
          >
            <div className="px-5 py-6 space-y-4">
              {[
                { label: 'Home', id: 'home' },
                { label: 'Menu', id: 'menu' },
                { label: 'About', id: 'about' },
                { label: 'Gallery', id: 'gallery' },
                { label: 'Testimonials', id: 'testimonials' },
                { label: 'Reservation', id: 'reservation' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollToSection(link.id);
                  }}
                  className="block text-base font-medium hover:text-accent-gold py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleScrollToSection('menu');
                }}
                className="w-full py-3.5 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl bg-dark-espresso border border-accent-gold/20 p-5 shadow-2xl z-10"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-accent-gold/10 pb-4">
                <Search className="w-5.5 h-5.5 text-accent-gold flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our artisan coffees, desserts, breakfast..."
                  className="flex-1 bg-transparent border-none text-cream-beige text-base placeholder-cream-beige/30 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-1.5 rounded-full hover:bg-white/5 text-cream-beige/60 hover:text-cream-beige transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search results */}
              <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          handleScrollToSection('menu');
                        }}
                        className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-accent-gold/10 cursor-pointer transition-all"
                      >
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-sans font-bold text-sm text-cream-beige">{item.name}</h4>
                          <p className="text-xs text-cream-beige/50 truncate mt-0.5">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-serif font-bold text-sm text-accent-gold block">${item.price.toFixed(2)}</span>
                          <span className="text-[10px] text-cream-beige/40 flex items-center justify-end gap-0.5 mt-0.5">
                            <Star className="w-3 h-3 text-accent-gold fill-accent-gold" /> {item.rating}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-cream-beige/50 text-sm">
                      No coffees or treats match your search. Try "Latte" or "Tiramisu".
                    </div>
                  )
                ) : (
                  <div className="py-8 text-center text-cream-beige/40 text-xs font-sans uppercase tracking-wider">
                    Type above to search the BrewNest menu
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
