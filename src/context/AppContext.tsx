import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MenuItem, MENU_ITEMS } from '../data/cafeData';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  message?: string;
  status: 'pending' | 'confirmed';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type OrderStatus = 'none' | 'confirmed' | 'preparing' | 'delivery' | 'delivered';

interface AppContextType {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (redeemedPoints?: number) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  
  // Reservations
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Live Order Tracker
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  estimatedDeliveryTime: string;
  
  // Loyalty Rewards
  loyaltyPoints: number;
  addLoyaltyPoints: (pts: number) => void;
  redeemPoints: (pts: number) => boolean;
  
  // Ambient Music
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  
  // Daily Special Modal
  isSpecialModalOpen: boolean;
  setIsSpecialModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Theme State ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('brew_nest_dark_mode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode for premium look
  });

  useEffect(() => {
    localStorage.setItem('brew_nest_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('brew_nest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('brew_nest_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        addToast(`Increased ${item.name} quantity to ${existing.quantity + qty}`, 'success');
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      addToast(`Added ${item.name} to cart`, 'success');
      return [...prev, { menuItem: item, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => {
    const item = cart.find((i) => i.menuItem.id === id);
    if (item) {
      addToast(`Removed ${item.menuItem.name} from cart`, 'info');
    }
    setCart((prev) => prev.filter((i) => i.menuItem.id !== id));
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.menuItem.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Favorites State ---
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('brew_nest_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('brew_nest_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    setFavorites((prev) => {
      if (prev.includes(id)) {
        if (item) addToast(`Removed ${item.name} from favorites`, 'info');
        return prev.filter((favId) => favId !== id);
      } else {
        if (item) addToast(`Added ${item.name} to favorites! ❤️`, 'success');
        return [...prev, id];
      }
    });
  };

  // --- Reservations State ---
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('brew_nest_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('brew_nest_reservations', JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
    const newRes: Reservation = {
      ...res,
      id: 'res_' + Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
    };
    setReservations((prev) => [newRes, ...prev]);
    addToast(`Table reserved successfully for ${res.guests} guests! 📅`, 'success');
  };

  // --- Toast System ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Live Order Tracker State ---
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('none');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');

  // Auto-advance order status for rich interactive simulation
  useEffect(() => {
    if (orderStatus === 'none') return;
    
    let timer: any;
    if (orderStatus === 'confirmed') {
      timer = setTimeout(() => {
        setOrderStatus('preparing');
        addToast('Chef is preparing your fresh BrewNest order! ☕🥐', 'info');
      }, 10000); // 10 seconds in confirmed
    } else if (orderStatus === 'preparing') {
      timer = setTimeout(() => {
        setOrderStatus('delivery');
        addToast('Your order is out for delivery! 🛵💨', 'info');
      }, 12000); // 12 seconds in preparing
    } else if (orderStatus === 'delivery') {
      timer = setTimeout(() => {
        setOrderStatus('delivered');
        addToast('Order delivered! Enjoy your cozy moments. 😊☕', 'success');
        addLoyaltyPoints(Math.round(cartTotal * 10)); // Reward points on delivery
      }, 15000); // 15 seconds in delivery
    }
    
    return () => clearTimeout(timer);
  }, [orderStatus]);

  // --- Loyalty Rewards State ---
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    const saved = localStorage.getItem('brew_nest_loyalty');
    return saved ? parseInt(saved, 10) : 120; // Default points to start with
  });

  useEffect(() => {
    localStorage.setItem('brew_nest_loyalty', loyaltyPoints.toString());
  }, [loyaltyPoints]);

  const addLoyaltyPoints = (pts: number) => {
    setLoyaltyPoints((prev) => prev + pts);
    addToast(`Earned +${pts} BrewNest Loyalty Points! 🌟`, 'success');
  };

  const redeemPoints = (pts: number): boolean => {
    if (loyaltyPoints >= pts) {
      setLoyaltyPoints((prev) => prev - pts);
      addToast(`Redeemed ${pts} points! Discount applied. 🎉`, 'success');
      return true;
    }
    addToast('Insufficient loyalty points.', 'error');
    return false;
  };

  // --- Checkout Simulation ---
  const checkout = (redeemedPoints = 0) => {
    if (cart.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }
    
    // Set estimation time
    const now = new Date();
    now.setMinutes(now.getMinutes() + 25);
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEstimatedDeliveryTime(timeStr);
    
    // Start tracking
    setOrderStatus('confirmed');
    addToast('Order placed successfully! Tracking started. 🛵', 'success');
    
    // Deduct loyalty points if redeemed
    if (redeemedPoints > 0) {
      redeemPoints(redeemedPoints);
    } else {
      // Add loyalty points for this order (10 points per dollar spent)
      const earned = Math.round(cartTotal * 10);
      addLoyaltyPoints(earned);
    }
    
    // Clear cart and close drawer
    clearCart();
    setIsCartOpen(false);
    
    // Scroll to order tracker
    const trackerEl = document.getElementById('order-tracker');
    if (trackerEl) {
      setTimeout(() => {
        trackerEl.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  // --- Ambient Music State ---
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Soft jazz/lofi track for cafe ambience
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25; // Nice background level

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
      addToast('Ambient music paused', 'info');
    } else {
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
          addToast('Cozy cafe music playing... 🎵☕', 'success');
        })
        .catch(() => {
          addToast('Could not play audio. Try interacting with the page first!', 'error');
        });
    }
  };

  // --- Daily Special Modal State ---
  const [isSpecialModalOpen, setIsSpecialModalOpen] = useState(false);

  useEffect(() => {
    // Show Daily Special Modal after 3 seconds on load
    const timer = setTimeout(() => {
      const shown = sessionStorage.getItem('brew_nest_special_shown');
      if (!shown) {
        setIsSpecialModalOpen(true);
        sessionStorage.setItem('brew_nest_special_shown', 'true');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        checkout,
        favorites,
        toggleFavorite,
        reservations,
        addReservation,
        toasts,
        addToast,
        removeToast,
        orderStatus,
        setOrderStatus,
        estimatedDeliveryTime,
        loyaltyPoints,
        addLoyaltyPoints,
        redeemPoints,
        isMusicPlaying,
        toggleMusic,
        isSpecialModalOpen,
        setIsSpecialModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
