/**
 * Central schema barrel file — re-exports all Drizzle ORM table definitions
 * and their inferred TypeScript types. This is the single entry point for
 * Drizzle configuration and query builders.
 */

// Users
export { usersTable } from './users';
export type { User, NewUser } from './users';

// Menu
export {
  categoriesTable,
  menuItemsTable,
  itemVariantsTable,
  itemTagsTable,
} from './menu';
export type {
  Category,
  NewCategory,
  MenuItem,
  NewMenuItem,
  ItemVariant,
  NewItemVariant,
  ItemTag,
  NewItemTag,
} from './menu';

// Addresses
export { addressesTable } from './addresses';
export type { Address, NewAddress } from './addresses';

// Orders
export { ordersTable, orderItemsTable, paymentsTable } from './orders';
export type {
  Order,
  NewOrder,
  OrderItem,
  NewOrderItem,
  Payment,
  NewPayment,
} from './orders';

// Reservations
export { cafeTablesTable, reservationsTable } from './reservations';
export type {
  CafeTable,
  NewCafeTable,
  Reservation,
  NewReservation,
} from './reservations';

// Loyalty
export {
  loyaltyTiersTable,
  loyaltyAccountsTable,
  loyaltyTransactionsTable,
} from './loyalty';
export type {
  LoyaltyTier,
  NewLoyaltyTier,
  LoyaltyAccount,
  NewLoyaltyAccount,
  LoyaltyTransaction,
  NewLoyaltyTransaction,
} from './loyalty';

// Promos
export { promoCodesTable, promoUsageTable } from './promos';
export type {
  PromoCode,
  NewPromoCode,
  PromoUsage,
  NewPromoUsage,
} from './promos';

// Interactions
export { favoritesTable, reviewsTable } from './interactions';
export type {
  Favorite,
  NewFavorite,
  Review,
  NewReview,
} from './interactions';

// Content
export {
  blogPostsTable,
  galleryImagesTable,
  testimonialsTable,
  specialOffersTable,
  dailySpecialsTable,
} from './content';
export type {
  BlogPost,
  NewBlogPost,
  GalleryImage,
  NewGalleryImage,
  Testimonial,
  NewTestimonial,
  SpecialOffer,
  NewSpecialOffer,
  DailySpecial,
  NewDailySpecial,
} from './content';

// Communication
export { contactMessagesTable, newsletterSubscribersTable } from './communication';
export type {
  ContactMessage,
  NewContactMessage,
  NewsletterSubscriber,
  NewNewsletterSubscriber,
} from './communication';

// Settings
export { siteSettingsTable } from './settings';
export type { SiteSetting, NewSiteSetting } from './settings';

// Referrals
export { referralsTable } from './referrals';
export type { Referral, NewReferral } from './referrals';

// Cart
export { cartsTable, cartItemsTable } from './cart';
export type { Cart, NewCart, CartItem, NewCartItem } from './cart';
