import React, { useState } from 'react';
import { BLOG_POSTS, BlogPostItem } from '../data/cafeData';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Clock, ArrowRight, X, User, BookOpen } from 'lucide-react';

// Complete mock content for each blog post to make it fully functional
const BLOG_CONTENTS: Record<string, { title: string; subtitle: string; content: string[] }> = {
  b1: {
    title: 'The Art of Pour Over: A Beginner’s Guide',
    subtitle: 'Extract the brightest, cleanest flavor profile from your coffee beans.',
    content: [
      'Pour-over coffee is one of the most popular manual brewing methods because of its ability to highlight subtle flavor notes, floral aromas, and clean, tea-like bodies in single-origin beans. Unlike automatic drip machines, manual pour-over gives you total control over water temperature, pouring speed, and saturation.',
      'To start, you will need a pour-over cone (like a Hario V60 or Chemex), high-quality paper filters, a scale, a gooseneck kettle, and freshly roasted coffee beans ground to a medium-coarse consistency (similar to sea salt).',
      'The golden water-to-coffee ratio is 1:16. This means for every 1 gram of coffee, you will use 16 grams of water. For a standard mug, use 15 grams of coffee and 240 grams of water. Heat your water to between 195°F and 205°F (about 30 seconds off a boil).',
      'Step 1: Wet the filter. Place your paper filter in the cone and rinse it thoroughly with hot water. This washes away any paper taste and pre-warms your brewer. Discard the rinse water.',
      'Step 2: Add coffee & bloom. Add your ground coffee to the filter and shake gently to level it. Place your setup on the scale and tare it. Pour about 40g of hot water slowly over the grounds to wet them completely. Let it sit for 30 to 45 seconds. You will see bubbles rising—this is "blooming," where carbon dioxide escapes, paving the way for optimal extraction.',
      'Step 3: The continuous pour. Pour the remaining water in slow, concentric circles, starting from the center and spiraling outward. Avoid pouring directly on the paper filter. Keep a steady pace until your scale reads 240g. Let the water drip through completely. Your total brew time should be around 2.5 to 3 minutes. Swirl, pour, and enjoy!',
    ],
  },
  b2: {
    title: 'Latte Art Secrets: Pouring the Perfect Rosetta',
    subtitle: 'Steam silky microfoam and master the wrist flick technique.',
    content: [
      'Pouring a beautiful Rosetta or heart on top of your latte is the ultimate barista skill. While it looks like magic, latte art is actually a combination of fluid dynamics, milk chemistry, and muscle memory. It all starts with the milk.',
      'The foundation of latte art is microfoam—steamed milk that is so smooth and glossy it resembles wet paint. To achieve this, fill your stainless steel pitcher with cold whole milk just below the spout. Submerge the steam wand tip slightly below the surface.',
      'Turn on the steam and immediately lower the pitcher until you hear a gentle "tss-tss" paper-tearing sound. This introduces air. Once the milk expands by about 30%, submerge the wand deeper and tilt the pitcher to create a rapid whirlpool (vortex). This breaks up large bubbles into microscopic ones. Turn off the steam when the pitcher becomes too hot to hold comfortably (about 140°F).',
      'Now, prepare your espresso with a thick, rich crema. Swirl your milk pitcher aggressively to keep the foam integrated. If there are any bubbles, tap the pitcher firmly on the counter.',
      'The Pouring Technique: Hold your coffee cup at a 45-degree angle. Start pouring the milk from high up (about 3 inches above the cup) in a thin, steady stream into the center of the espresso. This allows the milk to sink beneath the crema, establishing a dark background.',
      'Once the cup is half full, bring the pitcher spout as close to the liquid surface as possible and increase the pour rate. You will see white foam start to float. To create a Rosetta, gently shake your wrist from side to side while slowly backing the pitcher toward the top of the cup. Once you reach the top, lift the pitcher high again and pour a thin stream straight down the center line to cut through the leaves, creating the stem.',
    ],
  },
  b3: {
    title: 'Understanding Bean Origins: Ethiopia vs Colombia',
    subtitle: 'Uncover how geography, altitude, and climate shape your coffee’s flavor.',
    content: [
      'Just like fine wine, coffee is deeply influenced by its "terroir"—the unique combination of soil composition, altitude, latitude, and climate of the region where it is grown. If you have ever tasted an Ethiopian coffee side-by-side with a Colombian coffee, you know just how vastly different two cups of black coffee can be.',
      'Ethiopia: The Birthplace of Coffee. Ethiopian coffees are famous for their incredibly bright, floral, and tea-like characteristics. Because coffee grew wild in Ethiopia for centuries, the heirloom varieties offer unparalleled complexity. High elevations (above 1,800 meters) and acidic soil yield small, dense beans.',
      'When you sip a wet-processed (washed) Ethiopian coffee, expect delicate notes of jasmine, bergamot, lemongrass, and black tea. Dry-processed (natural) Ethiopian beans, on the other hand, are fruit-bombs, bursting with intense flavors of blueberry, strawberry, and sweet red wine.',
      'Colombia: The Classic Balanced Cup. Colombia is one of the world’s most prolific coffee producers, thanks to its rugged Andean peaks and volcanic soils. Colombian coffee is the gold standard for balance, body, and sweet consistency.',
      'Most Colombian coffees are washed, resulting in a clean cup with a medium-to-full body and bright, citrusy acidity. The flavor profile is dominated by sweet caramel, brown sugar, toasted nuts, red apple, and rich milk chocolate. It is incredibly versatile, making it perfect for espresso blends, pour-overs, or a cozy morning drip.',
      'Summary: Choose Ethiopia if you prefer a light, adventurous, highly aromatic cup that drinks like herbal tea. Choose Colombia if you crave a rich, comforting, sweet, and chocolatey brew that pairs beautifully with milk and desserts.',
    ],
  },
};

