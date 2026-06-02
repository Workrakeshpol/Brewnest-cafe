import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Coffee, Sparkles, User, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { text: 'What are your best sellers?', reply: 'Our best sellers are the Caramel Macchiato (espresso marked with vanilla and buttery caramel) and our traditional homemade Tiramisu!' },
  { text: 'What are your opening hours?', reply: 'We are open daily from 7:00 AM to 10:00 PM. On Friday and Saturday, we stay open until 11:00 PM for our Live Acoustic Nights!' },
  { text: 'Do you have vegan options?', reply: 'Yes! We offer organic almond milk, oat milk, and soy milk as dairy substitutes for any coffee. Our Sourdough Avocado Toast is also fully vegan-friendly.' },
  { text: 'How do loyalty points work?', reply: 'You earn 10 points for every $1 spent on our website! You can view and redeem your points directly in the Cart Sidebar for discounts.' },
];

export const Chatbot: React.FC = () => {
  const { addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      text: "Hello! I am Nestly, your BrewNest virtual barista. How can I help you satisfy your coffee cravings today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Bot Response
    setTimeout(() => {
      let botReply = "I am not quite sure about that, but our baristas at the cafe would love to help! You can call us at +1 (555) 234-7890 or visit us at 128 Aesthetic Blvd.";
      
      const cleanText = text.toLowerCase();
      if (cleanText.includes('best seller') || cleanText.includes('popular') || cleanText.includes('recommend')) {
        botReply = "Our top recommendation is the Caramel Macchiato paired with our traditional Tiramisu! Customers also rave about the Matcha Cold Brew.";
      } else if (cleanText.includes('hour') || cleanText.includes('open') || cleanText.includes('close') || cleanText.includes('time')) {
        botReply = "We are open daily from 7:00 AM to 10:00 PM. On Friday and Saturday, we stay open until 11:00 PM for our Live Acoustic Nights!";
      } else if (cleanText.includes('vegan') || cleanText.includes('milk') || cleanText.includes('dairy')) {
        botReply = "Absolutely! We offer organic almond milk, oat milk, and soy milk as dairy alternatives. Our Avocado Toast is also 100% vegan.";
      } else if (cleanText.includes('loyalty') || cleanText.includes('point') || cleanText.includes('reward')) {
        botReply = "You earn 10 points for every $1 spent! Redeem points in your Cart Drawer for free items: 100 points gets you a free shot, 200 points gets you a free Cold Brew!";
      } else if (cleanText.includes('reserve') || cleanText.includes('book') || cleanText.includes('table')) {
        botReply = "You can book a table directly in our 'Reservation' section below! Just enter your details and it will be confirmed instantly.";
      } else if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('hey')) {
        botReply = "Hello there! Hope you are having a wonderful day. What coffee or dessert are you in the mood for?";
      }

      const botMsg: Message = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (q: typeof QUICK_QUESTIONS[0]) => {
    // Add User Message
    const userMsg: Message = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      text: q.text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        text: q.reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-5 left-5 z-45 font-sans">
      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            addToast('Nestly is online! ☕🤖', 'info');
          }
        }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-accent-gold text-dark-espresso hover:bg-accent-gold/90 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="absolute bottom-18 left-0 w-[350px] sm:w-[380px] h-[500px] rounded-3xl border border-accent-gold/20 bg-dark-espresso/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-accent-gold/10 bg-coffee-brown/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-accent-gold animate-bounce" />
                </div>
                <div>
                  <h4 className="font-bold text-cream-beige text-sm flex items-center gap-1">
                    Nestly <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                  </h4>
                  <p className="text-[11px] text-accent-gold/80 font-medium">BrewNest Virtual Barista</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      msg.sender === 'user' 
                        ? 'bg-accent-gold text-dark-espresso' 
                        : 'bg-coffee-brown text-accent-gold border border-accent-gold/20'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-accent-gold text-dark-espresso font-medium rounded-tr-none'
                          : 'bg-white/5 border border-white/5 text-cream-beige/90 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                      <span className="block text-[9px] mt-1 text-right opacity-60">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <div className="w-7 h-7 rounded-full bg-coffee-brown text-accent-gold border border-accent-gold/20 flex items-center justify-center text-xs flex-shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 text-cream-beige/90 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 border-t border-accent-gold/5 bg-black/10">
                <p className="text-[10px] text-accent-gold/60 uppercase font-bold tracking-wider mb-1.5">Quick Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-[10px] font-medium font-sans px-2.5 py-1.5 rounded-lg border border-accent-gold/10 hover:border-accent-gold bg-dark-espresso hover:bg-accent-gold/5 text-cream-beige/80 hover:text-accent-gold transition-all text-left"
                    >
                      {q.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 border-t border-accent-gold/10 bg-coffee-brown/20 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-cream-beige placeholder-cream-beige/30 focus:outline-none focus:border-accent-gold transition-colors"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-accent-gold text-dark-espresso hover:bg-accent-gold/90 transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
