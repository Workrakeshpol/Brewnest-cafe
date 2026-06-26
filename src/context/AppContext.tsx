import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MenuItem, BlogPostItem, TestimonialItem, GalleryItem, SpecialOfferItem } from '../data/cafeData';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

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
  
  // Dynamic Content from DB
  menuItems: MenuItem[];
  blogPosts: BlogPostItem[];
  testimonials: TestimonialItem[];
  galleryItems: GalleryItem[];
  specialOffers: SpecialOfferItem[];
  dailySpecial: MenuItem | null;
  loadingContent: boolean;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, qty?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  checkout: (orderType: 'dine_in' | 'takeaway' | 'delivery', tableNumber?: number | null, addressId?: string | null, promoCode?: string | null) => Promise<void>;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => Promise<void>;
  
  // Reservations
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => Promise<void>;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Live Order Tracker
  orderStatus: OrderStatus;
  setOrderStatus: (status: OrderStatus) => void;
  estimatedDeliveryTime: string;
  
  // Ambient Music
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  
  // Daily Special Modal
  isSpecialModalOpen: boolean;
  setIsSpecialModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Mapping Helpers ---

function mapMenuItem(dbItem: any): MenuItem {
  return {
    id: dbItem.id,
    name: dbItem.name,
    description: dbItem.description || '',
    category: dbItem.categoryName || 'Coffee',
    price: parseFloat(dbItem.basePrice),
    rating: parseFloat(dbItem.rating || '0.0'),
    image: dbItem.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    tags: dbItem.tags || [],
    isSignature: !!dbItem.isSignature,
    isPopular: !!dbItem.isPopular,
  };
}

function mapBlogPost(dbPost: any): BlogPostItem {
  return {
    id: dbPost.id,
    title: dbPost.title,
    excerpt: dbPost.excerpt || '',
    date: new Date(dbPost.publishedAt || dbPost.createdAt).toLocaleDateString(),
    readTime: `${dbPost.readTimeMin || 5} min read`,
    image: dbPost.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    author: 'BrewNest Chef',
    category: dbPost.category || 'Coffee',
    content: dbPost.content,
  };
}

function mapTestimonial(dbTestimonial: any): TestimonialItem {
  return {
    id: dbTestimonial.id,
    name: dbTestimonial.name,
    role: dbTestimonial.role || 'Coffee Lover',
    rating: parseFloat(dbTestimonial.rating || '5.0'),
    comment: dbTestimonial.comment || '',
    avatar: dbTestimonial.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  };
}

function mapGalleryItem(dbImg: any): GalleryItem {
  return {
    id: dbImg.id,
    image: dbImg.imageUrl,
    category: dbImg.category || 'Cafe',
    title: dbImg.title || 'BrewNest Details',
    spanClass: dbImg.sortOrder % 3 === 0 ? 'md:col-span-2' : '',
  };
}

function mapSpecialOffer(dbOffer: any): SpecialOfferItem {
  return {
    id: dbOffer.id,
    title: dbOffer.title,
    description: dbOffer.description || '',
    discount: dbOffer.discountText || 'Special discount',
    code: 'BREWBOGO',
    expiryHours: 24,
    bgType: dbOffer.bgType || 'gold',
  };
}

