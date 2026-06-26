import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Menu } from './components/Menu';
import { WhyChooseUs } from './components/WhyChooseUs';
import { About } from './components/About';
import { Gallery } from './components/Gallery';
import { Testimonials } from './components/Testimonials';
import { Reservation } from './components/Reservation';
import { OrderTracker } from './components/OrderTracker';
import { SpecialOffers } from './components/SpecialOffers';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Chatbot } from './components/Chatbot';
import { DailySpecialModal } from './components/DailySpecialModal';
import { MusicPlayer } from './components/MusicPlayer';
import { CursorGlow } from './components/CursorGlow';
import { ParticlesBg } from './components/ParticlesBg';
import { ToastContainer } from './components/Toast';

const AppContent: React.FC = () => {
  const { darkMode } = useApp();

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      darkMode 
        ? 'bg-dark-espresso text-cream-beige' 
        : 'bg-cream-beige text-dark-espresso'
    }`}>
      {/* Premium Ambient Visual Layers */}
      <CursorGlow />
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticlesBg />
      </div>

      {/* Header / Sticky Navigation */}
      <Navbar />

      {/* Main Page Layout Sections */}
      <main className="relative z-10">
        <Hero />
        <Menu />
        <WhyChooseUs />
        <About />
        <Gallery />
        <Testimonials />
        <Reservation />
        <OrderTracker />
        <SpecialOffers />
        <Blog />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlay Drawers & Interactive Modals */}
      <CartDrawer />
      <Chatbot />
      <DailySpecialModal />
      <MusicPlayer />
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
