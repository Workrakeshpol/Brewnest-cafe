export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Coffee' | 'Cold Brew' | 'Desserts' | 'Breakfast' | 'Signature Drinks';
  price: number;
  rating: number;
  image: string;
  tags: string[];
  isSignature?: boolean;
  isPopular?: boolean;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: string;
  title: string;
  spanClass: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  category: string;
}

export interface SpecialOfferItem {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiryHours: number;
  bgType: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Hazelnut Cappuccino',
    description: 'Double shot of rich espresso with steamed microfoam infused with roasted hazelnut syrup and cocoa dusting.',
    category: 'Coffee',
    price: 4.75,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    tags: ['Hot', 'Nutty', 'Espresso'],
    isPopular: true
  },
  {
    id: 'm2',
    name: 'Caramel Macchiato',
    description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and drizzled with decadent buttery caramel.',
    category: 'Coffee',
    price: 4.95,
    rating: 4.9,
    image: '/images/latte-art.jpg',
    tags: ['Hot', 'Sweet', 'Best Seller'],
    isSignature: true
  },
  {
    id: 'm3',
    name: 'Mocha Frappe',
    description: 'Rich chocolate sauce, espresso, and milk blended with ice, topped with whipped cream and chocolate drizzle.',
    category: 'Signature Drinks',
    price: 5.50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    tags: ['Cold', 'Chocolate', 'Blended'],
    isPopular: true
  },
  {
    id: 'm4',
    name: 'Matcha Cold Brew',
    description: 'Ceremonial grade Japanese matcha layered elegantly over slow-steeped cold brew coffee with a hint of vanilla.',
    category: 'Cold Brew',
    price: 5.25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
    tags: ['Cold', 'Matcha', 'Layered'],
    isSignature: true
  },
  {
    id: 'm5',
    name: 'BrewNest Signature Cold Brew',
    description: 'Single-origin Ethiopian beans cold-steeped for 18 hours, infused with a touch of sweet orange zest and nitrogen charge.',
    category: 'Cold Brew',
    price: 4.50,
    rating: 4.8,
    image: '/images/cold-brew.jpg',
    tags: ['Cold', 'Organic', '18hr Steep'],
    isPopular: true
  },
  {
    id: 'm6',
    name: 'Classic Espresso Romano',
    description: 'A concentrated shot of espresso served with a slice of lemon to highlight the bright, floral notes of the blend.',
    category: 'Coffee',
    price: 3.25,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1510707513156-46c49f16b6c1?auto=format&fit=crop&q=80&w=600',
    tags: ['Hot', 'Strong', 'Classic']
  },
  {
    id: 'm7',
    name: 'Traditional Tiramisu',
    description: 'Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with premium dark cocoa powder.',
    category: 'Desserts',
    price: 6.50,
    rating: 4.95,
    image: '/images/tiramisu.jpg',
    tags: ['Sweet', 'House Special'],
    isSignature: true
  },
  {
    id: 'm8',
    name: 'Korean Garlic Cheese Bread',
    description: 'Sweet and savory pull-apart bread soaked in garlic butter and stuffed with a rich, sweetened cream cheese filling.',
    category: 'Breakfast',
    price: 5.95,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
    tags: ['Savory', 'Cheese', 'Warm'],
    isPopular: true
  },
  {
    id: 'm9',
    name: 'Sourdough Avocado Toast',
    description: 'Freshly mashed avocado on toasted artisanal sourdough, topped with cherry tomatoes, feta cheese, and microgreens.',
    category: 'Breakfast',
    price: 7.25,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
    tags: ['Healthy', 'Sourdough', 'Fresh']
  },
  {
    id: 'm10',
    name: 'Velvet Rose Latte',
    description: 'A delicate floral latte made with organic rose water syrup, beetroot powder for a pastel pink hue, and edible rose petals.',
    category: 'Signature Drinks',
    price: 5.25,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600',
    tags: ['Hot', 'Floral', 'Aesthetic'],
    isSignature: true
  },
  {
    id: 'm11',
    name: 'Almond Croissant',
    description: 'Flaky, double-baked French butter croissant filled with sweet almond frangipane and topped with toasted sliced almonds.',
    category: 'Breakfast',
    price: 4.25,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    tags: ['Sweet', 'Flaky', 'Baked']
  },
  {
    id: 'm12',
    name: 'Dark Chocolate Lava Cake',
    description: 'Warm, decadent chocolate cake with a molten liquid center, served with a scoop of Madagascar vanilla bean gelato.',
    category: 'Desserts',
    price: 6.95,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    tags: ['Hot', 'Chocolate', 'Gelato']
  }
];