// --- Provider ---

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // --- Theme State ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('brew_nest_dark_mode');
    return saved ? JSON.parse(saved) : true;
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

  // --- Supporting API Content States ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOfferItem[]>([]);
  const [dailySpecial, setDailySpecial] = useState<MenuItem | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  // Load Content from API
  useEffect(() => {
    async function loadContent() {
      try {
        setLoadingContent(true);
        const [dbMenu, dbBlogs, dbTestimonials, dbGallery, dbOffers, dbSpecial] = await Promise.all([
          api.get<{ data: any[] }>('/menu/items?limit=50'),
          api.get<any[]>('/blog/posts'),
          api.get<any[]>('/testimonials'),
          api.get<any[]>('/gallery'),
          api.get<any[]>('/offers'),
          api.get<any>('/daily-special'),
        ]);

        // Access the nested array in paginated response
        const menuArray = Array.isArray(dbMenu) ? dbMenu : (dbMenu as any)?.data || [];

        setMenuItems(menuArray.map(mapMenuItem));
        setBlogPosts(dbBlogs.map(mapBlogPost));
        setTestimonials(dbTestimonials.map(mapTestimonial));
        setGalleryItems(dbGallery.map(mapGalleryItem));
        setSpecialOffers(dbOffers.map(mapSpecialOffer));
        if (dbSpecial) {
          setDailySpecial(mapMenuItem(dbSpecial));
        }
      } catch (error) {
        console.error('Failed to fetch public site content', error);
      } finally {
        setLoadingContent(false);
      }
    }
    loadContent();
  }, []);

  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart when user logs in
  useEffect(() => {
    async function fetchCart() {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const serverCart = await api.get<{ cartId: string; items: any[] }>('/cart');
        const formattedItems = serverCart.items.map((item: any) => ({
          menuItem: {
            id: item.menuItemId,
            name: item.name,
            description: '',
            category: 'Coffee' as const,
            price: parseFloat(item.basePrice),
            rating: 5.0,
            image: item.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
            tags: [],
          },
          quantity: item.quantity,
          cartItemId: item.id, // Keep server ID to make update/delete simple
        }));
        setCart(formattedItems);
      } catch (error) {
        console.error('Failed to load server cart', error);
      }
    }
    fetchCart();
  }, [user]);

  const addToCart = async (item: MenuItem, qty = 1) => {
    if (!user) {
      addToast('Please login to add items to your cart!', 'info');
      return;
    }
    try {
      await api.post('/cart/items', { menuItemId: item.id, quantity: qty });
      addToast(`Added ${item.name} to cart`, 'success');
      
      // Reload cart
      const serverCart = await api.get<{ items: any[] }>('/cart');
      const formattedItems = serverCart.items.map((it: any) => ({
        menuItem: {
          id: it.menuItemId,
          name: it.name,
          description: '',
          category: 'Coffee' as const,
          price: parseFloat(it.basePrice),
          rating: 5.0,
          image: it.imageUrl || '',
          tags: [],
        },
        quantity: it.quantity,
        cartItemId: it.id,
      }));
      setCart(formattedItems);
    } catch (error) {
      addToast('Failed to add item to cart', 'error');
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;
    try {
      // Find the cart item server ID
      const cartItem = cart.find(i => i.menuItem.id === id);
      const cartItemId = (cartItem as any)?.cartItemId;
      if (cartItemId) {
        await api.delete(`/cart/items/${cartItemId}`);
        setCart((prev) => prev.filter((i) => i.menuItem.id !== id));
        addToast('Item removed from cart', 'info');
      }
    } catch (error) {
      addToast('Failed to remove item', 'error');
    }
  };

  const updateCartQty = async (id: string, qty: number) => {
    if (!user) return;
    if (qty <= 0) {
      await removeFromCart(id);
      return;
    }
    try {
      const cartItem = cart.find(i => i.menuItem.id === id);
      const cartItemId = (cartItem as any)?.cartItemId;
      if (cartItemId) {
        await api.put(`/cart/items/${cartItemId}`, { quantity: qty });
        setCart((prev) =>
          prev.map((i) => (i.menuItem.id === id ? { ...i, quantity: qty } : i))
        );
      }
    } catch (error) {
      addToast('Failed to update quantity', 'error');
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete('/cart');
      setCart([]);
    } catch (error) {
      addToast('Failed to clear cart', 'error');
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Favorites State ---
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch favorites on login
  useEffect(() => {
    async function fetchFavorites() {
      if (!user) {
        setFavorites([]);
        return;
      }
      try {
        const favs = await api.get<any[]>('/favorites');
        setFavorites(favs.map(f => f.itemId));
      } catch (error) {
        console.error('Failed to fetch favorites', error);
      }
    }
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (id: string) => {
    if (!user) {
      addToast('Please login to favorite items!', 'info');
      return;
    }
    try {
      const res = await api.post<{ favorited: boolean; message: string }>(`/favorites/${id}`);
      if (res.favorited) {
        setFavorites((prev) => [...prev, id]);
        addToast('Added to favorites! ❤️', 'success');
      } else {
        setFavorites((prev) => prev.filter((favId) => favId !== id));
        addToast('Removed from favorites', 'info');
      }
    } catch (error) {
      addToast('Failed to toggle favorite', 'error');
    }
  };

  // --- Reservations State ---
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Fetch reservations on login
  useEffect(() => {
    async function fetchReservations() {
      if (!user) {
        setReservations([]);
        return;
      }
      try {
        const resList = await api.get<any[]>('/reservations');
        setReservations(
          resList.map((r: any) => ({
            id: r.id,
            name: r.guestName,
            email: r.guestEmail,
            phone: r.guestPhone || '',
            guests: r.partySize,
            date: r.reservationDate,
            time: r.startTime,
            specialRequests: r.specialRequests || '',
            status: r.status,
          }))
        );
      } catch (error) {
        console.error('Failed to load reservations', error);
      }
    }
    fetchReservations();
  }, [user]);

  const addReservation = async (res: Omit<Reservation, 'id' | 'status'>) => {
    try {
      const newRes = await api.post<any>('/reservations', {
        guestName: res.name,
        guestEmail: res.email,
        guestPhone: res.phone || null,
        partySize: res.guests,
        reservationDate: res.date,
        startTime: res.time,
        specialRequests: res.message || null,
      });

      const formatted: Reservation = {
        id: newRes.id,
        name: newRes.guestName,
        email: newRes.guestEmail,
        phone: newRes.guestPhone || '',
        guests: newRes.partySize,
        date: newRes.reservationDate,
        time: newRes.startTime,
        message: newRes.specialRequests || '',
        status: newRes.status,
      };

      setReservations((prev) => [formatted, ...prev]);
      addToast(`Table reserved successfully for ${res.guests} guests! 📅`, 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to book table. Check details.', 'error');
      throw error;
    }
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
      }, 10000);
    } else if (orderStatus === 'preparing') {
      timer = setTimeout(() => {
        setOrderStatus('delivery');
        addToast('Your order is out for delivery! 🛵💨', 'info');
      }, 12000);
    } else if (orderStatus === 'delivery') {
      timer = setTimeout(() => {
        setOrderStatus('delivered');
        addToast('Order delivered! Enjoy your cozy moments. 😊☕', 'success');
      }, 15000);
    }
    
    return () => clearTimeout(timer);
  }, [orderStatus]);

  // --- Checkout Pipeline ---
  const checkout = async (
    orderType: 'dine_in' | 'takeaway' | 'delivery',
    tableNumber?: number | null,
    addressId?: string | null,
    promoCode?: string | null
  ) => {
    if (cart.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }
    try {
      const response = await api.post<{ order: any; payment: any }>('/orders', {
        orderType,
        tableNumber: orderType === 'dine_in' ? tableNumber : null,
        deliveryAddressId: orderType === 'delivery' ? addressId : null,
        promoCode: promoCode || null,
      });

      // Set estimation time
      const now = new Date();
      now.setMinutes(now.getMinutes() + (orderType === 'delivery' ? 30 : 15));
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setEstimatedDeliveryTime(timeStr);

      // Start tracking
      setOrderStatus('confirmed');
      addToast(`Order ${response.order.orderNumber} placed successfully! 🛵`, 'success');

      // Clear cart
      setCart([]);
      setIsCartOpen(false);

      // Scroll to order tracker
      const trackerEl = document.getElementById('order-tracker');
      if (trackerEl) {
        setTimeout(() => {
          trackerEl.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    } catch (error: any) {
      addToast(error.message || 'Checkout failed', 'error');
      throw error;
    }
  };

  // --- Ambient Music State ---
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;

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
        menuItems,
        blogPosts,
        testimonials,
        galleryItems,
        specialOffers,
        dailySpecial,
        loadingContent,
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
