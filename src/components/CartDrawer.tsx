import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, Plus, Minus, Trash2, Award, Sparkles, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    cartTotal,
    cartCount,
    checkout,
  } = useApp();

  const { user } = useAuth();
  const loyaltyPoints = user?.loyalty?.availablePoints || 0;

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dine_in'>('delivery');
  const [tableNumber, setTableNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleRedeemPoints = () => {
    if (loyaltyPoints >= 100) {
      setPointsRedeemed(100);
      setDiscountAmount(5.00); // 100 points = $5.00 off
    }
  };

  const handleCancelRedemption = () => {
    setPointsRedeemed(0);
    setDiscountAmount(0);
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleProceedToPayment = () => {
    if (cart.length === 0) return;
    setCheckoutStep('payment');
  };

  const handleConfirmPayment = () => {
    checkout(
      orderType,
      orderType === 'dine_in' ? parseInt(tableNumber) || null : null,
      null,
      pointsRedeemed > 0 ? 'BREWBOGO' : null
    );
    // Reset state for next time
    setCheckoutStep('cart');
    setPointsRedeemed(0);
    setDiscountAmount(0);
    setTableNumber('');
    setSpecialInstructions('');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep('cart');
            }}
            className="absolute inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-dark-espresso text-cream-beige border-l border-accent-gold/10 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-accent-gold/10 flex items-center justify-between bg-coffee-brown/10">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-accent-gold" />
                  <h2 className="font-serif text-xl font-bold">Your BrewNest Cart</h2>
                  <span className="bg-accent-gold/15 text-accent-gold font-sans font-bold text-xs px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('cart');
                  }}
                  className="p-1.5 rounded-full hover:bg-white/5 text-cream-beige/60 hover:text-cream-beige transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {checkoutStep === 'cart' ? (
                <>
                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                        <div className="w-16 h-16 rounded-full bg-accent-gold/5 border border-accent-gold/10 flex items-center justify-center mb-4">
                          <ShoppingBag className="w-8 h-8 text-accent-gold/50" />
                        </div>
                        <h3 className="font-serif text-lg font-bold mb-1">Your cart is empty</h3>
                        <p className="text-sm text-cream-beige/50 max-w-xs">
                          Freshly brewed coffee is just a few clicks away. Explore our artisan menu!
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="mt-6 px-5 py-2.5 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-semibold text-sm transition-colors"
                        >
                          Explore Menu
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.menuItem.id}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-accent-gold/10 transition-all group"
                        >
                          {/* Item Image */}
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                          />

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans font-semibold text-sm text-cream-beige truncate">
                              {item.menuItem.name}
                            </h4>
                            <p className="text-xs text-accent-gold font-medium mt-0.5">
                              ${item.menuItem.price.toFixed(2)} each
                            </p>
                            
                            {/* Quantity Adjuster */}
                            <div className="flex items-center gap-2.5 mt-2">
                              <button
                                onClick={() => updateCartQty(item.menuItem.id, item.quantity - 1)}
                                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-cream-beige/80 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-sans font-semibold text-xs text-cream-beige w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQty(item.menuItem.id, item.quantity + 1)}
                                className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-cream-beige/80 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex flex-col items-end justify-between self-stretch">
                            <span className="font-serif font-bold text-sm text-cream-beige">
                              ${(item.menuItem.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="p-1.5 rounded-lg text-cream-beige/40 hover:text-red-400 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-accent-gold/10 p-6 space-y-4 bg-coffee-brown/5">
                      {/* Loyalty Rewards Card */}
                      <div className="p-4 rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-coffee-brown/30 to-dark-espresso relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-radial-glow opacity-30 pointer-events-none" />
                        <div className="flex items-start justify-between">
                          <div className="flex gap-2.5">
                            <Award className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-sans font-bold text-sm text-cream-beige flex items-center gap-1">
                                BrewNest Rewards <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                              </h4>
                              <p className="text-xs text-cream-beige/60 mt-0.5">
                                You have <strong className="text-accent-gold">{loyaltyPoints}</strong> points
                              </p>
                            </div>
                          </div>
                          
                          {pointsRedeemed > 0 ? (
                            <button
                              onClick={handleCancelRedemption}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
                            >
                              Cancel
                            </button>
                          ) : (
                            loyaltyPoints >= 100 && (
                              <button
                                onClick={handleRedeemPoints}
                                className="text-xs text-accent-gold hover:text-accent-gold/80 font-bold bg-accent-gold/10 border border-accent-gold/30 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Redeem $5.00
                              </button>
                            )
                          )}
                        </div>
                        {pointsRedeemed > 0 ? (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400 font-sans font-medium">
                            <CheckCircle className="w-4 h-4" /> 100 points redeemed! -$5.00 applied.
                          </div>
                        ) : (
                          <p className="text-[10px] text-cream-beige/40 mt-3">
                            * Redeem 100 points to save $5.00. Earn 10 points for every $1 spent!
                          </p>
                        )}
                      </div>
                      
                      {/* Order Type Selector */}
                      <div className="p-4 rounded-2xl border border-white/5 bg-white/5 space-y-3 text-left">
                        <label className="text-[10px] uppercase font-sans font-bold tracking-wider text-cream-beige/40 block">Order Option</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['delivery', 'takeaway', 'dine_in'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setOrderType(type)}
                              className={`py-2 rounded-xl border font-bold text-xs capitalize transition-colors ${
                                orderType === type
                                  ? 'bg-accent-gold border-accent-gold text-dark-espresso'
                                  : 'bg-white/5 border-white/10 text-cream-beige/80 hover:text-cream-beige hover:bg-white/10'
                              }`}
                            >
                              {type.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                        
                        {orderType === 'dine_in' && (
                          <div className="mt-2">
                            <input
                              type="number"
                              placeholder="Table Number (e.g. 5)"
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                            />
                          </div>
                        )}
                        
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Special instructions (optional)"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cream-beige placeholder-cream-beige/25 text-sm focus:outline-none focus:border-accent-gold/50"
                          />
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      <div className="space-y-2 text-sm font-sans">
                        <div className="flex justify-between text-cream-beige/60">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Loyalty Rewards Discount</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-cream-beige/60">
                          <span>Estimated Delivery Fee</span>
                          <span className="text-green-400 font-medium">FREE</span>
                        </div>
                        <div className="border-t border-white/5 pt-3 flex justify-between items-baseline">
                          <span className="font-serif font-bold text-base text-cream-beige">Total</span>
                          <span className="font-serif font-bold text-2xl text-accent-gold">
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <button
                        onClick={handleProceedToPayment}
                        className="w-full py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-95"
                      >
                        <CreditCard className="w-4.5 h-4.5" /> Proceed to Checkout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Payment Step with QR Mockup */
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="self-start flex items-center gap-1.5 text-xs text-accent-gold font-semibold mb-6 hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                  </button>

                  <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <h3 className="font-serif text-xl font-bold text-cream-beige mb-1">
                      Scan to Pay
                    </h3>
                    <p className="text-xs text-cream-beige/60 mb-6">
                      Scan the QR code below using any UPI app, Google Pay, Apple Pay, or credit card wallet to complete your transaction.
                    </p>

                    {/* QR Code SVG */}
                    <div className="p-4 bg-white rounded-2xl shadow-xl mb-6 relative group border-2 border-accent-gold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 100"
                        className="w-48 h-48"
                      >
                        {/* Outer Borders */}
                        <path d="M0,0 L25,0 M0,0 L0,25" stroke="#1E1A18" stroke-width="8" fill="none" />
                        <path d="M75,0 L100,0 M100,0 L100,25" stroke="#1E1A18" stroke-width="8" fill="none" />
                        <path d="M0,75 L0,100 M0,100 L25,100" stroke="#1E1A18" stroke-width="8" fill="none" />
                        <path d="M75,100 L100,100 M100,100 L100,75" stroke="#1E1A18" stroke-width="8" fill="none" />
                        
                        {/* Finder Patterns */}
                        <rect x="10" y="10" width="25" height="25" fill="#1E1A18" />
                        <rect x="15" y="15" width="15" height="15" fill="#FFFFFF" />
                        <rect x="18" y="18" width="9" height="9" fill="#C89B3C" />

                        <rect x="65" y="10" width="25" height="25" fill="#1E1A18" />
                        <rect x="70" y="15" width="15" height="15" fill="#FFFFFF" />
                        <rect x="73" y="18" width="9" height="9" fill="#C89B3C" />

                        <rect x="10" y="65" width="25" height="25" fill="#1E1A18" />
                        <rect x="15" y="70" width="15" height="15" fill="#FFFFFF" />
                        <rect x="18" y="73" width="9" height="9" fill="#C89B3C" />

                        {/* Random QR code pixels */}
                        <rect x="42" y="12" width="6" height="6" fill="#1E1A18" />
                        <rect x="52" y="18" width="6" height="6" fill="#C89B3C" />
                        <rect x="45" y="28" width="6" height="6" fill="#1E1A18" />
                        <rect x="12" y="45" width="6" height="6" fill="#C89B3C" />
                        <rect x="25" y="52" width="6" height="6" fill="#1E1A18" />
                        
                        <rect x="45" y="45" width="10" height="10" fill="#1E1A18" />
                        <rect x="48" y="48" width="4" height="4" fill="#FFFFFF" />

                        <rect x="65" y="45" width="6" height="6" fill="#C89B3C" />
                        <rect x="78" y="52" width="6" height="6" fill="#1E1A18" />
                        <rect x="85" y="42" width="6" height="6" fill="#1E1A18" />

                        <rect x="42" y="65" width="6" height="6" fill="#C89B3C" />
                        <rect x="52" y="75" width="6" height="6" fill="#1E1A18" />
                        <rect x="48" y="85" width="6" height="6" fill="#C89B3C" />
                        <rect x="68" y="75" width="12" height="6" fill="#1E1A18" />
                        <rect x="75" y="65" width="6" height="12" fill="#1E1A18" />
                        <rect x="85" y="80" width="6" height="6" fill="#C89B3C" />
                      </svg>
                      {/* Floating Cup logo in center */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-xl shadow-md border border-accent-gold/20">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-6 h-6">
                          <path d="M30,40 C30,35 70,35 70,40 L65,75 C65,80 35,80 35,75 Z" fill="#4B2E2B" stroke="#C89B3C" stroke-width="4"/>
                          <path d="M66,45 C73,45 76,52 72,58 C68,62 64,60 64,60" fill="none" stroke="#C89B3C" stroke-width="4"/>
                        </svg>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 w-full mb-6 text-sm">
                      <div className="flex justify-between font-medium text-cream-beige/70">
                        <span>Paying to:</span>
                        <span className="text-cream-beige font-semibold">BrewNest Café Ltd.</span>
                      </div>
                      <div className="flex justify-between font-medium text-cream-beige/70 mt-1.5">
                        <span>Amount Due:</span>
                        <span className="text-accent-gold font-bold">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-3 w-full">
                      <button
                        onClick={handleConfirmPayment}
                        className="w-full py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-bold text-sm uppercase tracking-wider shadow-lg transition-transform hover:scale-[1.01] active:scale-95"
                      >
                        Simulate Payment Success
                      </button>
                      <button
                        onClick={() => setCheckoutStep('cart')}
                        className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-cream-beige/80 text-xs font-semibold font-sans transition-colors"
                      >
                        Cancel Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
