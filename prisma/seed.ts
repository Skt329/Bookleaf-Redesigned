/**
 * BookLeaf Publishing — Database Seed Script
 *
 * Seeds the database with realistic sample data:
 * - Admin account
 * - 6 test authors with books
 * - Publishing packages
 * - Sample reviews, blog posts
 * - Royalty records, sales records
 *
 * Run: npx dotenv -e .env.local -- npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function paise(rupees: number): number {
  return Math.round(rupees * 100);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(prefix: string, num: number): string {
  return `${prefix}${String(num).padStart(4, '0')}`;
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

const AUTHORS = [
  { name: 'Priya Sharma', email: 'priya@bookleaf.dev', penName: 'Priya Sharma', bio: 'Award-winning literary fiction author from Mumbai.', city: 'Mumbai' },
  { name: 'Arjun Mehta', email: 'arjun@bookleaf.dev', penName: 'Arjun Mehta', bio: 'Self-help author and motivational speaker.', city: 'Bangalore' },
  { name: 'Nazia Khan', email: 'nazia@bookleaf.dev', penName: 'Nazia Khan', bio: 'Poet and Urdu literature enthusiast from Kashmir.', city: 'Srinagar' },
  { name: 'Rohan Gupta', email: 'rohan@bookleaf.dev', penName: 'Rohan Gupta', bio: 'Entrepreneur and business author.', city: 'New Delhi' },
  { name: 'Meera Iyer', email: 'meera@bookleaf.dev', penName: 'Meera Iyer', bio: 'Romance novelist with a flair for storytelling.', city: 'Chennai' },
  { name: 'Vikram Desai', email: 'vikram@bookleaf.dev', penName: 'Vikram Desai', bio: 'Thriller writer and former journalist.', city: 'Pune' },
];

const BOOKS = [
  { title: 'The Silent Valley', genre: 'LITERARY_FICTION', mrp: 399, pages: 284, authorIdx: 0, status: 'PUBLISHED' },
  { title: 'Beyond the Horizon', genre: 'SELF_HELP', mrp: 349, pages: 216, authorIdx: 1, status: 'PUBLISHED' },
  { title: 'Whispers of Kashmir', genre: 'POETRY', mrp: 299, pages: 128, authorIdx: 2, status: 'PUBLISHED' },
  { title: 'The Startup Playbook', genre: 'BUSINESS', mrp: 499, pages: 312, authorIdx: 3, status: 'PUBLISHED' },
  { title: 'Letters Never Sent', genre: 'ROMANCE', mrp: 349, pages: 248, authorIdx: 4, status: 'PUBLISHED' },
  { title: 'The Last Monsoon', genre: 'THRILLER', mrp: 449, pages: 336, authorIdx: 5, status: 'PUBLISHED' },
  { title: 'Echoes of Silence', genre: 'LITERARY_FICTION', mrp: 379, pages: 264, authorIdx: 0, status: 'PUBLISHED' },
  { title: 'Mindful Living', genre: 'SELF_HELP', mrp: 299, pages: 192, authorIdx: 1, status: 'EDITING' },
  { title: 'The Kashmir Diaries', genre: 'MEMOIR', mrp: 549, pages: 352, authorIdx: 2, status: 'PUBLISHED' },
  { title: 'Venture Capital 101', genre: 'BUSINESS', mrp: 599, pages: 288, authorIdx: 3, status: 'COVER_DESIGN' },
  { title: 'Summer Rain', genre: 'ROMANCE', mrp: 299, pages: 224, authorIdx: 4, status: 'PUBLISHED' },
  { title: 'Dark Corridors', genre: 'CRIME', mrp: 399, pages: 304, authorIdx: 5, status: 'PROOFREADING' },
];

const BOOK_COLORS = [
  '#1a5c3a', '#2563eb', '#7c3aed', '#dc2626',
  '#0891b2', '#d97706', '#059669', '#6366f1',
  '#be185d', '#ea580c', '#0d9488', '#7c2d12',
];

const REVIEWS = [
  { authorName: 'Ananya Verma', bookTitle: 'Finding My Voice', rating: 5, text: '"BookLeaf made my dream of becoming a published author a reality. The team was incredibly supportive, and my book was ready in just 12 days!"', source: 'GOOGLE' },
  { authorName: 'Karthik Reddy', bookTitle: 'Code to Canvas', rating: 5, text: '"As a first-time author, I was overwhelmed. BookLeaf guided me through every step — from editing to getting my book on Amazon India and Flipkart."', source: 'GOOGLE' },
  { authorName: 'Fatima Sheikh', bookTitle: 'Threads of Gold', rating: 5, text: '"The cover design blew me away! I received compliments from readers who said they bought the book purely because of how beautiful it looked."', source: 'GOOGLE' },
  { authorName: 'Rajesh Nair', bookTitle: 'Monsoon Memoirs', rating: 5, text: '"The royalty dashboard is fantastic — I can see sales in real time. BookLeaf truly puts authors first. Highly recommended!"', source: 'GOOGLE' },
  { authorName: 'Sneha Joshi', bookTitle: 'Sunlit Pages', rating: 4, text: '"Professional service from start to finish. My book was published on 5 platforms within 2 weeks. The team is responsive and knowledgeable."', source: 'GOOGLE' },
  { authorName: 'Amit Patel', bookTitle: 'The Mumbai Diaries', rating: 5, text: '"I compared several publishers before choosing BookLeaf. Best decision ever. Transparent pricing, quality editing, and global distribution."', source: 'GOOGLE' },
  { authorName: 'Lakshmi Rao', bookTitle: 'Spices & Stories', rating: 5, text: '"The writing challenge was a game-changer. 21 days of guided writing, and now I have a published anthology. Magical experience!"', source: 'INTERNAL' },
  { authorName: 'Dev Kapoor', bookTitle: 'Startup Lessons', rating: 4, text: '"Great platform for business authors. My book is now available across Amazon India, US, and UK. The sales reports are detailed and helpful."', source: 'GOOGLE' },
];

const BLOG_POSTS = [
  { title: 'How to Self-Publish in India in 2025', slug: 'how-to-self-publish-india-2025', content: 'Self-publishing in India has never been easier. With platforms like BookLeaf, you can go from manuscript to published book in as little as 14 days...', tags: ['publishing', 'guide', 'india'], authorName: 'BookLeaf Team' },
  { title: '5 Tips for First-Time Authors', slug: '5-tips-first-time-authors', content: 'Writing your first book is exciting but can also be daunting. Here are five essential tips that every first-time author should know...', tags: ['writing', 'tips', 'beginners'], authorName: 'Priya Sharma' },
  { title: 'Understanding Book Royalties', slug: 'understanding-book-royalties', content: 'One of the most important aspects of self-publishing is understanding how royalties work. At BookLeaf, we offer 100% royalty on author-driven sales...', tags: ['royalties', 'business', 'publishing'], authorName: 'BookLeaf Team' },
  { title: "BookLeaf's Journey on Shark Tank India", slug: 'bookleaf-shark-tank-india', content: 'When we walked onto the Shark Tank India stage, we had one mission: to show India that self-publishing deserves a spotlight...', tags: ['company', 'shark-tank', 'story'], authorName: 'BookLeaf Team' },
  { title: 'The Art of Book Cover Design', slug: 'art-of-book-cover-design', content: 'They say don\'t judge a book by its cover, but readers absolutely do. A great cover design can make the difference between a bestseller and a shelf-sitter...', tags: ['design', 'cover', 'marketing'], authorName: 'BookLeaf Team' },
  { title: 'Writing Your First Novel: A Complete Guide', slug: 'writing-first-novel-guide', content: 'Every published author started with a blank page. If you\'ve been dreaming of writing a novel, this comprehensive guide will walk you through every step...', tags: ['writing', 'novel', 'guide'], authorName: 'Arjun Mehta' },
];

const PLATFORMS = ['AMAZON_INDIA', 'FLIPKART', 'AMAZON_US', 'AMAZON_UK', 'BOOKLEAF_STORE'] as const;

// ---------------------------------------------------------------------------
// Main Seed Function
// ---------------------------------------------------------------------------

async function main() {
  console.log('🌱 Seeding BookLeaf database...\n');

  // 1. Create Admin
  console.log('👤 Creating admin account...');
  const hashedAdminPw = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookleaf.com' },
    update: {},
    create: {
      email: 'admin@bookleaf.com',
      name: 'BookLeaf Admin',
      password: hashedAdminPw,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log(`  ✓ Admin: ${admin.email}`);

  // 2. Create Authors
  console.log('\n✍️  Creating authors...');
  const hashedAuthorPw = await bcrypt.hash('Author@123', 12);
  const authorRecords = [];

  for (let i = 0; i < AUTHORS.length; i++) {
    const a = AUTHORS[i];
    const user = await prisma.user.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        name: a.name,
        password: hashedAuthorPw,
        role: 'AUTHOR',
        city: a.city,
        isVerified: true,
      },
    });

    const author = await prisma.author.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        authorId: generateId('AUTH', i + 1),
        penName: a.penName,
        authorBio: a.bio,
        publishingPackage: i % 3 === 0 ? 'PROFESSIONAL' : i % 3 === 1 ? 'PREMIUM' : 'BASIC',
        socialLinks: { instagram: `@${a.name.toLowerCase().replace(' ', '')}` },
      },
    });

    authorRecords.push({ user, author });
    console.log(`  ✓ ${a.name} (${a.email})`);
  }

  // 3. Create Books
  console.log('\n📚 Creating books...');
  const bookRecords = [];

  for (let i = 0; i < BOOKS.length; i++) {
    const b = BOOKS[i];
    const author = authorRecords[b.authorIdx].author;
    const mrpPaise = paise(b.mrp);
    const royaltyPerCopy = Math.round(mrpPaise * 0.8 * 0.6); // 80% split of 60% net

    const book = await prisma.book.upsert({
      where: { bookId: generateId('BK', i + 1) },
      update: {},
      create: {
        bookId: generateId('BK', i + 1),
        authorId: author.id,
        title: b.title,
        genre: b.genre as any,
        description: `A captivating ${b.genre.toLowerCase().replace('_', ' ')} book by ${authorRecords[b.authorIdx].user.name}.`,
        status: b.status as any,
        mrp: mrpPaise,
        authorRoyaltyPerCopy: royaltyPerCopy,
        pageCount: b.pages,
        isPaperbackAvailable: true,
        isEbookAvailable: b.status === 'PUBLISHED',
        isFeatured: i < 6,
        language: 'ENGLISH',
        publicationDate: b.status === 'PUBLISHED' ? new Date(2024, randomBetween(0, 11), randomBetween(1, 28)) : null,
      },
    });

    bookRecords.push(book);
    console.log(`  ✓ "${b.title}" (${b.status})`);

    // Add platform listings for published books
    if (b.status === 'PUBLISHED') {
      const platCount = randomBetween(3, 5);
      for (let p = 0; p < platCount; p++) {
        await prisma.bookPlatformListing.create({
          data: {
            bookId: book.id,
            platform: PLATFORMS[p],
            externalUrl: `https://example.com/books/${book.bookId}`,
            isActive: true,
          },
        });
      }
    }
  }

  // 4. Create Sales & Royalty Records for published books
  console.log('\n💰 Creating sales & royalty records...');
  const quarters = ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024', 'Q1-2025'];

  for (const book of bookRecords) {
    if (!book.publicationDate) continue;

    for (const quarter of quarters) {
      const copies = randomBetween(20, 200);
      const grossRoyalty = copies * (book.authorRoyaltyPerCopy || 0);
      const isPaid = quarter !== 'Q1-2025';

      await prisma.royaltyRecord.create({
        data: {
          bookId: book.id,
          authorId: book.authorId,
          quarter,
          copiesSoldThisQuarter: copies,
          grossRoyalty,
          royaltyPaid: isPaid ? grossRoyalty : 0,
          royaltyPending: isPaid ? 0 : grossRoyalty,
          payoutStatus: isPaid ? 'PAID' : 'PENDING',
          payoutDate: isPaid ? new Date(2024, parseInt(quarter[1]) * 3 + 1, 15) : null,
        },
      });

      // Sales records per platform
      const platCount = randomBetween(2, 4);
      for (let p = 0; p < platCount; p++) {
        await prisma.salesRecord.create({
          data: {
            bookId: book.id,
            platform: PLATFORMS[p],
            copiesSold: Math.floor(copies / platCount),
            saleDate: new Date(2024, parseInt(quarter[1]) * 3, randomBetween(1, 28)),
            revenue: Math.floor((copies / platCount) * (book.mrp || 0)),
          },
        });
      }
    }
  }
  console.log('  ✓ Sales and royalty records created');

  // 5. Publishing Packages
  console.log('\n📦 Creating publishing packages...');
  const packages = [
    { name: 'BASIC', price: 3999000, stripePriceId: 'price_basic_placeholder' },
    { name: 'PREMIUM', price: 5499000, stripePriceId: 'price_premium_placeholder' },
    { name: 'PROFESSIONAL', price: 8999000, stripePriceId: 'price_professional_placeholder' },
  ] as const;

  for (const pkg of packages) {
    await prisma.publishingPackage.upsert({
      where: { id: pkg.name },
      update: {},
      create: {
        id: pkg.name,
        name: pkg.name as any,
        price: pkg.price,
        features: [],
        stripePriceId: pkg.stripePriceId,
      },
    });
    console.log(`  ✓ ${pkg.name} — ₹${(pkg.price / 100).toLocaleString('en-IN')}`);
  }

  // 6. Reviews
  console.log('\n⭐ Creating reviews...');
  for (const r of REVIEWS) {
    await prisma.review.create({
      data: {
        authorName: r.authorName,
        bookTitle: r.bookTitle,
        rating: r.rating,
        reviewText: r.text,
        source: r.source as any,
        isFeatured: r.rating === 5,
      },
    });
  }
  console.log(`  ✓ ${REVIEWS.length} reviews created`);

  // 7. Blog Posts
  console.log('\n📝 Creating blog posts...');
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        authorName: post.authorName,
        tags: post.tags,
        isPublished: true,
        publishedAt: new Date(2024, randomBetween(0, 11), randomBetween(1, 28)),
      },
    });
  }
  console.log(`  ✓ ${BLOG_POSTS.length} blog posts created`);

  // 8. Writing Challenge (always-open product)
  console.log('\n🏆 Creating writing challenge product...');
  const challenge = await prisma.writingChallenge.create({
    data: {
      title: '#TheWriteAngle — 21-Day Writing Challenge',
      price: 199900, // ₹1,999
      originalPrice: 499900, // ₹4,999
      durationDays: 21,
      status: 'ACTIVE',
      description: 'Challenge yourself to write a poem every day for 21 days. Get published in an anthology. Build your author profile.',
    },
  });
  console.log('  ✓ Writing challenge product created');

  // 9. Test Challenger account (pre-paid, for testing)
  console.log('\n🧪 Creating test challenger account...');
  const hashedChallengerPw = await bcrypt.hash('Challenge@123', 12);

  const challengerUser = await prisma.user.upsert({
    where: { email: 'challenger@bookleaf.dev' },
    update: {},
    create: {
      email: 'challenger@bookleaf.dev',
      name: 'Test Challenger',
      password: hashedChallengerPw,
      role: 'CHALLENGER',
      isVerified: true,
    },
  });

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + 21);

  const registration = await prisma.writingChallengeRegistration.create({
    data: {
      challengeId: challenge.id,
      userId: challengerUser.id,
      paymentStatus: 'PAID',
      personalStartDate: now,
      personalEndDate: endDate,
    },
  });

  // Add 3 sample poems so the dashboard has data
  for (let day = 1; day <= 3; day++) {
    await prisma.dailyPoem.create({
      data: {
        registrationId: registration.id,
        dayNumber: day,
        title: `Poem for Day ${day}`,
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: `This is a sample poem for day ${day} of the challenge.` }] }] },
        wordCount: 20 + day * 5,
        isDraft: false,
        submittedAt: new Date(now.getTime() + day * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('  ✓ Test challenger: challenger@bookleaf.dev / Challenge@123 (PAID, 3 poems written)');

  console.log('\n✅ Seed complete!\n');
  console.log('Login credentials:');
  console.log('  Admin:      admin@bookleaf.com / Admin@123');
  console.log('  Author:     priya@bookleaf.dev / Author@123');
  console.log('  Author:     arjun@bookleaf.dev / Author@123');
  console.log('  Challenger: challenger@bookleaf.dev / Challenge@123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
