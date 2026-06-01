/**
 * Application-wide constants.
 *
 * All monetary values are stored in **paise** (1 ₹ = 100 paise) to
 * eliminate floating-point arithmetic issues.
 */

// ---------------------------------------------------------------------------
// Genres (mirrors Prisma Genre enum)
// ---------------------------------------------------------------------------

/** Available book genres for categorisation and filtering. */
export const GENRES = [
  { label: 'Literary Fiction', value: 'LITERARY_FICTION' },
  { label: 'Non-Fiction', value: 'NON_FICTION' },
  { label: 'Self-Help', value: 'SELF_HELP' },
  { label: 'Romance', value: 'ROMANCE' },
  { label: 'Thriller', value: 'THRILLER' },
  { label: 'Poetry', value: 'POETRY' },
  { label: 'Historical Fiction', value: 'HISTORICAL_FICTION' },
  { label: 'Business', value: 'BUSINESS' },
  { label: 'Travel', value: 'TRAVEL' },
  { label: 'Memoir', value: 'MEMOIR' },
  { label: 'Humor', value: 'HUMOR' },
  { label: 'Parenting', value: 'PARENTING' },
  { label: 'Crime', value: 'CRIME' },
  { label: 'Contemporary Fiction', value: 'CONTEMPORARY_FICTION' },
  { label: 'Urdu Literature', value: 'URDU_LITERATURE' },
  { label: 'Other', value: 'OTHER' },
] as const;

export type Genre = (typeof GENRES)[number]['value'];

// ---------------------------------------------------------------------------
// Platforms (mirrors Prisma Platform enum)
// ---------------------------------------------------------------------------

/** Retail platforms where BookLeaf distributes titles. */
export const PLATFORMS = [
  { label: 'Amazon India', value: 'AMAZON_INDIA', icon: 'ShoppingCart' },
  { label: 'Flipkart', value: 'FLIPKART', icon: 'ShoppingBag' },
  { label: 'Amazon US', value: 'AMAZON_US', icon: 'Globe' },
  { label: 'Amazon UK', value: 'AMAZON_UK', icon: 'Globe' },
  { label: 'BookLeaf Store', value: 'BOOKLEAF_STORE', icon: 'BookOpen' },
] as const;

export type Platform = (typeof PLATFORMS)[number]['value'];

// ---------------------------------------------------------------------------
// Book statuses (mirrors Prisma BookStatus enum)
// ---------------------------------------------------------------------------

/** Book lifecycle statuses with display metadata. */
export const BOOK_STATUSES = [
  { label: 'Manuscript Received', value: 'MANUSCRIPT_RECEIVED', color: 'info' },
  { label: 'Editing', value: 'EDITING', color: 'warning' },
  { label: 'Cover Design', value: 'COVER_DESIGN', color: 'warning' },
  { label: 'Typesetting', value: 'TYPESETTING', color: 'warning' },
  { label: 'Proofreading', value: 'PROOFREADING', color: 'warning' },
  { label: 'ISBN Assignment', value: 'ISBN_ASSIGNMENT', color: 'info' },
  { label: 'Printing', value: 'PRINTING', color: 'info' },
  { label: 'Distribution Setup', value: 'DISTRIBUTION_SETUP', color: 'info' },
  { label: 'Published', value: 'PUBLISHED', color: 'success' },
  { label: 'Writing Challenge', value: 'WRITING_CHALLENGE_IN_PROGRESS', color: 'accent' },
] as const;

export type BookStatusValue = (typeof BOOK_STATUSES)[number]['value'];

// ---------------------------------------------------------------------------
// Publishing packages (prompt-confirmed pricing)
// ---------------------------------------------------------------------------

/**
 * Self-publishing packages offered to authors.
 * Prices in **paise**. Uses live site's detailed feature list with prompt pricing.
 */
