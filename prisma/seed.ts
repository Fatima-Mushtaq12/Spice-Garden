import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Spice Garden database...')

  // 1. Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'spice-garden-lahore' },
    update: {},
    create: {
      name: 'Spice Garden',
      slug: 'spice-garden-lahore',
      description: 'Authentic Pakistani cuisine crafted with love since 2018. From aromatic biryanis to sizzling karahis, we bring the rich flavours of Pakistan to your table.',
      address: '45 MM Alam Road, Gulberg III, Lahore, Punjab 54000',
      phone: '+924235761234',
      email: 'hello@spicegarden.pk',
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=1200&q=80',
      isOpen: true,
      hours: {
        monday: { open: '12:00', close: '23:00' },
        tuesday: { open: '12:00', close: '23:00' },
        wednesday: { open: '12:00', close: '23:00' },
        thursday: { open: '12:00', close: '23:00' },
        friday: { open: '12:00', close: '00:00' },
        saturday: { open: '12:00', close: '00:00' },
        sunday: { open: '13:00', close: '23:00' },
      },
      deliveryRadius: 10,
      minOrder: 500,
      deliveryFee: 150,
    },
  })
  console.log('✅ Restaurant:', restaurant.name)

  // 2. Menu categories
  const categoryData = [
    { name: 'Starters', description: 'Light bites and appetisers to begin your journey', sortOrder: 1 },
    { name: 'Mains', description: 'Hearty main courses bursting with flavour', sortOrder: 2 },
    { name: 'Grills', description: 'Sizzling BBQ and tandoor specialities', sortOrder: 3 },
    { name: 'Beverages', description: 'Refreshing drinks and traditional favourites', sortOrder: 4 },
    { name: 'Desserts', description: 'Sweet endings to complete your meal', sortOrder: 5 },
  ]

  const categories: Record<string, any> = {}
  for (const cat of categoryData) {
    const c = await prisma.menuCategory.upsert({
      where: {
        id: `cat-${cat.name.toLowerCase()}`,
      },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: {
        id: `cat-${cat.name.toLowerCase()}`,
        restaurantId: restaurant.id,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    })
    categories[cat.name] = c
    console.log('  📂 Category:', cat.name)
  }

  // 3. Menu items
  const menuItems = [
    // STARTERS
    {
      categoryName: 'Starters',
      name: 'Chicken Tikka Boti',
      description: 'Tender chicken chunks marinated in yoghurt and aromatic spices, skewered and grilled to perfection in our clay tandoor. Served with mint chutney and sliced onions.',
      price: 650,
      dietaryTags: ['halal', 'spicy'],
      preparationTime: 20,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=70',
    },
    {
      categoryName: 'Starters',
      name: 'Seekh Kabab',
      description: 'Hand-minced beef blended with green chillis, fresh herbs and select spices, shaped on skewers and char-grilled over coal. 4 pieces served with raita.',
      price: 750,
      dietaryTags: ['halal', 'spicy'],
      preparationTime: 18,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=70',
    },
    {
      categoryName: 'Starters',
      name: 'Samosa Chaat',
      description: 'Crispy potato-filled samosas crushed and topped with spiced chickpeas, tangy tamarind chutney, cooling yoghurt, sev and fresh coriander.',
      price: 400,
      dietaryTags: ['vegetarian'],
      preparationTime: 10,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=70',
    },
    {
      categoryName: 'Starters',
      name: 'Dahi Bhalle',
      description: 'Soft lentil dumplings soaked in cool whipped yoghurt, drizzled with sweet and tangy chutneys and sprinkled with roasted cumin and chaat masala.',
      price: 350,
      dietaryTags: ['vegetarian'],
      preparationTime: 8,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=70',
    },
    // MAINS
    {
      categoryName: 'Mains',
      name: 'Chicken Karahi',
      description: 'Our signature dish — fresh-cut chicken cooked in a cast-iron karahi with tomatoes, green chillis, ginger, garlic and hand-ground spices. Finished with butter and cream.',
      price: 1200,
      dietaryTags: ['halal', 'spicy'],
      preparationTime: 25,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=70',
    },
    {
      categoryName: 'Mains',
      name: 'Beef Biryani',
      description: 'Slow-cooked dum biryani with tender beef, aged basmati rice, saffron, caramelised onions and whole spices. Each grain of rice absorbs the rich meat juices.',
      price: 900,
      dietaryTags: ['halal', 'spicy'],
      preparationTime: 35,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=70',
    },
    {
      categoryName: 'Mains',
      name: 'Lamb Nihari',
      description: 'A Lahori classic — slow-braised lamb shank simmered overnight in a rich, deeply spiced gravy. Garnished with ginger, fried onions, fresh lime and green chillis.',
      price: 1400,
      dietaryTags: ['halal'],
      preparationTime: 30,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=70',
    },
    {
      categoryName: 'Mains',
      name: 'Palak Paneer',
      description: 'Fresh cottage cheese cubes in a velvety spinach gravy with garlic, ginger and gentle spices. A wholesome vegetarian main served with naan.',
      price: 750,
      dietaryTags: ['vegetarian', 'gluten-free'],
      preparationTime: 20,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=70',
    },
    {
      categoryName: 'Mains',
      name: 'Chana Masala',
      description: 'Hearty chickpeas cooked in an aromatic tomato and onion masala, slow-simmered with whole spices and finished with fresh coriander and a squeeze of lime.',
      price: 600,
      dietaryTags: ['vegetarian', 'vegan', 'halal', 'gluten-free'],
      preparationTime: 15,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=70',
    },
    // GRILLS
    {
      categoryName: 'Grills',
      name: 'Mixed Grill Platter',
      description: 'The ultimate BBQ experience — a generous platter with seekh kababs, chicken tikka, lamb chops and shami kababs. Served with bread, raita and salad.',
      price: 2800,
      dietaryTags: ['halal'],
      preparationTime: 30,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=70',
    },
    {
      categoryName: 'Grills',
      name: 'Lamb Chops',
      description: 'Premium lamb rib chops marinated overnight in yoghurt, raw papaya and spices, then grilled over coal for a smoky char. 4 pieces per portion.',
      price: 2200,
      dietaryTags: ['halal'],
      preparationTime: 25,
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=70',
    },
    {
      categoryName: 'Grills',
      name: 'Tandoori Whole Chicken',
      description: 'A full spring chicken marinated in our house tandoori spice blend and yoghurt, roasted in the clay oven until charred on the outside and juicy within.',
      price: 1800,
      dietaryTags: ['halal'],
      preparationTime: 40,
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=70',
    },
    {
      categoryName: 'Grills',
      name: 'Reshmi Kabab',
      description: 'Silky smooth minced chicken kababs made with cashew paste, cream and mild spices, grilled on skewers for a melt-in-the-mouth texture. 3 pieces served.',
      price: 950,
      dietaryTags: ['halal'],
      preparationTime: 22,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=70',
    },
    // BEVERAGES
    {
      categoryName: 'Beverages',
      name: 'Mango Lassi',
      description: 'Fresh Chaunsa mango blended with thick yoghurt, chilled milk and a pinch of cardamom. Sweet, creamy and quintessentially Pakistani.',
      price: 280,
      dietaryTags: ['vegetarian'],
      preparationTime: 5,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=70',
    },
    {
      categoryName: 'Beverages',
      name: 'Rooh Afza Sharbat',
      description: 'The iconic Pakistani rose sherbet mixed with cold milk and rose petals. Refreshingly sweet and floral — a summer classic.',
      price: 200,
      dietaryTags: ['vegetarian'],
      preparationTime: 3,
      image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=70',
    },
    {
      categoryName: 'Beverages',
      name: 'Kashmiri Chai',
      description: 'Traditional pink Kashmiri tea brewed with special tea leaves and baking soda, finished with warm milk, cream, pistachios and cardamom.',
      price: 320,
      dietaryTags: ['vegetarian'],
      preparationTime: 8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    },
    {
      categoryName: 'Beverages',
      name: 'Fresh Lime Soda',
      description: 'Freshly squeezed lime juice with chilled sparkling water, a pinch of black salt and mint leaves. The perfect palate cleanser.',
      price: 180,
      dietaryTags: ['vegetarian', 'vegan'],
      preparationTime: 3,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70',
    },
    // DESSERTS
    {
      categoryName: 'Desserts',
      name: 'Gulab Jamun',
      description: 'Soft khoya dumplings deep-fried to a golden brown and soaked in fragrant rose-water sugar syrup. Served warm with a sprinkle of pistachios. 4 pieces.',
      price: 300,
      dietaryTags: ['vegetarian'],
      preparationTime: 10,
      image: 'https://images.unsplash.com/photo-1567206563114-c179900d4f75?w=400&q=70',
    },
    {
      categoryName: 'Desserts',
      name: 'Kheer',
      description: 'Slow-cooked rice pudding simmered in full-fat milk with sugar, cardamom, saffron and rose water. Garnished with blanched almonds and pistachios.',
      price: 280,
      dietaryTags: ['vegetarian', 'gluten-free'],
      preparationTime: 12,
      image: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?w=400&q=70',
    },
    {
      categoryName: 'Desserts',
      name: 'Shahi Tukray',
      description: 'Decadent bread pudding soaked in sweet condensed milk rabri, topped with silver leaf, saffron, dried fruits and chopped nuts. A royal Mughal dessert.',
      price: 450,
      dietaryTags: ['vegetarian'],
      preparationTime: 15,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=70',
    },
    {
      categoryName: 'Desserts',
      name: 'Kulfi Faluda',
      description: 'Traditional Pakistani frozen milk dessert served on a bed of rose-flavoured faluda vermicelli, basil seeds and a drizzle of sweet syrup.',
      price: 380,
      dietaryTags: ['vegetarian'],
      preparationTime: 5,
      image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&q=70',
    },
  ]

  for (const item of menuItems) {
    const category = categories[item.categoryName]
    await prisma.menuItem.upsert({
      where: { id: `item-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` },
      update: {},
      create: {
        id: `item-${item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
        categoryId: category.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.image,
        isAvailable: true,
        dietaryTags: item.dietaryTags,
        preparationTime: item.preparationTime,
      },
    })
    console.log(`  🍽️  ${item.name}`)
  }

  // 4. Modifiers for Chicken Karahi
  const karahi = await prisma.menuItem.findFirst({ where: { name: 'Chicken Karahi' } })
  if (karahi) {
    await prisma.modifier.upsert({
      where: { id: 'mod-karahi-size' },
      update: {},
      create: {
        id: 'mod-karahi-size',
        menuItemId: karahi.id,
        name: 'Serving Size',
        options: [
          { label: 'Half (500g)', price: 0 },
          { label: 'Full (1kg)', price: 400 },
        ],
        required: true,
        maxSelections: 1,
      },
    })
    await prisma.modifier.upsert({
      where: { id: 'mod-karahi-extras' },
      update: {},
      create: {
        id: 'mod-karahi-extras',
        menuItemId: karahi.id,
        name: 'Extras',
        options: [
          { label: 'Extra Naan', price: 80 },
          { label: 'Extra Raita', price: 80 },
          { label: 'Extra Butter', price: 50 },
        ],
        required: false,
        maxSelections: 3,
      },
    })
  }

  // Modifiers for Beef Biryani
  const biryani = await prisma.menuItem.findFirst({ where: { name: 'Beef Biryani' } })
  if (biryani) {
    await prisma.modifier.upsert({
      where: { id: 'mod-biryani-portion' },
      update: {},
      create: {
        id: 'mod-biryani-portion',
        menuItemId: biryani.id,
        name: 'Portion',
        options: [
          { label: 'Half Portion', price: 0 },
          { label: 'Full Portion (for 2)', price: 350 },
        ],
        required: true,
        maxSelections: 1,
      },
    })
  }

  // Modifiers for Mixed Grill Platter
  const grill = await prisma.menuItem.findFirst({ where: { name: 'Mixed Grill Platter' } })
  if (grill) {
    await prisma.modifier.upsert({
      where: { id: 'mod-grill-bread' },
      update: {},
      create: {
        id: 'mod-grill-bread',
        menuItemId: grill.id,
        name: 'Bread Selection',
        options: [
          { label: 'Naan', price: 0 },
          { label: 'Paratha', price: 50 },
          { label: 'Roti', price: 0 },
        ],
        required: false,
        maxSelections: 1,
      },
    })
  }

  console.log('✅ Menu items and modifiers created')

  // 5. Coupons
  const coupons = [
    {
      id: 'coupon-welcome10',
      code: 'WELCOME10',
      type: 'PERCENTAGE' as const,
      value: 10,
      minOrderAmount: 0,
      usageLimit: null,
      expiresAt: null,
      isActive: true,
    },
    {
      id: 'coupon-first50',
      code: 'FIRST50',
      type: 'FIXED' as const,
      value: 50,
      minOrderAmount: 500,
      usageLimit: 100,
      expiresAt: null,
      isActive: true,
    },
    {
      id: 'coupon-summer20',
      code: 'SUMMER20',
      type: 'PERCENTAGE' as const,
      value: 20,
      minOrderAmount: 0,
      usageLimit: 200,
      expiresAt: new Date('2024-09-01'),
      isActive: false,
    },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    })
    console.log(`  🏷️  Coupon: ${coupon.code}`)
  }

  // 6. Users (admin, staff, driver)
  const hashedPassword = await bcrypt.hash('SpiceGarden2024!', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@spicegarden.pk' },
    update: {},
    create: {
      email: 'admin@spicegarden.pk',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      phone: '+923001234567',
    },
  })

  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@spicegarden.pk' },
    update: {},
    create: {
      email: 'staff@spicegarden.pk',
      name: 'Staff Member',
      role: 'STAFF',
      emailVerified: new Date(),
      phone: '+923001234568',
    },
  })

  const driverUserRecord = await prisma.user.upsert({
    where: { email: 'driver@spicegarden.pk' },
    update: {},
    create: {
      email: 'driver@spicegarden.pk',
      name: 'Ahmed Driver',
      role: 'DRIVER',
      emailVerified: new Date(),
      phone: '+923001234569',
    },
  })

  // Create driver record
  await prisma.driver.upsert({
    where: { userId: driverUserRecord.id },
    update: {},
    create: {
      userId: driverUserRecord.id,
      isOnline: true,
      currentLat: 31.5204,
      currentLng: 74.3587,
    },
  })

  console.log('✅ Users created:')
  console.log('  👑 Admin: admin@spicegarden.pk')
  console.log('  👷 Staff: staff@spicegarden.pk')
  console.log('  🚗 Driver: driver@spicegarden.pk')
  console.log()
  console.log('🎉 Seed complete!')
  console.log(`📝 Restaurant ID: ${restaurant.id}`)
  console.log('   Add this to your .env: NEXT_PUBLIC_RESTAURANT_ID=' + restaurant.id)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
