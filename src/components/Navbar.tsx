import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Search, ShoppingBag, Sun, Moon, Coffee, ArrowRight, Star, User, LogOut, Award, LogIn } from 'lucide-react';
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
    menuItems,
    addToast,
  } = useApp();

  const { user, login, register, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

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
    ? menuItems.filter((item) =>
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

              {/* User Dropdown / Login Button */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className={`p-2 rounded-xl flex items-center gap-1.5 transition-all hover:bg-white/10 ${
                        isScrolled ? 'text-current' : 'text-cream-beige'
                      }`}
                      title="User Profile"
                    >
                      <User className="w-5 h-5 text-accent-gold" />
                      <span className="hidden sm:inline text-xs font-semibold">{user.firstName}</span>
                    </button>
                    
                    <AnimatePresence>
                      {isUserDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-dark-espresso border border-accent-gold/20 p-4 shadow-2xl z-50 text-cream-beige text-left"
                          >
                            <div className="pb-3 border-b border-white/5 mb-3">
                              <h4 className="font-serif font-bold text-sm text-accent-gold">{user.firstName} {user.lastName || ''}</h4>
                              <p className="text-[10px] text-cream-beige/50 font-sans truncate">{user.email}</p>
                            </div>
                            
                            {user.loyalty && (
                              <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-3 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-accent-gold flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5" /> Bronze Tier
                                  </span>
                                  <span className="text-[10px] text-cream-beige/50 uppercase tracking-widest font-sans font-bold">Loyalty</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-1">
                                  <span className="font-serif font-extrabold text-lg text-cream-beige">{user.loyalty.availablePoints}</span>
                                  <span className="text-[9px] text-cream-beige/40 font-medium">Available Points</span>
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={async () => {
                                setIsUserDropdownOpen(false);
                                await logout();
                                addToast('Logged out successfully', 'info');
                              }}
                              className="w-full py-2 px-3.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-cream-beige hover:text-red-400 text-xs font-semibold font-sans flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" /> Log Out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthError('');
                    }}
                    className={`p-2 rounded-xl flex items-center gap-1.5 transition-all hover:bg-white/10 ${
                      isScrolled ? 'text-current' : 'text-cream-beige'
                    }`}
                    title="Sign In"
                  >
                    <LogIn className="w-5 h-5 text-accent-gold" />
                    <span className="hidden sm:inline text-xs font-semibold">Sign In</span>
                  </button>
                )}
              </div>

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

      {/* Auth Modal (Sign In / Register) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={() => setIsAuthModalOpen(false)} />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-dark-espresso text-cream-beige max-w-md w-full rounded-3xl border border-accent-gold/20 p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream-beige hover:text-accent-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title / Tab Selector */}
              <div className="text-center mb-6">
                <Coffee className="w-10 h-10 text-accent-gold mx-auto mb-2.5" />
                <h3 className="font-serif text-2xl font-bold mb-1">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-xs text-cream-beige/50 font-sans">
                  {authMode === 'login' ? 'Sign in to sync your cart, orders & loyalty points' : 'Join BrewNest loyalty and earn points on every cup'}
                </p>
              </div>

              {authError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-sans">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthLoading(true);
                  setAuthError('');
                  try {
                    if (authMode === 'login') {
                      await login(email, password);
                      addToast('Welcome back to BrewNest! ☕', 'success');
                    } else {
                      await register({
                        email,
                        password,
                        firstName,
                        lastName: lastName || null,
                        phone: phone || null,
                      });
                      addToast('Account created successfully! Welcome to BrewNest. 🎉☕', 'success');
                    }
                    setIsAuthModalOpen(false);
                    // Reset forms
                    setEmail('');
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    setPhone('');
                  } catch (err: any) {
                    setAuthError(err.message || 'Authentication failed. Please try again.');
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                className="space-y-4"
              >
                {authMode === 'register' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-accent-gold hover:bg-accent-gold/90 disabled:bg-accent-gold/50 text-dark-espresso font-semibold font-sans text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {authLoading ? 'Authenticating...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Mode Toggle */}
              <div className="text-center mt-6 pt-4 border-t border-white/5 text-xs text-cream-beige/60">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setAuthMode('register');
                        setAuthError('');
                      }}
                      className="text-accent-gold font-semibold underline ml-1 hover:text-cream-beige transition-colors cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError('');
                      }}
                      className="text-accent-gold font-semibold underline ml-1 hover:text-cream-beige transition-colors cursor-pointer"
                    >
                      Sign in here
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