export const PUBLISHING_PACKAGES = [
  {
    name: 'Basic' as const,
    price: 3999000, // ₹39,990
    features: [
      'ISBN assignment',
      'Basic cover design (1 concept)',
      'Editing up to 30,000 words',
      'Standard formatting & typesetting',
      'Digital distribution (3 platforms)',
      'Author dashboard access',
      'Live sales reports',
      '5 complimentary author copies',
      '100% royalty on author sales',
    ],
  },
  {
    name: 'Premium' as const,
    price: 5499000, // ₹54,990
    popular: true,
    features: [
      'ISBN assignment',
      'Professional cover design (2 concepts)',
      'Editing up to 50,000 words',
      'Professional formatting & typesetting',
      'Digital + Print distribution (5 platforms)',
      'Author dashboard access',
      'Live sales reports',
      '10 complimentary author copies',
      '100% royalty on author sales',
      'Author interview feature',
      'Social media marketing kit',
      'Dedicated publishing manager',
    ],
  },
  {
    name: 'Professional' as const,
    price: 8999000, // ₹89,990
    features: [
      'ISBN assignment',
      'Premium cover design (3 concepts)',
      'Editing up to 80,000 words',
      'Premium formatting & typesetting',
      'Global distribution (all platforms)',
      'Author dashboard access',
      'Live sales reports',
      '20 complimentary author copies',
      '100% royalty on author sales',
      'Author interview + video feature',
      'Full marketing campaign',
      'Press release distribution',
      'Book launch event support',
      'Dedicated senior publishing manager',
      'Priority support',
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Royalty policy (prompt-confirmed)
// ---------------------------------------------------------------------------

/** BookLeaf's standard royalty policy parameters. */
export const ROYALTY_POLICY = {
  /** Author's share of net revenue (percentage). */
  splitPercentage: 80,
  /** How often royalties are settled. */
  payoutCycle: 'quarterly' as const,
  /** Days after quarter-end before payout is issued. */
  payoutWindow: 45,
  /** Minimum accumulated amount before payout (in paise = ₹1,000). */
  minimumThreshold: 100_000,
} as const;

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** Public-facing navigation links. */
export const NAV_LINKS_PUBLIC = [
  { label: 'About', href: '/about' },
  { label: 'Get Published', href: '/get-published' },
  { label: 'Writing Challenge', href: '/writing-challenge' },
  { label: 'Bookstore', href: '/bookstore' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Author dashboard navigation links. */
export const NAV_LINKS_AUTHOR = [
  { label: 'Dashboard', href: '/author/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Books', href: '/author/books', icon: 'BookOpen' },
  { label: 'Royalties', href: '/author/royalties', icon: 'IndianRupee' },
  { label: 'Analytics', href: '/author/analytics', icon: 'BarChart3' },
  { label: 'Support', href: '/author/support', icon: 'HelpCircle' },
  { label: 'Settings', href: '/author/settings', icon: 'Settings' },
] as const;

/** Admin panel navigation links. */
export const NAV_LINKS_ADMIN = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Books', href: '/admin/books', icon: 'BookOpen' },
  { label: 'Authors', href: '/admin/authors', icon: 'Users' },
  { label: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
  { label: 'Royalties', href: '/admin/royalties', icon: 'IndianRupee' },
  { label: 'Support Tickets', href: '/admin/tickets', icon: 'Ticket' },
  { label: 'Blog', href: '/admin/blog', icon: 'FileText' },
  { label: 'Reports', href: '/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

// ---------------------------------------------------------------------------
// Social & contact (from live site research)
// ---------------------------------------------------------------------------

/** Social media profile links. */
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/bookleafpublishing', icon: 'Instagram' },
  { label: 'Facebook', href: 'https://facebook.com/bookleafpublishing', icon: 'Facebook' },
  { label: 'Twitter / X', href: 'https://x.com/bookleafpublishing', icon: 'Twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/bookleafpublishing', icon: 'Linkedin' },
  { label: 'YouTube', href: 'https://youtube.com/@bookleafpublishing', icon: 'Youtube' },
] as const;

/** Physical office addresses (from live site). */
export const OFFICE_ADDRESSES = [
  {
    name: 'Global HQ',
    line1: '30 N Gould St Ste R',
    line2: 'Sheridan, WY 82801',
    country: 'United States',
  },
  {
    name: 'India Head Office',
    line1: 'New Delhi',
    line2: 'Delhi, India',
    country: 'India',
  },
  {
    name: 'Kashmir Office',
    line1: 'Srinagar',
    line2: 'Jammu & Kashmir, India',
    country: 'India',
  },
] as const;

/** Customer support availability (from live site). */
export const SUPPORT_HOURS = {
  weekdays: '10:00 AM – 6:00 PM IST',
  saturday: '11:00 AM – 3:00 PM IST',
  sunday: 'Closed',
  email: 'helpdesk@bookleafpub.in',
  whatsapp: true,
  responseTime: 'Within 24 hours on business days',
} as const;

// ---------------------------------------------------------------------------
// Trust signals (from live site)
// ---------------------------------------------------------------------------

/** Homepage trust signal stats. */
export const TRUST_STATS = [
  { label: 'Authors', value: '12,000+' },
  { label: 'Books Published', value: '12,000+' },
  { label: 'Countries', value: '150+' },
  { label: 'Copies Sold', value: '1M+' },
  { label: 'Google Reviews', value: '3,700+' },
] as const;

// ---------------------------------------------------------------------------
// Writing Challenge
// ---------------------------------------------------------------------------

/** Writing challenge pricing (from prompt). */
export const WRITING_CHALLENGE = {
  name: '#TheWriteAngle',
  duration: 21, // days
  price: 199900, // ₹1,999 in paise
  originalPrice: 499900, // ₹4,999 in paise
  description: '21-Day Writing Challenge — Write and publish your book with daily guidance and AI feedback.',
} as const;
