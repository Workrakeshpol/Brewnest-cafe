import React from 'react';
import { useApp, OrderStatus } from '../context/AppContext';
import { ClipboardCheck, ChefHat, Truck, CheckCircle2, ShoppingBag, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrackerStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const TRACKER_STEPS: TrackerStep[] = [
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'We have received your order and assigned our master barista.',
    icon: ClipboardCheck,
  },
  {
    status: 'preparing',
    label: 'Preparing',
    description: 'Your artisan coffee is being extracted and treats are fresh out of the oven.',
    icon: ChefHat,
  },
  {
    status: 'delivery',
    label: 'Out for Delivery',
    description: 'Our thermal-insulated delivery rider is speeding to your doorstep.',
    icon: Truck,
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Arrived! Thank you for choosing BrewNest. Enjoy your cozy moments!',
    icon: CheckCircle2,
  },
];

export const OrderTracker: React.FC = () => {
  const { orderStatus, estimatedDeliveryTime, setOrderStatus } = useApp();

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'delivery': return 2;
      case 'delivered': return 3;
      default: return -1;
    }
  };

  const activeIndex = getStepIndex(orderStatus);

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="order-tracker" className="py-24 bg-dark-espresso text-cream-beige relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Real-time Tracking
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream-beige">
            Live Order Tracker
          </h2>
          <p className="font-sans text-sm text-cream-beige/60">
            Trace your specialty coffee and handmade treats from our espresso bar to your cozy desk.
          </p>
        </div>

        {orderStatus === 'none' ? (
          /* Tracker Idle State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl border border-white/5 bg-white/5 text-center flex flex-col items-center max-w-xl mx-auto shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-accent-gold/10 border border-accent-gold/25 flex items-center justify-center mb-5 text-accent-gold">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">No Active Orders</h3>
            <p className="font-sans text-sm text-cream-beige/60 max-w-sm leading-relaxed mb-6">
              You don’t have any active deliveries right now. Add some delicious items to your cart and checkout to track your coffee live!
            </p>
            <button
              onClick={handleScrollToMenu}
              className="px-6 py-3 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
            >
              Order Coffee Now
            </button>
          </motion.div>
        ) : (
          /* Tracker Active State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-3xl glass-card-dark border border-accent-gold/20 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-glow opacity-30 pointer-events-none" />

            {/* Delivery Estimation Banner */}
            {orderStatus !== 'delivered' ? (
              <div className="mb-10 p-4 rounded-2xl bg-accent-gold/10 border border-accent-gold/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/15 flex items-center justify-center text-accent-gold animate-pulse">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-accent-gold/80 block">Estimated Arrival</span>
                    <span className="font-serif text-lg font-bold text-cream-beige">By {estimatedDeliveryTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Live Simulating</span>
                </div>
              </div>
            ) : (
              <div className="mb-10 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-green-400 block">Status</span>
                  <span className="font-serif text-base font-bold text-cream-beige">Delivered & Completed</span>
                </div>
              </div>
            )}

            {/* Tracker Steps Layout */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
              
              {/* Connecting Progress Line (Desktop only) */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 z-0 hidden md:block" />
              <motion.div
                className="absolute top-1/2 left-0 h-1 bg-accent-gold -translate-y-1/2 z-0 hidden md:block"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeIndex / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />

              {/* Connecting Progress Line (Mobile only - vertical) */}
              <div className="absolute top-0 bottom-0 left-6 w-1 bg-white/5 z-0 md:hidden" />
              <motion.div
                className="absolute top-0 left-6 w-1 bg-accent-gold z-0 md:hidden"
                initial={{ height: '0%' }}
                animate={{ height: `${(activeIndex / 3) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />

              {/* Steps Mapping */}
              {TRACKER_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = idx < activeIndex;
                const isActive = idx === activeIndex;
                const isUpcoming = idx > activeIndex;

                let iconClass = 'bg-dark-espresso text-cream-beige/40 border-white/5';
                if (isActive) {
                  iconClass = 'bg-accent-gold text-dark-espresso border-accent-gold shadow-lg shadow-accent-gold/30 scale-110';
                } else if (isCompleted) {
                  iconClass = 'bg-coffee-brown text-accent-gold border-accent-gold/40';
                }

                return (
                  <div
                    key={step.status}
                    className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center z-10 w-full md:w-1/4 relative"
                  >
                    {/* Icon Circle */}
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0 ${iconClass}`}
                    >
                      <StepIcon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    </div>

                    {/* Step Labels */}
                    <div className="flex-1 md:flex-none">
                      <h4
                        className={`font-sans font-bold text-sm transition-colors duration-500 ${
                          isActive ? 'text-accent-gold' : isUpcoming ? 'text-cream-beige/40' : 'text-cream-beige'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="font-sans text-[11px] text-cream-beige/50 leading-relaxed mt-1 hidden md:line-clamp-2">
                        {step.description}
                      </p>
                      <p className="font-sans text-[11px] text-cream-beige/50 leading-relaxed mt-0.5 md:hidden">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulator Control Trigger (Only visible during active simulation) */}
            <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
              <span className="text-[10px] text-cream-beige/40 font-sans uppercase tracking-widest">
                * Tracker state advances automatically
              </span>
              
              {orderStatus === 'delivered' && (
                <button
                  onClick={() => setOrderStatus('none')}
                  className="text-xs text-accent-gold hover:text-accent-gold/80 font-bold underline cursor-pointer"
                >
                  Clear Tracker
                </button>
              )}
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
};
