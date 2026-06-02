import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-dark-espresso/90 border-accent-gold';
          let icon = <CheckCircle className="text-accent-gold w-5 h-5 flex-shrink-0" />;
          
          if (toast.type === 'error') {
            bgColor = 'bg-red-950/90 border-red-500';
            icon = <AlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />;
          } else if (toast.type === 'info') {
            bgColor = 'bg-coffee-brown/90 border-latte-gold';
            icon = <Info className="text-latte-gold w-5 h-5 flex-shrink-0" />;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-2xl backdrop-blur-md ${bgColor} text-cream-beige`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-sm font-sans font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 p-1 rounded-full hover:bg-white/10 text-cream-beige/60 hover:text-cream-beige transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
