import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';

async function seed() {
  console.log('🌱 Seeding BrewNest database...\n');

  try {
    // ──────────────────────────────────────────────
    // 0. CLEANUP EXISTING DATA
    // ──────────────────────────────────────────────
    console.log('🧹 Cleaning up existing data...');
    
    // Delete in reverse order of foreign key dependencies
    await prisma.loyaltyTransaction.deleteMany();
    await prisma.loyaltyAccount.deleteMany();
    await prisma.loyaltyTier.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.promoUsage.deleteMany();
    await prisma.specialOffer.deleteMany();
    await prisma.promoCode.deleteMany();
    await prisma.dailySpecial.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.address.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.cafeTable.deleteMany();
    await prisma.blogPost.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.newsletterSubscriber.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.itemTag.deleteMany();
    await prisma.itemVariant.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleanup complete.');

    // ──────────────────────────────────────────────
    // 1. ADMIN USER & DEMO USERS
    // ──────────────────────────────────────────────
    console.log('👤 Creating users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
    await prisma.user.create({
      data: {
        email: 'admin@brewnest.com',
        passwordHash: adminPasswordHash,
        firstName: 'BrewNest',
        lastName: 'Admin',
        role: 'admin',
        emailVerified: true,
        isActive: true,
      },
    });

    // Demo customer
    const customerPasswordHash = await bcrypt.hash('Customer@123', 12);
    const demoCustomer = await prisma.user.create({
      data: {
        email: 'customer@brewnest.com',
        passwordHash: customerPasswordHash,
        firstName: 'Sophia',
        lastName: 'Chen',
        phone: '+1 (555) 234-7890',
        role: 'customer',
        emailVerified: true,
        isActive: true,
      },
    });

    // Demo staff
    const staffPasswordHash = await bcrypt.hash('Staff@123', 12);
    const demoStaff = await prisma.user.create({
      data: {
        email: 'staff@brewnest.com',
        passwordHash: staffPasswordHash,
        firstName: 'Elena',
        lastName: 'Rostova',
        role: 'staff',
        emailVerified: true,
        isActive: true,
      },
    });

    // ──────────────────────────────────────────────
    // 2. CATEGORIES
    // ──────────────────────────────────────────────
    console.log('📂 Creating categories...');
    const categoryData = [
      { name: 'Coffee', slug: 'coffee', description: 'Hot espresso-based beverages', sortOrder: 1 },
      { name: 'Cold Brew', slug: 'cold-brew', description: 'Cold steeped and iced coffee drinks', sortOrder: 2 },
      { name: 'Signature Drinks', slug: 'signature-drinks', description: 'BrewNest exclusive creations', sortOrder: 3 },
      { name: 'Breakfast', slug: 'breakfast', description: 'Fresh morning bites and pastries', sortOrder: 4 },
      { name: 'Desserts', slug: 'desserts', description: 'Sweet treats and confections', sortOrder: 5 },
    ];

    const categories = [];
    for (const cat of categoryData) {
      const createdCat = await prisma.category.create({
        data: cat,
      });
      categories.push(createdCat);
    }
    const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id])) as Record<string, string>;

    // ──────────────────────────────────────────────
    // 3. MENU ITEMS
    // ──────────────────────────────────────────────
    console.log('☕ Creating menu items...');
    const menuItemsData = [
      {
        categoryId: categoryMap['Coffee']!,
        name: 'Hazelnut Cappuccino',
        slug: 'hazelnut-cappuccino',
        description: 'Double shot of rich espresso with steamed microfoam infused with roasted hazelnut syrup and cocoa dusting.',
        basePrice: '4.75',
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
        rating: '4.8',
        isPopular: true,
        tags: ['Hot', 'Nutty', 'Espresso'],
      },
      {
        categoryId: categoryMap['Coffee']!,
        name: 'Caramel Macchiato',
        slug: 'caramel-macchiato',
        description: 'Freshly steamed milk with vanilla-flavored syrup, marked with espresso and drizzled with decadent buttery caramel.',
        basePrice: '4.95',
        imageUrl: '/images/latte-art.jpg',
        rating: '4.9',
        isSignature: true,
        tags: ['Hot', 'Sweet', 'Best Seller'],
      },
      {
        categoryId: categoryMap['Signature Drinks']!,
        name: 'Mocha Frappe',
        slug: 'mocha-frappe',
        description: 'Rich chocolate sauce, espresso, and milk blended with ice, topped with whipped cream and chocolate drizzle.',
        basePrice: '5.50',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
        rating: '4.7',
        isPopular: true,
        tags: ['Cold', 'Chocolate', 'Blended'],
      },
      {
        categoryId: categoryMap['Cold Brew']!,
        name: 'Matcha Cold Brew',
        slug: 'matcha-cold-brew',
        description: 'Ceremonial grade Japanese matcha layered elegantly over slow-steeped cold brew coffee with a hint of vanilla.',
        basePrice: '5.25',
        imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600',
        rating: '4.9',
        isSignature: true,
        tags: ['Cold', 'Matcha', 'Layered'],
      },
      {
        categoryId: categoryMap['Cold Brew']!,
        name: 'BrewNest Signature Cold Brew',
        slug: 'brewnest-signature-cold-brew',
        description: 'Single-origin Ethiopian beans cold-steeped for 18 hours, infused with a touch of sweet orange zest and nitrogen charge.',
        basePrice: '4.50',
        imageUrl: '/images/cold-brew.jpg',
        rating: '4.8',
        isPopular: true,
        tags: ['Cold', 'Organic', '18hr Steep'],
      },
      {
        categoryId: categoryMap['Coffee']!,
        name: 'Classic Espresso Romano',
        slug: 'classic-espresso-romano',
        description: 'A concentrated shot of espresso served with a slice of lemon to highlight the bright, floral notes of the blend.',
        basePrice: '3.25',
        imageUrl: 'https://images.unsplash.com/photo-1510707513156-46c49f16b6c1?auto=format&fit=crop&q=80&w=600',
        rating: '4.6',
        tags: ['Hot', 'Strong', 'Classic'],
      },
      {
        categoryId: categoryMap['Desserts']!,
        name: 'Traditional Tiramisu',
        slug: 'traditional-tiramisu',
        description: 'Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with premium dark cocoa powder.',
        basePrice: '6.50',
        imageUrl: '/images/tiramisu.jpg',
        rating: '4.95',
        isSignature: true,
        tags: ['Sweet', 'House Special'],
      },
      {
        categoryId: categoryMap['Breakfast']!,
        name: 'Korean Garlic Cheese Bread',
        slug: 'korean-garlic-cheese-bread',
        description: 'Sweet and savory pull-apart bread soaked in garlic butter and stuffed with a rich, sweetened cream cheese filling.',
        basePrice: '5.95',
        imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=600',
        rating: '4.8',
        isPopular: true,
        tags: ['Savory', 'Cheese', 'Warm'],
      },
      {
        categoryId: categoryMap['Breakfast']!,
        name: 'Sourdough Avocado Toast',
        slug: 'sourdough-avocado-toast',
        description: 'Freshly mashed avocado on toasted artisanal sourdough, topped with cherry tomatoes, feta cheese, and microgreens.',
        basePrice: '7.25',
        imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=600',
        rating: '4.7',
        tags: ['Healthy', 'Sourdough', 'Fresh'],
      },
      {
        categoryId: categoryMap['Signature Drinks']!,
        name: 'Velvet Rose Latte',
        slug: 'velvet-rose-latte',
        description: 'A delicate floral latte made with organic rose water syrup, beetroot powder for a pastel pink hue, and edible rose petals.',
        basePrice: '5.25',
        imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600',
        rating: '4.9',
        isSignature: true,
        tags: ['Hot', 'Floral', 'Aesthetic'],
      },
      {
        categoryId: categoryMap['Breakfast']!,
        name: 'Almond Croissant',
        slug: 'almond-croissant',
        description: 'Flaky, double-baked French butter croissant filled with sweet almond frangipane and topped with toasted sliced almonds.',
        basePrice: '4.25',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
        rating: '4.6',
        tags: ['Sweet', 'Flaky', 'Baked'],
      },
      {
        categoryId: categoryMap['Desserts']!,
        name: 'Dark Chocolate Lava Cake',
        slug: 'dark-chocolate-lava-cake',
        description: 'Warm, decadent chocolate cake with a molten liquid center, served with a scoop of Madagascar vanilla bean gelato.',
        basePrice: '6.95',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
        rating: '4.9',
        tags: ['Hot', 'Chocolate', 'Gelato'],
      },
    ];

    const menuItems: Record<string, string> = {};
    for (const item of menuItemsData) {
      const { tags, ...itemData } = item;
      const inserted = await prisma.menuItem.create({
        data: {
          categoryId: itemData.categoryId,
          name: itemData.name,
          slug: itemData.slug,
          description: itemData.description,
          basePrice: itemData.basePrice,
          imageUrl: itemData.imageUrl,
          rating: itemData.rating,
          isPopular: itemData.isPopular || false,
          isSignature: itemData.isSignature || false,
          tags: tags && tags.length > 0 ? {
            create: tags.map(tag => ({ tag })),
          } : undefined,
        },
      });
      menuItems[inserted.slug] = inserted.id;
    }

    // ──────────────────────────────────────────────
    // 4. BLOG POSTS
    // ──────────────────────────────────────────────
    console.log('📝 Creating blog posts...');
    await prisma.blogPost.createMany({
      data: [
        {
          authorId: demoStaff.id,
          title: "The Art of Pour Over: A Beginner's Guide",
          slug: 'the-art-of-pour-over',
          excerpt: 'Master the water-to-coffee ratio, temperature control, and circular pouring techniques to extract the brightest, cleanest flavor profile from single-origin beans.',
          content: 'Full blog content would go here — rich text from the CMS editor.',
          imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
          category: 'Brewing Techniques',
          readTimeMin: 5,
          isPublished: true,
          publishedAt: new Date('2025-05-18'),
        },
        {
          authorId: demoStaff.id,
          title: 'Latte Art Secrets: Pouring the Perfect Rosetta',
          slug: 'latte-art-secrets',
          excerpt: "It's all about the microfoam. Learn the science of milk steaming and the wrist flick technique required to create breathtaking, Instagram-worthy milk art patterns.",
          content: 'Full blog content would go here — rich text from the CMS editor.',
          imageUrl: '/images/latte-art.jpg',
          category: 'Latte Art Secrets',
          readTimeMin: 4,
          isPublished: true,
          publishedAt: new Date('2025-05-10'),
        },
        {
          authorId: demoStaff.id,
          title: 'Understanding Bean Origins: Ethiopia vs Colombia',
          slug: 'understanding-bean-origins',
          excerpt: 'Uncover how altitude, soil composition, and processing methods create the fruity, tea-like notes of African beans versus the rich, chocolatey, nutty body of South American beans.',
          content: 'Full blog content would go here — rich text from the CMS editor.',
          imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600',
          category: 'Coffee Beans Guide',
          readTimeMin: 7,
          isPublished: true,
          publishedAt: new Date('2025-04-28'),
        },
      ],
    });

    // ──────────────────────────────────────────────
    // 5. TESTIMONIALS
    // ──────────────────────────────────────────────
    console.log('💬 Creating testimonials...');
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'Sophia Chen',
          role: 'Product Designer',
          rating: '5.0',
          comment: 'BrewNest has become my second home. The Japanese-inspired minimalist decor, super fast WiFi, and the Caramel Macchiato keep me productive for hours! Highly recommend.',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
          isApproved: true,
          isFeatured: true,
        },
        {
          name: 'Marcus Sterling',
          role: 'Coffee Connoisseur',
          rating: '5.0',
          comment: 'Their 18-hour Ethiopia Cold Brew is spectacular. You can taste the bright notes of lemon and floral undertones. The baristas really know their craft and explain bean origins so passionately.',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
          isApproved: true,
          isFeatured: true,
        },
        {
          name: 'Yuki Tanaka',
          role: 'Freelance Writer',
          rating: '5.0',
          comment: "As a fan of Tokyo cafes, I was amazed by BrewNest. The Matcha Cold Brew is layered beautifully and isn't overly sweet. It is the perfect peaceful sanctuary in the middle of a busy city.",
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          isApproved: true,
          isFeatured: true,
        },
        {
          name: 'David Miller',
          role: 'Software Engineer',
          rating: '4.8',
          comment: 'The loyalty program is awesome. I earned enough points for a free Tiramisu in just a couple of visits. Plus, the Live Acoustic Nights on Friday are the absolute best way to decompress after coding.',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          isApproved: true,
          isFeatured: true,
        },
      ],
    });

    // ──────────────────────────────────────────────
    // 6. GALLERY IMAGES
    // ──────────────────────────────────────────────
    console.log('🖼️  Creating gallery images...');
    await prisma.galleryImage.createMany({
      data: [
        { imageUrl: '/images/cafe-interior.jpg', title: 'Cozy Workspace Corner', category: 'Interior', sortOrder: 1 },
        { imageUrl: '/images/latte-art.jpg', title: 'Perfect Heart Crema', category: 'Latte Art', sortOrder: 2 },
        { imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600', title: 'Brewing Bar Counter', category: 'Interior', sortOrder: 3 },
        { imageUrl: '/images/tiramisu.jpg', title: 'Indulgent Tiramisu', category: 'Desserts', sortOrder: 4 },
        { imageUrl: '/images/cold-brew.jpg', title: 'Iced Nitrogen Cold Brew', category: 'Coffee Cups', sortOrder: 5 },
        { imageUrl: '/images/barista.jpg', title: 'The Craft of Pour Over', category: 'Workspace', sortOrder: 6 },
      ],
    });

    // ──────────────────────────────────────────────
    // 7. PROMO CODES
    // ──────────────────────────────────────────────
    console.log('🎟️  Creating promo codes...');
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const promo1 = await prisma.promoCode.create({
      data: {
        code: 'BREWBOGO',
        description: 'Buy 1 Get 1 Free on all Signature Nitro Cold Brews.',
        discountType: 'bogo',
        discountValue: '100.00',
        validFrom: now,
        validUntil: thirtyDaysLater,
        maxUses: 500,
        isActive: true,
      },
    });

    const promo2 = await prisma.promoCode.create({
      data: {
        code: 'STUDENT20',
        description: 'Show your student ID at checkout or use the online promo code to get 20% off your entire order.',
        discountType: 'percentage',
        discountValue: '20.00',
        maxDiscountAmount: '10.00',
        validFrom: now,
        validUntil: thirtyDaysLater,
        maxUses: 1000,
        isActive: true,
      },
    });

    const promo3 = await prisma.promoCode.create({
      data: {
        code: 'SWEETWEEKEND',
        description: 'Order any signature coffee and get our traditional homemade Tiramisu at half price this Saturday & Sunday.',
        discountType: 'percentage',
        discountValue: '50.00',
        maxDiscountAmount: '5.00',
        validFrom: now,
        validUntil: thirtyDaysLater,
        maxUses: 200,
        isActive: true,
      },
    });

    const promoCodeMap = {
      BREWBOGO: promo1.id,
      STUDENT20: promo2.id,
      SWEETWEEKEND: promo3.id,
    };

    // ──────────────────────────────────────────────
    // 8. SPECIAL OFFERS (linked to promo codes)
    // ──────────────────────────────────────────────
    console.log('🔥 Creating special offers...');
    await prisma.specialOffer.createMany({
      data: [
        {
          title: 'BOGO Cold Brew',
          description: 'Buy 1 Get 1 Free on all Signature Nitro Cold Brews. Perfect for a hot afternoon with a friend!',
          discountText: 'Buy 1 Get 1',
          promoCodeId: promoCodeMap.BREWBOGO,
          bgType: 'gold',
          startAt: now,
          endAt: thirtyDaysLater,
        },
        {
          title: 'Student Fuel Discount',
          description: 'Show your student ID at checkout or use the online promo code to get 20% off your entire order.',
          discountText: '20% OFF',
          promoCodeId: promoCodeMap.STUDENT20,
          bgType: 'brown',
          startAt: now,
          endAt: thirtyDaysLater,
        },
        {
          title: 'Weekend Sweet Combo',
          description: 'Order any signature coffee and get our traditional homemade Tiramisu at half price this Saturday & Sunday.',
          discountText: '50% Off Tiramisu',
          promoCodeId: promoCodeMap.SWEETWEEKEND,
          bgType: 'espresso',
          startAt: now,
          endAt: thirtyDaysLater,
        },
      ],
    });

    // ──────────────────────────────────────────────
    // 9. LOYALTY TIERS & ACCOUNTS
    // ──────────────────────────────────────────────
    console.log('🌟 Creating loyalty tiers...');
    const tierBronze = await prisma.loyaltyTier.create({
      data: {
        name: 'Bronze',
        minPoints: 0,
        pointsMultiplier: '1.00',
        perks: ['Free birthday drink', '10 points per $1'],
        sortOrder: 1,
      },
    });

    await prisma.loyaltyTier.create({
      data: {
        name: 'Silver',
        minPoints: 500,
        pointsMultiplier: '1.25',
        perks: ['Free birthday drink', '12.5 points per $1', 'Free size upgrade monthly'],
        sortOrder: 2,
      },
    });

    await prisma.loyaltyTier.create({
      data: {
        name: 'Gold',
        minPoints: 1500,
        pointsMultiplier: '1.50',
        perks: ['Free birthday drink + dessert', '15 points per $1', 'Free size upgrade weekly', 'Priority seating'],
        sortOrder: 3,
      },
    });

    await prisma.loyaltyTier.create({
      data: {
        name: 'Platinum',
        minPoints: 5000,
        pointsMultiplier: '2.00',
        perks: ['Free birthday drink + dessert + meal', '20 points per $1', 'Unlimited size upgrades', 'Priority seating', 'Early access to new items', 'Exclusive events'],
        sortOrder: 4,
      },
    });

    // Create loyalty account for demo customer
    await prisma.loyaltyAccount.create({
      data: {
        userId: demoCustomer.id,
        tierId: tierBronze.id,
        totalPoints: 120,
        availablePoints: 120,
        lifetimePoints: 120,
        referralCode: 'SOPHIA2025',
      },
    });

    // ──────────────────────────────────────────────
    // 10. CAFÉ TABLES
    // ──────────────────────────────────────────────
    console.log('🪑 Creating café tables...');
    await prisma.cafeTable.createMany({
      data: [
        { tableNumber: 1, capacity: 2, location: 'indoor' },
        { tableNumber: 2, capacity: 2, location: 'indoor' },
        { tableNumber: 3, capacity: 4, location: 'indoor' },
        { tableNumber: 4, capacity: 4, location: 'indoor' },
        { tableNumber: 5, capacity: 6, location: 'indoor' },
        { tableNumber: 6, capacity: 8, location: 'indoor' },
        { tableNumber: 7, capacity: 2, location: 'outdoor' },
        { tableNumber: 8, capacity: 4, location: 'outdoor' },
        { tableNumber: 9, capacity: 6, location: 'outdoor' },
        { tableNumber: 10, capacity: 10, location: 'private' },
      ],
    });

    // ──────────────────────────────────────────────
    // 11. SITE SETTINGS
    // ──────────────────────────────────────────────
    console.log('⚙️  Creating site settings...');
    await prisma.siteSetting.createMany({
      data: [
        {
          key: 'business_info',
          value: {
            name: 'BrewNest Café',
            tagline: 'Crafted Coffee, Cozy Moments',
            address: '128 Aesthetic Boulevard, Suite A, Coffee District, CA 90210',
            phone: '+1 (555) 234-7890',
            email: 'hello@brewnestcafe.com',
            whatsapp: '+15552347890',
          },
        },
        {
          key: 'business_hours',
          value: {
            monday: { open: '07:00', close: '22:00' },
            tuesday: { open: '07:00', close: '22:00' },
            wednesday: { open: '07:00', close: '22:00' },
            thursday: { open: '07:00', close: '22:00' },
            friday: { open: '07:00', close: '23:00', note: 'Live Acoustic Night' },
            saturday: { open: '07:00', close: '23:00', note: 'Live Acoustic Night' },
            sunday: { open: '08:00', close: '22:00' },
          },
        },
        {
          key: 'social_links',
          value: {
            facebook: 'https://facebook.com/brewnestcafe',
            instagram: 'https://instagram.com/brewnest.cafe',
            twitter: 'https://twitter.com/brewnestcafe',
          },
        },
        {
          key: 'ordering',
          value: {
            taxRate: 0.085,
            pointsPerDollar: 10,
            pointsToCurrencyRatio: 100, // 100 points = $1
            deliveryFee: 0,
            minOrderAmount: 5.00,
            estimatedDeliveryMinutes: 25,
          },
        },
        {
          key: 'hero_stats',
          value: {
            happyCustomers: '50K+',
            coffeeRecipes: '120+',
            averageRating: '4.9',
          },
        },
        {
          key: 'about',
          value: {
            foundedYear: 2020,
            story: 'Born from a love of artisan craftsmanship and a dream to create the perfect neighborhood coffee sanctuary, BrewNest was founded in 2020.',
            coffeeQuality: 98,
            customerSatisfaction: 99,
            freshIngredients: 97,
          },
        },
        {
          key: 'why_choose_us',
          value: [
            { title: '100% Organic Beans', description: 'Sourced directly from ethically managed micro-lot farms in Ethiopia, Colombia, and Sumatra.', iconName: 'Leaf' },
            { title: 'Expert Baristas', description: 'Our baristas are certified coffee sommeliers, trained in precise extraction and sensory analysis.', iconName: 'Award' },
            { title: 'Cozy Aesthetic Interior', description: 'Inspired by Japanese minimalism and Korean cafe culture. Perfect for deep focus or warm chats.', iconName: 'Coffee' },
            { title: 'Gigabit Free WiFi', description: 'High-speed fiber internet and power outlets at every seat, designed for modern remote professionals.', iconName: 'Wifi' },
            { title: 'Express Delivery', description: 'Our custom thermal packaging ensures your coffee arrives hot and your cold brews remain chilled.', iconName: 'Truck' },
            { title: 'Live Acoustic Nights', description: 'Unwind every Friday and Saturday evening with local indie artists performing unplugged sessions.', iconName: 'Music' },
          ],
        },
      ],
    });

    // ──────────────────────────────────────────────
    // 12. DAILY SPECIAL
    // ──────────────────────────────────────────────
    console.log('✨ Creating daily special...');
    const tiramisuId = menuItems['traditional-tiramisu'];
    if (tiramisuId) {
      await prisma.dailySpecial.create({
        data: {
          itemId: tiramisuId,
          specialPrice: '4.50',
          tagline: "Chef's Daily Special — Afternoon Delight",
          activeDate: new Date(),
          isActive: true,
        },
      });
    }

    console.log('\n✅ Seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  📧 Admin:    admin@brewnest.com / Admin@123');
    console.log('  📧 Customer: customer@brewnest.com / Customer@123');
    console.log('  📧 Staff:    staff@brewnest.com / Staff@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
