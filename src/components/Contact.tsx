import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { Mail, Phone, MapPin, Send, MessageCircle, Sparkles, Facebook, Instagram, Twitter, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      });
      addToast('Thank you! Your message has been sent successfully. ✉️', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      addToast(error.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-dark-espresso text-cream-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Contact & Location
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Have questions about our beans, catering services, or want to host a private event? Reach out or stop by!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Contact Details + Stylized Map */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8 text-left">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-cream-beige">
                Visit BrewNest Café
              </h3>
              
              <div className="space-y-4">
                {/* Map Pin */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-cream-beige">Our Address</h4>
                    <p className="text-xs sm:text-sm text-cream-beige/70 mt-0.5">128 Aesthetic Boulevard, Suite A, Coffee District, CA 90210</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-cream-beige">Email Us</h4>
                    <p className="text-xs sm:text-sm text-cream-beige/70 mt-0.5">hello@brewnestcafe.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-cream-beige">Call Us</h4>
                    <p className="text-xs sm:text-sm text-cream-beige/70 mt-0.5">+1 (555) 234-7890</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stylized Vector Map Placeholder */}
            <div className="relative rounded-3xl border border-accent-gold/15 bg-dark-espresso/40 h-64 overflow-hidden shadow-inner group">
              {/* SVG Map grid */}
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1E1A18" />
                {/* Roads */}
                <line x1="0" y1="50" x2="100%" y2="50" stroke="#4B2E2B" stroke-width="8" />
                <line x1="0" y1="180" x2="100%" y2="180" stroke="#4B2E2B" stroke-width="12" />
                <line x1="80" y1="0" x2="80" y2="100%" stroke="#4B2E2B" stroke-width="10" />
                <line x1="220" y1="0" x2="220" y2="100%" stroke="#4B2E2B" stroke-width="6" />
                <line x1="0" y1="100" x2="100%" y2="240" stroke="#4B2E2B" stroke-width="4" />
                
                {/* River / Park */}
                <path d="M-20,220 Q100,200 150,260 T350,220" fill="none" stroke="#D9B99B" stroke-width="16" opacity="0.15" />
                <rect x="250" y="20" width="120" height="80" rx="10" fill="#4B2E2B" opacity="0.3" />
              </svg>

              {/* Pulsing Pin Marker */}
              <div className="absolute top-[120px] left-[160px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Ripple rings */}
                <span className="absolute w-12 h-12 bg-accent-gold/30 rounded-full animate-ping"></span>
                <span className="absolute w-6 h-6 bg-accent-gold/40 rounded-full animate-pulse"></span>
                
                <div className="w-8 h-8 rounded-full bg-accent-gold border border-dark-espresso flex items-center justify-center text-dark-espresso shadow-lg z-10">
                  <Compass className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                
                <span className="bg-dark-espresso/90 border border-accent-gold/30 text-accent-gold font-sans font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md mt-1.5 whitespace-nowrap">
                  BrewNest Café
                </span>
              </div>

              {/* Map Info overlay */}
              <div className="absolute bottom-3 right-3 bg-dark-espresso/80 border border-white/5 text-cream-beige/60 text-[9px] font-sans px-2.5 py-1 rounded-md">
                Map View • Coffee District
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-10 rounded-3xl glass-card-dark border border-accent-gold/15 shadow-2xl h-full flex flex-col justify-center"
            >
              <h3 className="font-serif text-2xl font-bold text-cream-beige mb-6 text-center lg:text-left">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="E.g., Event inquiry, feedback, partnerships..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your message here..."
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4.5 h-4.5" />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Pulsing Floating WhatsApp Button */}
      <a
        href="https://wa.me/15552347890?text=Hi%20BrewNest!%20I'd%20like%20to%20inquire%20about%20your%20coffees%20and%20reservations."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-45 w-14 h-14 rounded-full bg-[#25D366] text-white hover:bg-[#20BA56] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        title="Chat with us on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping group-hover:scale-110"></span>
        <MessageCircle className="w-7 h-7 relative z-10" />
      </a>
    </section>
  );
};
