import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Users, Clock, Mail, Phone, User, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reservation: React.FC = () => {
  const { addReservation, addToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 2,
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (formData.guests <= 0 || formData.guests > 12) newErrors.guests = 'Guests must be between 1 and 12';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct the errors in the form.', 'error');
      return;
    }

    addReservation({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      message: formData.message,
    });

    // Reset Form
    setFormData({
      name: '',
      email: '',
      phone: '',
      guests: 2,
      date: '',
      time: '',
      message: '',
    });
  };

  // Get tomorrow's date string for HTML date picker min attribute
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <section id="reservation" className="py-24 bg-dark-espresso text-cream-beige relative">
      {/* Decorative Orbs */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-radial-glow opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Perks and Hours */}
          <div className="lg:col-span-5 space-y-8 text-left lg:sticky lg:top-28">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Book A Table
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
                Reserve Your Cozy Corner
              </h2>
              <p className="font-sans text-sm sm:text-base text-cream-beige/60">
                Planning a study session, a remote work sprint, or a warm coffee catch-up? Lock in your preferred spot today.
              </p>
            </div>

            {/* Perks List */}
            <div className="space-y-4">
              {[
                { title: 'Priority Seating', desc: 'Get the best seats in the house (window/booth) reserved just for you.' },
                { title: 'Free Welcome Espresso', desc: 'Start your visit with a complimentary single-shot espresso on us.' },
                { title: 'No Reservation Fees', desc: 'Booking is completely free with instant automated confirmation.' },
                { title: 'High-Speed Work Stations', desc: 'Secure a desk with dedicated fiber-gigabit connection and power outlets.' },
              ].map((perk, idx) => (
                <div key={idx} className="flex gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-sans font-bold text-sm text-cream-beige">{perk.title}</h4>
                    <p className="text-xs text-cream-beige/60 mt-1 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Operating Hours Note */}
            <div className="p-4 rounded-2xl border border-accent-gold/20 bg-coffee-brown/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent-gold flex-shrink-0" />
              <div className="text-xs text-cream-beige/70">
                <strong className="text-accent-gold">Note:</strong> Reservations are held for up to 15 minutes. For parties larger than 8, please contact us directly at +1 (555) 234-7890.
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Form */}
          <div className="lg:col-span-7 w-full max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-10 rounded-3xl glass-card-dark border border-accent-gold/15 shadow-2xl"
            >
              <h3 className="font-serif text-2xl font-bold text-cream-beige mb-6 text-center lg:text-left">
                Table Booking Form
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent-gold" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.name && <p className="text-[10px] text-red-400 font-medium">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-accent-gold" /> Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.email && <p className="text-[10px] text-red-400 font-medium">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 2: Phone & Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-accent-gold" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 font-medium">{errors.phone}</p>}
                  </div>

                  {/* Guests */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-accent-gold" /> Number of Guests
                    </label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-dark-espresso border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige focus:outline-none focus:border-accent-gold transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num} className="bg-dark-espresso text-cream-beige">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                    {errors.guests && <p className="text-[10px] text-red-400 font-medium">{errors.guests}</p>}
                  </div>
                </div>

                {/* Row 3: Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Date */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-accent-gold" /> Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={getMinDate()}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-cream-beige focus:outline-none focus:border-accent-gold transition-colors block ${
                        errors.date ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.date && <p className="text-[10px] text-red-400 font-medium">{errors.date}</p>}
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent-gold" /> Preferred Time
                    </label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className={`w-full bg-dark-espresso border rounded-xl px-4 py-3 text-sm text-cream-beige focus:outline-none focus:border-accent-gold transition-colors ${
                        errors.time ? 'border-red-500' : 'border-white/10'
                      }`}
                    >
                      <option value="">Select Time</option>
                      {['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM', '08:00 PM', '09:00 PM'].map((t) => (
                        <option key={t} value={t} className="bg-dark-espresso text-cream-beige">
                          {t}
                        </option>
                      ))}
                    </select>
                    {errors.time && <p className="text-[10px] text-red-400 font-medium">{errors.time}</p>}
                  </div>
                </div>

                {/* Message / Special Requests */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-cream-beige/70 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-accent-gold" /> Special Requests (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="E.g., high chair for children, window seat, celebrating an anniversary..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-accent-gold hover:bg-accent-gold/90 text-dark-espresso font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-4.5 h-4.5" /> Book My Table
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