export const Blog: React.FC = () => {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
  };

  const handleCloseArticle = () => {
    setActiveArticleId(null);
  };

  const activeArticle = activeArticleId ? BLOG_CONTENTS[activeArticleId] : null;
  const activeMeta = activeArticleId ? BLOG_POSTS.find((b) => b.id === activeArticleId) : null;

  return (
    <section id="blog" className="py-24 bg-dark-espresso text-cream-beige relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-accent-gold text-xs font-sans font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> BrewNest Chronicles
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cream-beige leading-tight">
            Our Coffee Journal
          </h2>
          <p className="font-sans text-sm sm:text-base text-cream-beige/60">
            Dive deep into specialty coffee culture, master barista-grade brewing methods, and discover the secrets behind perfect latte art.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group rounded-3xl border border-white/5 hover:border-accent-gold/20 bg-dark-espresso/50 backdrop-blur-md overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Blog Image */}
              <div className="relative h-56 overflow-hidden bg-coffee-brown">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Category Badge */}
                <span className="absolute top-4 left-4 bg-dark-espresso/80 border border-accent-gold/20 text-accent-gold font-sans font-bold text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  {post.category}
                </span>
              </div>

              {/* Blog Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta (Date + Read Time) */}
                  <div className="flex items-center gap-3 text-xs text-cream-beige/50 font-medium mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent-gold" /> {post.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent-gold" /> {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-beige group-hover:text-accent-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-sans text-xs sm:text-sm text-cream-beige/60 leading-relaxed mt-3 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer: Author & CTA */}
                <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-cream-beige/40 font-medium flex items-center gap-1 truncate max-w-[150px]">
                    <User className="w-3 h-3 text-accent-gold" /> {post.author.split(' ')[0]}
                  </span>

                  <button
                    onClick={() => handleOpenArticle(post.id)}
                    className="text-xs font-bold font-sans uppercase tracking-wider text-accent-gold hover:text-cream-beige flex items-center gap-1 transition-colors cursor-pointer group/btn"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Full Screen Reader Modal */}
      <AnimatePresence>
        {activeArticleId && activeArticle && activeMeta && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex justify-center p-4 md:p-10">
            {/* Backdrop click close */}
            <div className="absolute inset-0" onClick={handleCloseArticle} />

            {/* Article Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative bg-dark-espresso text-cream-beige max-w-3xl w-full rounded-3xl border border-accent-gold/20 p-6 md:p-10 shadow-2xl z-10 overflow-hidden h-fit"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseArticle}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-cream-beige hover:text-accent-gold transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-accent-gold font-sans font-bold uppercase tracking-widest mb-4">
                <span className="px-2.5 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20">
                  {activeMeta.category}
                </span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeMeta.date}</span>
                <span className="text-white/20">|</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeMeta.readTime}</span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-cream-beige leading-tight mb-2">
                {activeArticle.title}
              </h2>
              <p className="font-serif text-base text-accent-gold italic mb-6">
                {activeArticle.subtitle}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 border-y border-white/5 py-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left text-xs">
                  <span className="text-cream-beige/40 font-medium block">Written by</span>
                  <span className="text-cream-beige font-semibold">{activeMeta.author}</span>
                </div>
              </div>

              {/* Article Content Paragraphs */}
              <div className="font-sans text-sm sm:text-base text-cream-beige/80 space-y-5 leading-relaxed text-left">
                {activeArticle.content.map((paragraph, index) => {
                  // Check if it's a step heading
                  if (paragraph.startsWith('Step ')) {
                    return (
                      <h4 key={index} className="font-serif text-lg font-bold text-accent-gold pt-3">
                        {paragraph}
                      </h4>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>

              {/* Footer Close Button */}
              <div className="border-t border-white/5 pt-6 mt-8 flex justify-end">
                <button
                  onClick={handleCloseArticle}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-cream-beige/80 text-xs font-semibold font-sans transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-accent-gold" /> Close Article
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