export const WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    id: 'w1',
    title: '100% Organic Beans',
    description: 'Sourced directly from ethically managed micro-lot farms in Ethiopia, Colombia, and Sumatra.',
    iconName: 'Leaf'
  },
  {
    id: 'w2',
    title: 'Expert Baristas',
    description: 'Our baristas are certified coffee sommeliers, trained in precise extraction and sensory analysis.',
    iconName: 'Award'
  },
  {
    id: 'w3',
    title: 'Cozy Aesthetic Interior',
    description: 'Inspired by Japanese minimalism and Korean cafe culture. Perfect for deep focus or warm chats.',
    iconName: 'Coffee'
  },
  {
    id: 'w4',
    title: 'Gigabit Free WiFi',
    description: 'High-speed fiber internet and power outlets at every seat, designed for modern remote professionals.',
    iconName: 'Wifi'
  },
  {
    id: 'w5',
    title: 'Express Delivery',
    description: 'Our custom thermal packaging ensures your coffee arrives hot and your cold brews remain chilled.',
    iconName: 'Truck'
  },
  {
    id: 'w6',
    title: 'Live Acoustic Nights',
    description: 'Unwind every Friday and Saturday evening with local indie artists performing unplugged sessions.',
    iconName: 'Music'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    image: '/images/cafe-interior.jpg',
    category: 'Interior',
    title: 'Cozy Workspace Corner',
    spanClass: 'md:col-span-2 md:row-span-2'
  },
  {
    id: 'g2',
    image: '/images/latte-art.jpg',
    category: 'Latte Art',
    title: 'Perfect Heart Crema',
    spanClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g3',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
    category: 'Interior',
    title: 'Brewing Bar Counter',
    spanClass: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 'g4',
    image: '/images/tiramisu.jpg',
    category: 'Desserts',
    title: 'Indulgent Tiramisu',
    spanClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g5',
    image: '/images/cold-brew.jpg',
    category: 'Coffee Cups',
    title: 'Iced Nitrogen Cold Brew',
    spanClass: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'g6',
    image: '/images/barista.jpg',
    category: 'Workspace',
    title: 'The Craft of Pour Over',
    spanClass: 'md:col-span-2 md:row-span-1'
  }
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Sophia Chen',
    role: 'Product Designer',
    rating: 5,
    comment: 'BrewNest has become my second home. The Japanese-inspired minimalist decor, super fast WiFi, and the Caramel Macchiato keep me productive for hours! Highly recommend.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't2',
    name: 'Marcus Sterling',
    role: 'Coffee Connoisseur',
    rating: 5,
    comment: 'Their 18-hour Ethiopia Cold Brew is spectacular. You can taste the bright notes of lemon and floral undertones. The baristas really know their craft and explain bean origins so passionately.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't3',
    name: 'Yuki Tanaka',
    role: 'Freelance Writer',
    rating: 5,
    comment: 'As a fan of Tokyo cafes, I was amazed by BrewNest. The Matcha Cold Brew is layered beautifully and isn’t overly sweet. It is the perfect peaceful sanctuary in the middle of a busy city.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 't4',
    name: 'David Miller',
    role: 'Software Engineer',
    rating: 4.8,
    comment: 'The loyalty program is awesome. I earned enough points for a free Tiramisu in just a couple of visits. Plus, the Live Acoustic Nights on Friday are the absolute best way to decompress after coding.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  }
];

export const BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'b1',
    title: 'The Art of Pour Over: A Beginner’s Guide',
    excerpt: 'Master the water-to-coffee ratio, temperature control, and circular pouring techniques to extract the brightest, cleanest flavor profile from single-origin beans.',
    date: 'May 18, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    author: 'Elena Rostova (Head Barista)',
    category: 'Brewing Techniques'
  },
  {
    id: 'b2',
    title: 'Latte Art Secrets: Pouring the Perfect Rosetta',
    excerpt: 'It’s all about the microfoam. Learn the science of milk steaming and the wrist flick technique required to create breathtaking, Instagram-worthy milk art patterns.',
    date: 'May 10, 2025',
    readTime: '4 min read',
    image: '/images/latte-art.jpg',
    author: 'Kenji Sato (Latte Artist)',
    category: 'Latte Art Secrets'
  },
  {
    id: 'b3',
    title: 'Understanding Bean Origins: Ethiopia vs Colombia',
    excerpt: 'Uncover how altitude, soil composition, and processing methods create the fruity, tea-like notes of African beans versus the rich, chocolatey, nutty body of South American beans.',
    date: 'April 28, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600',
    author: 'Marcus Sterling (Coffee Sourcing)',
    category: 'Coffee Beans Guide'
  }
];

export const SPECIAL_OFFERS: SpecialOfferItem[] = [
  {
    id: 'o1',
    title: 'BOGO Cold Brew',
    description: 'Buy 1 Get 1 Free on all Signature Nitro Cold Brews. Perfect for a hot afternoon with a friend!',
    discount: 'Buy 1 Get 1',
    code: 'BREWBOGO',
    expiryHours: 6,
    bgType: 'gold'
  },
  {
    id: 'o2',
    title: 'Student Fuel Discount',
    description: 'Show your student ID at checkout or use the online promo code to get 20% off your entire order.',
    discount: '20% OFF',
    code: 'STUDENT20',
    expiryHours: 12,
    bgType: 'brown'
  },
  {
    id: 'o3',
    title: 'Weekend Sweet Combo',
    description: 'Order any signature coffee and get our traditional homemade Tiramisu at half price this Saturday & Sunday.',
    discount: '50% Off Tiramisu',
    code: 'SWEETWEEKEND',
    expiryHours: 36,
    bgType: 'espresso'
  }
];
