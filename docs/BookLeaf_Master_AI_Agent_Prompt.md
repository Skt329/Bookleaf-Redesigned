# BookLeaf Publishing — Full-Stack Rebuild: Master AI Agent Planning Prompt

> **Purpose:** This document is a complete, phase-by-phase natural language prompt for an AI coding agent to plan and build the BookLeaf Publishing platform from scratch. It replaces the current fragmented Wix/Bubble/Freshdesk/Razorpay patchwork with a single, production-grade Next.js application.

---

## CONTEXT: What Is Being Built And Why

BookLeaf Publishing (bookleafpub.in) is an Indian self-publishing startup that has appeared on Shark Tank India. They help authors publish paperback and eBook titles, handle distribution across Amazon India, Flipkart, Amazon US/UK, and their own store, and manage royalties on an 80/20 profit split. Their community is 55,000+ writers. They process 1,200+ books monthly.

**The Problem With The Current Website:**
The existing website is a Wix frontend with half a dozen bolted-on third-party tools. The bookstore is a single button that redirects to an entirely different domain (ebooks.bookleafpub.com) with no cart, no search, no filtering, no proper book pages. Author support is routed to Freshdesk (external). Payments for the writing challenge go through Razorpay links pasted directly in the page. There is no author dashboard, no real royalty portal, no admin control panel, no AI anywhere. The entire experience is fragmented, unmemorable, and unscalable.

**What We Are Building:**
A single, unified, production-grade platform on Next.js that consolidates every touchpoint: public marketing site, full e-commerce bookstore, author portal, admin command center, writing challenge with AI canvas, AI-powered ticket management system, automated royalty tracking and notification system, and Stripe payment integration throughout. This is not a prototype. Every feature should be deployable and investor-presentable.

---

## TECH STACK DECISION (Justify every choice)

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Full-stack in one repo, RSC for SEO, API routes for backend, file-based routing maps perfectly to this multi-portal architecture |
| Language | TypeScript | Type safety critical at this scale; prevents runtime errors in royalty calculations and payment flows |
| Database | PostgreSQL via Supabase | Supabase gives Postgres + Row Level Security (author data isolation) + real-time subscriptions (ticket updates) + file storage (book covers, manuscripts) in one managed service |
| ORM | Prisma | Type-safe queries, great migration workflow, prisma studio for data inspection during dev |
| Auth | NextAuth.js v5 (Auth.js) | Supports role-based sessions (AUTHOR, ADMIN), email/password + social providers, integrates cleanly with Prisma adapter |
| Payments | Stripe | International cards, INR support, webhooks for reliable payment confirmation, subscriptions for publishing packages |
| AI/LLM | Anthropic Claude API (claude-haiku-4-5 for classification/drafts, claude-sonnet-4-6 for royalty summaries and complex generation) | Cost-efficient at scale, superior instruction-following for structured outputs |
| Email | Resend + React Email | Programmatic transactional emails with beautiful HTML templates; AI-generated royalty notifications sent via this |
| Real-time | Supabase Realtime | WebSocket-based ticket update subscriptions without a separate service |
| Background Jobs | Inngest (or pg-boss) | Durable background functions for royalty calculation jobs, bulk email triggers, AI processing queues |
| File Storage | Supabase Storage | Book covers, manuscript uploads, publishing certificates |
| UI | Tailwind CSS + shadcn/ui | Utility-first with accessible headless components; customised heavily to avoid the generic shadcn look |
| State | Zustand (client) + TanStack Query (server) | Zustand for cart, TanStack Query for all server-data fetching with caching |
| Rich Text Editor | Tiptap | For the 21-day writing challenge canvas — extensible, headless, works with React |
| Search | Postgres full-text search (first) → Algolia (later) | Start with pg FTS for the bookstore; migrate to Algolia when catalog exceeds 10k books |
| Deployment | Vercel (frontend + API) + Supabase (database + storage) | Zero-config deploys, edge functions, preview URLs for every PR |
| Monitoring | Sentry (errors) + Vercel Analytics | Production error tracking and performance monitoring |

---

## DATABASE SCHEMA (Prisma models — agent should implement these exactly)

The agent must design the PostgreSQL schema with the following entities and relationships. All money values stored in paise (integer) to avoid floating-point errors.

**Core Entities:**

```
User
  - id (cuid)
  - email (unique)
  - password (hashed, bcrypt)
  - name
  - phone
  - city
  - role: AUTHOR | ADMIN | READER
  - avatar_url
  - bio
  - joined_date
  - is_verified (boolean)
  - stripe_customer_id (for readers who buy books)
  - created_at, updated_at

Author (extends User, one-to-one)
  - author_id (bookleaf internal ID like AUTH001)
  - pen_name (optional)
  - author_bio (rich text)
  - social_links (JSON: { instagram, twitter, website })
  - bank_account_details (encrypted JSON: { account_number, ifsc, bank_name })
  - publishing_package: BASIC | PREMIUM | PROFESSIONAL | WRITING_CHALLENGE
  - total_royalty_earned (integer, paise)
  - total_royalty_paid (integer, paise)

Book
  - id (cuid)
  - book_id (internal ID like BK001)
  - author_id (FK to Author)
  - title
  - isbn
  - genre (enum: LITERARY_FICTION | NON_FICTION | SELF_HELP | ROMANCE | THRILLER | POETRY | HISTORICAL_FICTION | BUSINESS | TRAVEL | MEMOIR | HUMOR | PARENTING | CRIME | CONTEMPORARY_FICTION | URDU_LITERATURE | OTHER)
  - description (rich text)
  - cover_image_url
  - publication_date
  - status: MANUSCRIPT_RECEIVED | EDITING | COVER_DESIGN | TYPESETTING | PROOFREADING | ISBN_ASSIGNMENT | PRINTING | DISTRIBUTION_SETUP | PUBLISHED | WRITING_CHALLENGE_IN_PROGRESS
  - mrp (integer, paise)
  - author_royalty_per_copy (integer, paise)
  - print_partner: IN_HOUSE | REPRO_INDIA | EPITOME_BOOKS
  - language: ENGLISH | HINDI
  - page_count
  - is_ebook_available (boolean)
  - is_paperback_available (boolean)
  - is_featured (boolean, admin-controlled)
  - writing_challenge_id (FK, optional — if this book came from a writing challenge)
  - created_at, updated_at

BookPlatformListing
  - id
  - book_id (FK)
  - platform: AMAZON_INDIA | FLIPKART | AMAZON_US | AMAZON_UK | BOOKLEAF_STORE
  - external_url
  - is_active

RoyaltyRecord
  - id
  - book_id (FK)
  - author_id (FK)
  - quarter (e.g., "Q3-2025")
  - copies_sold_this_quarter (integer)
  - gross_royalty (integer, paise)
  - royalty_paid (integer, paise)
  - royalty_pending (integer, paise)
  - payout_date (nullable)
  - payout_status: PENDING | PAID | OVERDUE
  - created_at

SalesRecord
  - id
  - book_id (FK)
  - platform
  - copies_sold (integer)
  - sale_date
  - revenue (integer, paise)

Order (Bookstore purchases)
  - id
  - order_number (human-readable, e.g., BL-2025-001234)
  - customer_id (FK to User)
  - status: PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
  - total_amount (integer, paise)
  - shipping_address (JSON)
  - stripe_payment_intent_id
  - stripe_payment_status
  - tracking_number (nullable)
  - created_at, updated_at

OrderItem
  - id
  - order_id (FK)
  - book_id (FK)
  - quantity
  - unit_price (integer, paise)
  - book_type: PAPERBACK | EBOOK

Cart (server-side cart for logged-in users, localStorage for guests)
  - id
  - user_id (FK, nullable for guest)
  - session_id (for guest carts)
  - items (JSON array of { book_id, quantity, book_type })
  - updated_at

SupportTicket
  - id
  - ticket_number (e.g., TKT-2025-0042)
  - author_id (FK)
  - book_id (FK, nullable — "General / Account Level" queries)
  - subject
  - description (rich text)
  - category: ROYALTY_PAYMENTS | ISBN_METADATA | PRINTING_QUALITY | DISTRIBUTION | BOOK_STATUS | GENERAL
  - ai_suggested_category (same enum)
  - priority: CRITICAL | HIGH | MEDIUM | LOW
  - ai_suggested_priority (same enum)
  - status: OPEN | IN_PROGRESS | RESOLVED | CLOSED
  - assigned_admin_id (FK to User, nullable)
  - ai_draft_response (text, nullable — the AI-generated draft)
  - attachment_urls (JSON array)
  - created_at, updated_at

TicketMessage
  - id
  - ticket_id (FK)
  - sender_id (FK to User)
  - sender_role: AUTHOR | ADMIN
  - content (rich text)
  - is_internal_note (boolean — admin-only notes)
  - created_at

NotificationLog
  - id
  - author_id (FK)
  - notification_type: ROYALTY_SUMMARY | TICKET_RESPONSE | BOOK_STATUS_UPDATE | GENERAL
  - subject
  - email_body (text — the actual AI-generated email content)
  - status: PENDING | SENT | FAILED
  - sent_at (nullable)
  - error_message (nullable)
  - triggered_by_admin_id (FK, nullable)

WritingChallenge
  - id
  - title (e.g., "#TheWriteAngle - May 2026")
  - start_date
  - end_date
  - registration_deadline
  - price (integer, paise) — e.g., 199900 (₹1,999)
  - original_price (integer, paise) — for showing strikethrough
  - max_slots (integer)
  - slots_remaining (integer)
  - status: UPCOMING | REGISTRATION_OPEN | IN_PROGRESS | COMPLETED
  - description (rich text)

WritingChallengeRegistration
  - id
  - challenge_id (FK)
  - author_id (FK to User)
  - payment_status: PENDING | PAID | REFUNDED
  - stripe_payment_intent_id
  - registered_at
  - completed_challenge (boolean)
  - book_published (boolean)
  - grace_period_ends (nullable)

DailyPoem
  - id
  - registration_id (FK)
  - day_number (1-21, or up to 28 with grace period)
  - title
  - content (rich text — Tiptap JSON)
  - word_count
  - ai_feedback (text, nullable)
  - ai_suggestions (text, nullable)
  - submitted_at (nullable)
  - last_saved_at
  - is_draft (boolean)

PublishingPackage
  - id
  - name: BASIC | PREMIUM | PROFESSIONAL
  - price (integer, paise)
  - features (JSON array of feature strings)
  - stripe_price_id

PackagePurchase
  - id
  - author_id (FK)
  - package_id (FK)
  - stripe_payment_intent_id
  - stripe_session_id
  - status: PENDING | PAID | REFUNDED
  - purchased_at

BlogPost
  - id
  - title
  - slug (unique)
  - content (rich text)
  - cover_image_url
  - author_name
  - tags (string array)
  - is_published
  - published_at

Review
  - id
  - author_name
  - author_image_url
  - book_title (nullable)
  - rating (1-5)
  - review_text
  - source: GOOGLE | VIDEO | INTERNAL
  - video_url (nullable)
  - is_featured
  - created_at
```

---

## PHASE STRUCTURE (Build in this exact order)

The platform is split into **6 phases**. Each phase is independently deployable. Never attempt more than one phase at a time.

---

## PHASE 1: Foundation, Auth, and Public Marketing Site

**Goal:** Get the Next.js project up with auth, database, and the public-facing marketing pages. This is the skeleton on which everything else is built.

**Deliverables:**

### 1.1 Project Setup
Initialize a Next.js 14+ project with TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier. Set up the following folder structure inside `src/`:
```
app/
  (public)/         — unauthenticated public pages
  (author)/         — author portal (protected)
  (admin)/          — admin portal (protected)
  api/              — API route handlers
components/
  ui/               — shadcn/ui primitives
  shared/           — shared across portals (Navbar, Footer, etc.)
  public/           — marketing page components
  author/           — author portal components
  admin/            — admin portal components
  bookstore/        — e-commerce components
lib/
  prisma.ts         — Prisma client singleton
  auth.ts           — NextAuth config
  stripe.ts         — Stripe client
  ai.ts             — Anthropic SDK wrapper
  resend.ts         — Email client
  utils.ts          — Shared utilities
hooks/              — Custom React hooks
types/              — TypeScript type definitions
constants/          — App constants (genres, platforms, etc.)
```

Set up environment variables for: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Set up Prisma with the complete schema above. Run initial migrations. Seed the database with the provided `bookleaf_sample_data.json` (10 authors, 18 books with all royalty and sales data).

### 1.2 Design System
Define the BookLeaf design system in `tailwind.config.ts` and CSS variables. The aesthetic direction is **editorial luxury meets indie publishing** — warm cream backgrounds, deep forest green as the primary brand color, burnt gold as the accent, a serif display font (Playfair Display) for headings, and a clean humanist sans-serif (DM Sans) for body text. Avoid the generic startup blue-and-white look entirely.

Color tokens:
- `--brand-primary`: deep forest green #1a3c2e
- `--brand-accent`: warm gold #c9a84c
- `--brand-cream`: off-white #f9f5ef
- `--brand-dark`: near-black #0d1f17
- `--surface-card`: #ffffff with subtle warm shadow
- `--text-primary`: #1a1a1a
- `--text-muted`: #6b7280
- `--success`: #16a34a
- `--warning`: #d97706
- `--danger`: #dc2626

Typography scale: Use Playfair Display (via next/font/google) for h1-h3, DM Sans for body, ui-mono for code.

### 1.3 Authentication System
Implement NextAuth.js with:
- Email/password credentials provider with bcrypt hashing
- Role-based session (role stored in JWT: AUTHOR | ADMIN | READER)
- Middleware at `src/middleware.ts` protecting `/author/*` routes (AUTHOR or ADMIN) and `/admin/*` routes (ADMIN only)
- Sign-in page at `/login` with separate redirects: authors → `/author/dashboard`, admins → `/admin/dashboard`, readers → `/` (home)
- Sign-up page at `/signup` — creates a User + Author record, assigns AUTHOR role
- Password reset flow via email (Resend)
- Session provider wrapping the app layout

### 1.4 Public Marketing Pages

Build these pages under `app/(public)/`:

**Homepage (`/`)**
Hero section with animated text: "Publishing Made Easy." Prominent CTA button "Publish My Book" and secondary "Explore Bookstore". Show the trust signals: 3,700+ Google reviews (marquee), 12,000+ authors, Shark Tank India badge, 55K+ community, 150+ countries. Stats counter animation on scroll (55K community, 12K books, 1M copies, 150 countries). Services overview: Faster publishing, Unbeatable pricing, Live sales reports, 100% royalty. Publishing packages pricing section (Basic ₹39,990 / Premium ₹54,990 / Professional ₹89,990) with feature comparison table and Stripe checkout buttons. Distribution channel logos: Amazon India, Flipkart, Amazon US, Amazon UK, BookLeaf Store. Bestseller showcase (grid of book covers). Video testimonials carousel (YouTube embeds). "Our Book Launches" section — highlight the Rashtrapati Bhavan launch prominently. Lead capture form: Name, Email, Phone — integrates with Resend to send an inquiry notification to admin. Royalty Calculator widget (inline, not redirecting).

**About Page (`/about`)**
Company history, mission, team. Office addresses (Delhi and US). Stats timeline. Featured media logos. What makes BookLeaf different section. The Shark Tank India story.

**Get Published Page (`/get-published`)**
Detailed breakdown of each publishing package. Step-by-step publishing process (8 stages: Manuscript Received → Published & Live). FAQ accordion. "Start Publishing" buttons that trigger the Stripe Checkout for the chosen package.

**Writing Challenge Page (`/writing-challenge`)**
This is a full landing page for #TheWriteAngle. It must include: animated hero with urgency (countdown timer to registration deadline, slots remaining counter from database). Benefits of the challenge (6 bullet points with icons). How it works (step-by-step flow). "Join Now" CTA with Stripe payment integration for ₹1,999. Previous batch book launches (the Rashtrapati Bhavan event, Shashi Tharoor event, Ankur Warikoo event). Author testimonial carousel. FAQ accordion (with the same questions from the existing site). Pricing block with strikethrough from ₹12,500 to ₹1,999. If a user is already registered for the active challenge, the button changes to "Go to My Writing Portal."

**Royalty Calculator Page (`/royalty-calculator`)**
Interactive calculator. Inputs: Book MRP (slider/input), Platform selected (Amazon/Flipkart/BookLeaf store), Estimated monthly copies sold. Outputs: Per-copy royalty, Monthly earnings, Annual earnings at that rate. Use BookLeaf's formula: Net profit = MRP - printing cost (estimated at 40% of MRP for simplicity, or let users input) - platform commission (Amazon 35%, Flipkart 30%, BookLeaf 0%) - shipping (₹0 for ebook, ₹60 per unit paperback). Author earns 80% of net profit. Show a nice animated donut chart of the split. Include disclaimer text about estimations.

**Bookstore Landing Page (`/bookstore`)**
This is just the public entry point. It renders the bookstore component (see Phase 2).

**Blog (`/blog`)**
Grid of blog posts fetched from the BlogPost table. Each card shows cover image, title, author, date, tags, excerpt. Clicking opens the full post.

**Blog Post (`/blog/[slug]`)**
Full rich-text article render. Related posts. Social share buttons.

**FAQ Page (`/faq`)**
Accordion FAQ. Questions sourced from BookLeaf's existing FAQ and the knowledge base in the assignment. Grouped by category: Royalties, Publishing Process, ISBN, Distribution, Payments, Writing Challenge.

**Contact Page (`/contact`)**
Contact form (Name, Email, Subject, Message) → submits to the SupportTicket table if the user is logged in, otherwise sends email via Resend. Three office addresses shown on a map embed. Social media links.

**Reviews Page (`/reviews`)**
Grid of testimonials from the Review table. Star ratings. YouTube video testimonials embedded. Filter by type (video/text).

**Careers Page (`/careers`)**
Static page with job openings list and application form.

**Privacy & Refund Policy (`/privacy-policy`)**
Legal text page.

### 1.5 Shared Components
Build: `<Navbar>` (sticky, with mobile hamburger, shows Login/Signup for unauthenticated users, shows avatar dropdown with role-appropriate links for logged-in users), `<Footer>` (four-column: links, contact, social media, newsletter signup), `<Toast>` notification system (success/error/info), `<LoadingSpinner>`, `<EmptyState>`, `<ErrorBoundary>`, `<PageHeader>` (breadcrumb + title), `<Badge>` (for status chips — green/yellow/red).

---

## PHASE 2: Full E-Commerce Bookstore

**Goal:** Build the complete bookstore experience — catalog browsing, book detail pages, cart, checkout with Stripe, order tracking, and guest checkout.

**Context:** The current bookstore is literally a single button redirecting to another domain. We are replacing this with a full Amazon-like experience tailored to literary publishing.

### 2.1 Bookstore Catalog (`/bookstore`)
The main bookstore page renders a left sidebar + right grid layout.

**Left Sidebar — Filters Panel:**
- Search bar (live full-text search using Postgres `tsvector`, debounced 300ms)
- Genre filter (multi-select checkboxes from the Genre enum)
- Format filter (Paperback / eBook / Both)
- Price range slider (₹0 to ₹1,000)
- Platform availability filter (Amazon India / Flipkart / Amazon US / Amazon UK / BookLeaf Store)
- Sort by: Newest, Bestselling, Price Low-High, Price High-Low, Author Name A-Z
- "Clear All Filters" button
- Active filter chips displayed above results

**Right Content Area:**
- Results count ("Showing 42 of 156 books")
- Grid/List view toggle
- Book cards (in grid): Cover image (high quality, lazy-loaded), Title, Author name (linked to author profile), Genre badge, MRP, Copies sold (social proof), "Add to Cart" button, "Wishlist" heart icon
- Pagination (12 books per page with infinite scroll option)
- "Featured Books" horizontal carousel at top of page (books where is_featured = true)
- "New Arrivals" section: Last 30 days of publications
- "Genre Collections": Horizontal scroll rows per genre (Fiction, Poetry, Self-Help, etc.)

**API Route:** `GET /api/bookstore/books` with query params: `search`, `genres[]`, `formats[]`, `minPrice`, `maxPrice`, `platforms[]`, `sortBy`, `page`, `limit`. Returns paginated results with total count.

### 2.2 Book Detail Page (`/bookstore/books/[id]`)
Layout similar to an Amazon product page but with literary design sensibility.

Left column: High-resolution book cover (with zoom on hover). Multiple angles if available. "Available as Paperback and eBook" toggle.

Right column:
- Book title (Playfair Display, large)
- Author name with link to author profile page
- Star rating + review count (if reader reviews are implemented)
- MRP prominently displayed
- Format selector: Paperback | eBook (price may differ)
- Quantity selector (for paperback)
- "Add to Cart" (primary CTA, prominent)
- "Buy Now" (secondary — skips cart, goes straight to Stripe checkout)
- Delivery estimate: "Ships within 5-7 business days from Delhi warehouse"
- Available on: Platform logos (Amazon, Flipkart, BookLeaf Store, etc.) with external links
- Social share buttons

Below the fold:
- "About This Book" — full description (rich text)
- Book details: ISBN, Genre, Pages, Publication Date, Print Partner
- "About the Author" card with avatar, bio, and link to author profile
- "More Books by This Author" carousel
- "You May Also Like" — books in the same genre (exclude current)
- Reader Reviews section (if implemented — Phase 6 scope)

**API Route:** `GET /api/bookstore/books/[id]` — returns full book data with author info and similar books.

### 2.3 Author Profile Page (`/bookstore/authors/[id]`)
Public-facing author page. Not the author's own dashboard — this is for readers browsing.
- Author photo, name, bio, city
- Social media links
- All published books in a grid
- Reading stats: Total copies sold, Books published (to build credibility)

### 2.4 Cart System
- Cart is stored in Zustand on the client and synced to the server Cart table for logged-in users
- Guest cart: `localStorage` with a session_id cookie; merged into user cart on login
- Cart drawer (slides in from the right) shows: Item list with book cover thumbnail, title, format (Paperback/eBook), quantity control (+/-), unit price, subtotal per item, remove button. Subtotal + estimated shipping (₹60/book paperback, ₹0 eBook). "Proceed to Checkout" CTA.
- Cart icon in navbar shows item count badge
- "Save for Later" functionality
- "You might also like" suggestion in cart drawer (2 books)

**API Routes:**
- `POST /api/cart/add` — add item
- `DELETE /api/cart/remove` — remove item
- `PATCH /api/cart/update` — update quantity
- `GET /api/cart` — get current cart

### 2.5 Checkout Flow (`/bookstore/checkout`)
Multi-step checkout:

**Step 1 — Cart Review:** Final review of items before payment. Edit quantities. Show promo code field (optional for Phase 2, implement in Phase 6).

**Step 2 — Delivery Details (for Paperback):** Shipping address form: Name, Phone, Address Line 1, Address Line 2, City, State, Pincode, Country (default India). Save address for future use (logged-in users). Address validation. For eBook-only orders, skip this step.

**Step 3 — Payment:** Integrate Stripe Checkout (redirect to Stripe-hosted page OR Stripe Elements for in-page experience). Accept: Debit/Credit cards, UPI (Stripe supports UPI for India), NetBanking. Show order summary on the right side throughout checkout.

**Step 4 — Confirmation (`/bookstore/orders/[orderId]/confirmation`):** Order placed successfully screen. Order number. Expected delivery date. "Continue Shopping" and "Track Order" buttons. Trigger confirmation email via Resend.

**Stripe Webhook Handler (`/api/webhooks/stripe`):** Handle `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`. On success: create Order record with status CONFIRMED, create OrderItems, send confirmation email, update inventory counts.

### 2.6 Order Management (Reader/Customer)
- My Orders page (accessible for logged-in readers/authors at `/account/orders`)
- Order detail page: timeline showing status updates (Confirmed → Processing → Shipped → Delivered), tracking number field when available, download eBook link for digital purchases, invoice download (PDF)

### 2.7 Admin Bookstore Management
(Covered in Phase 5 Admin Portal, but mention here for context): Admins can add/edit/delete books, set cover images, manage featured status, update inventory, add tracking numbers to orders.

---

## PHASE 3: Author Portal (Dashboard + Royalties + Books)

**Goal:** Build the complete author-facing portal where registered authors can see their books, track royalties, view sales, and manage their profile.

**Route group:** `app/(author)/` — protected by middleware, only AUTHOR or ADMIN role can access.

### 3.1 Author Dashboard (`/author/dashboard`)
Landing page after author login. Personalized greeting: "Welcome back, [First Name] 👋"

**Summary Cards Row:**
- Total Books Published (green) + Books in Production (yellow)
- Total Royalties Earned (all time, formatted: ₹1,23,456)
- Royalties Paid (green check icon)
- Royalties Pending (orange warning icon — pulse animation if overdue)

**Charts Section:**
- Monthly sales trend line chart (last 12 months, per-book or aggregated toggle)
- Revenue by platform donut chart (Amazon vs Flipkart vs BookLeaf Store)
- Both charts built with Recharts

**Recent Activity Feed:**
- Last 5 sales events
- Royalty payout received
- Book status update
- Support ticket response received

**Quick Actions:**
- "Submit a Support Ticket"
- "View My Royalties"
- "Update My Author Profile"
- "Go to Writing Challenge" (if registered)

**Notification Banner:** If any royalties are overdue (pending amount + last payout > 90 days ago OR never paid on a 90+ day old published book), show a prominent red banner: "You have overdue royalties for [X] books. Contact support."

### 3.2 My Books Page (`/author/books`)
Table + card view toggle. Each book row/card shows:
- Cover thumbnail
- Title (linked to public bookstore page)
- ISBN
- Genre badge
- Publication date (or "In Production" if not yet published)
- Status chip (color-coded: green = Published & Live, yellow = In Production stages, blue = Distribution Setup)
- MRP
- Platform availability icons (Amazon, Flipkart, BookLeaf store icons)
- Quick action: "View Royalties" → links to royalty detail for that book

For books In Production, show a progress stepper: Manuscript Received → Editing → Cover Design → Typesetting → Proofreading → ISBN Assignment → Printing → Distribution Setup → Published. Highlight current stage.

**Empty State:** If author has no books yet, show a friendly illustration and "Your publishing journey starts here. [Start Publishing]" CTA.

### 3.3 Royalty Overview Page (`/author/royalties`)
This is the core financial page. Two tabs: **By Book** and **Summary**.

**By Book Tab:**
For each published book, show a card:
- Book title and cover
- Total Copies Sold
- Total Royalty Earned: ₹XX,XXX
- Royalty Paid: ₹XX,XXX (green)
- Royalty Pending: ₹X,XXX (orange or red based on overdue logic)
- Last Payout Date (or "Never paid" in red if applicable)
- Royalty Status Badge: Three states:
  - **Green — Fully Paid**: `royalty_pending === 0`
  - **Yellow — Pending (On Cycle)**: pending amount exists, last payout within 90 days — "Expected next payout: [calculate next quarter end + 45 days]"
  - **Red — Overdue**: pending amount exists AND (last payout > 90 days ago OR never paid AND book published > 90 days ago)
- Quarterly breakdown accordion: Click to expand and see per-quarter sales and royalty breakdown in a mini table

**Summary Tab:**
- Total Earned across all books: ₹X,XX,XXX
- Total Paid: ₹X,XX,XXX
- Total Pending: ₹XX,XXX
- Pending percentage visual (horizontal bar)
- Next Expected Payout: Calculate based on quarterly cycle (Q1: Jan–Mar paid by May 15, Q2: Apr–Jun paid by Aug 15, Q3: Jul–Sep paid by Nov 15, Q4: Oct–Dec paid by Feb 15)
- Download Royalty Statement button (PDF — generate a nice formatted PDF with all royalty data using a PDF library like @react-pdf/renderer)

### 3.4 Sales Reports Page (`/author/sales`)
- Sales table: Date, Book, Platform, Copies Sold, Revenue
- Filterable by: book, platform, date range
- Export to CSV functionality
- Chart: Sales volume by month per platform (stacked bar chart)
- Chart: Best-selling book comparison (horizontal bar chart)

**Note:** BookLeaf claims "Live Sales Report" — notify authors every time a copy sells. Implement this with a Supabase Realtime subscription on the SalesRecord table. When a new record is inserted for an author's book, the author's dashboard shows a toast notification: "🎉 Someone just bought [Book Title] on Amazon India!"

### 3.5 Author Profile Page (`/author/profile`)
- Edit: Name, Pen Name, City, Bio (Tiptap rich text editor, 500 word limit), Avatar upload (Supabase Storage), Social media links
- View: Publishing Agreement status
- Bank Account Details section: Encrypted stored fields for payout (Account number, IFSC, Bank name). Show masked (XXXXX1234). Edit with password confirmation.
- Change Password form

### 3.6 Author Support Tickets (`/author/tickets`)
This implements Assignment 1's author-facing ticket system.

**My Tickets List:**
Table showing all tickets submitted by this author. Columns: Ticket Number, Subject, Category, Priority badge, Status chip (Open=blue/In Progress=yellow/Resolved=green/Closed=gray), Created Date, Last Updated.

Click a ticket to open the **Ticket Detail View:**
- Ticket header: Number, Status, Priority, Category
- Original message (with timestamp)
- Message thread below (author and admin messages in chat-bubble style, color-coded by sender)
- Internal notes NOT shown to author
- "Add Reply" text area at bottom for author to add follow-up
- Real-time updates: Supabase Realtime subscription on TicketMessage — when admin posts a response, the author sees it appear without refresh

**Submit New Ticket (`/author/tickets/new`):**
Form with:
- Book selector dropdown: "General / Account Level" option + list of author's books
- Subject field
- Category (auto-selected after AI classification, but author can override)
- Description (Tiptap rich text, 1000 char limit)
- Optional attachment (UI with Supabase Storage upload — actually functional)
- Submit button

On submit:
1. Create SupportTicket record with status OPEN
2. Trigger AI classification asynchronously (background job): Call Claude API with the ticket subject + description + Knowledge Base context. Ask it to return JSON with `{ category: string, priority: string, reasoning: string }`. Store the AI suggestions in `ai_suggested_category` and `ai_suggested_priority`.
3. Send confirmation email to author via Resend: "We've received your ticket #TKT-XXXX..."
4. Return success response immediately — don't block on AI

---

## PHASE 4: AI Ticket Management System (Admin Ticket View)

**Goal:** The admin side of the support system. This is Assignment 1 fully implemented. The AI classifies, prioritizes, and drafts responses; the admin reviews and sends.

**Route:** `app/(admin)/admin/tickets/`

### 4.1 Ticket Queue (`/admin/tickets`)
Master inbox for all support tickets from all authors.

**Header Stats:**
- Total Open: XX | In Progress: XX | Overdue (>48 hours no response): XX in red
- Quick filters: All | Mine | Unassigned | Critical

**Filters Panel:**
- Status: Open / In Progress / Resolved / Closed
- Priority: Critical / High / Medium / Low
- Category: All 6 categories
- Author: search by name or ID
- Date range
- Assigned to: Unassigned / Me / [Admin name]
- Sort: Newest first / Oldest first / Priority (Critical first) / Last updated

**Ticket Table:**
Columns: Ticket # | Author (with avatar) | Book (or "General") | Subject | Category badge | Priority badge | Status | Created | Last Activity | Assigned To | Actions

Priority badges must be immediately visually scannable: Critical = bright red pulsing dot, High = orange, Medium = yellow, Low = gray.

Urgency indicator: Tickets older than 48 hours with no response get a flashing "Overdue" chip.

**Bulk Actions:** Select multiple tickets → Assign to me / Change status / Change priority.

### 4.2 Ticket Detail View (`/admin/tickets/[id]`)
Three-column layout: Left sidebar (ticket metadata), Center (message thread), Right (AI panel).

**Left Sidebar:**
- Author name (link to author detail in admin)
- Author email and phone
- Book concerned (with mini-card showing royalty status)
- Ticket status dropdown (admin can update)
- Priority dropdown (admin can update)
- Category (admin can override AI suggestion — show both AI suggestion and current)
- Assigned admin (dropdown to assign)
- Created date, last updated
- Internal Notes section (text area, "Add Note" — not visible to author)

**Center — Message Thread:**
- Original query with author avatar, timestamp
- Each subsequent message (author or admin) in chronological order, styled as a clean chat thread
- Admin messages shown with "BookLeaf Team" label
- Internal notes clearly differentiated (gray background, "Internal Note" label)
- Reply box at bottom: Rich text editor (Tiptap), send button
- On send: creates TicketMessage record, triggers Supabase Realtime event (author sees it), sends email notification to author via Resend

**Right — AI Panel:**
This is the key differentiator for this assignment.

- **AI Classification Review:** Shows AI's suggested category and priority with confidence reasoning. "Accept AI Suggestion" or "Override" buttons.
- **AI-Drafted Response:** A card showing the AI-generated draft response based on:
  - The ticket content
  - The author's book and royalty data (fetched and injected into the prompt)
  - The full BookLeaf Knowledge Base (system prompt)
  - Few-shot examples from the assignment's sample responses
  The draft is shown in a read-only Tiptap viewer. "Use This Draft" button copies it into the reply box. "Regenerate" button calls the AI again.
- **Relevant Knowledge Base Snippets:** Show which KB sections are most relevant to this query (parsed from the AI's reasoning).
- **Author History:** Quick summary: How many tickets has this author raised before? Average resolution time?

**AI Prompt Strategy for Response Generation:**
```
System: You are a BookLeaf Publishing support representative. BookLeaf is a self-publishing platform in India. Here is the company knowledge base: [KNOWLEDGE_BASE]. Respond in the following tone: empathetic, professional, specific. Always acknowledge the concern first. Include actual numbers and dates where available. If something is BookLeaf's fault, own it directly. End with a clear next step.

User: Author name: [name]. Author city: [city]. Query about book: [title] (ISBN: [isbn], Status: [status], Published: [date]).

Author's royalty situation: Total earned ₹[X], Paid ₹[Y], Pending ₹[Z], Last payout: [date].

Support ticket: Category: [category], Priority: [priority]

Subject: [subject]
Description: [description]

Please generate a professional draft response that a BookLeaf support manager would send. Be warm, be specific, and be helpful.
```

The agent should NOT send the entire ticket history or ALL royalty data on every call — only the data relevant to the specific ticket's book and the author's summary. Use selective context injection to manage token usage.

**Error Handling:**
- If AI API fails: show "AI draft unavailable — manual response required" warning. The ticket still works; admin can write manually. Log the error.
- If AI responds with malformed JSON for classification: fall back to default category = GENERAL, priority = MEDIUM, and flag for manual review.

### 4.3 AI Classification Background Job
When a new ticket is submitted via the author portal, a background job runs:
1. Fetch ticket from database
2. Call Claude API with just the subject and description (no full KB needed for classification — too expensive)
3. Return structured JSON: `{ category, priority, reasoning }`
4. Update ticket record with AI suggestions
5. If priority is CRITICAL: immediately notify the assigned admin via email

Prompt for classification:
```
Classify this BookLeaf Publishing support ticket into one of these categories: ROYALTY_PAYMENTS, ISBN_METADATA, PRINTING_QUALITY, DISTRIBUTION, BOOK_STATUS, GENERAL.
Also assign a priority: CRITICAL (royalty unpaid >3 months, ISBN duplication, urgent printing error), HIGH (delayed royalty, major distribution issue), MEDIUM (general royalty inquiry, standard production questions), LOW (account updates, general inquiries).

Return only JSON: { "category": "...", "priority": "...", "reasoning": "..." }

Ticket subject: [subject]
Ticket description: [description]
```

---

## PHASE 5: Admin Command Center (Full Admin Portal)

**Goal:** The admin portal is the brain of the operation. Full visibility and control over every author, book, royalty, order, notification, and system setting.

**Route:** `app/(admin)/admin/`

All admin pages share a layout with a fixed left sidebar navigation.

### 5.1 Admin Dashboard (`/admin/dashboard`)
Real-time operational overview.

**Top Stats Row:**
- Total Authors: XX (green +X this month)
- Total Books Published: XX (blue)
- Pending Royalty Payout: ₹XX,XXX across XX authors (orange)
- Open Support Tickets: XX (red if > 10)

**Charts:**
- Monthly new author signups (line chart, 12 months)
- Books by status distribution (pie chart)
- Monthly royalty disbursed vs. earned (grouped bar chart)
- Ticket resolution rate (line chart)

**Recent Activity Feed:**
- Latest ticket submitted
- Latest book status change
- Latest royalty payout completed
- Latest new author signup

**Alerts Section:**
- List of overdue royalties (authors who should have been paid but haven't been)
- Books stuck in production stages > 30 days (warning)
- Failed notification emails

### 5.2 Author Management (`/admin/authors`)
The full author list with full data access.

**Filters:**
- Search by name, email, author ID
- Filter by city (multi-select)
- Filter by payout status: Fully Paid / Has Pending / Has Overdue
- Filter by publishing package
- Filter by join date range

**Author Table:**
Columns: Author ID | Name | City | Books | Total Earned | Total Pending | Payout Status | Package | Joined | Actions

Payout status chip: Green (Fully Paid) / Yellow (Pending) / Red (Overdue — using same logic as author portal).

Click any row → Author Detail View.

**Export:** Download author list as CSV.

**Bulk Action — "Send Royalty Summaries":** Multi-select authors with pending royalties → click "Send Royalty Summary to Selected" → triggers the AI-powered notification workflow for each selected author (see Phase 6). Shows progress bar as emails are sent.

There is also a single button visible on the list header: **"Send Royalty Summaries to ALL with Pending Royalties"** — this selects all qualifying authors automatically and triggers the bulk workflow.

### 5.3 Author Detail View (`/admin/authors/[authorId]`)
Everything the admin needs about a single author.

**Header:** Author name, avatar, city, email, phone, member since, package. Edit button.

**Tabs:**
- **Books Tab:** All books with full details — title, ISBN, status, MRP, royalty data, platform listings. Admin can edit book status, update production stage, mark books as featured in bookstore.
- **Royalties Tab:** Per-book and summary royalty breakdown (same as author sees, but admin can edit payout records — i.e., mark a payout as completed, add a payout date, override amounts with justification note).
- **Tickets Tab:** All tickets this author has raised. Click to open the ticket.
- **Orders Tab:** All bookstore orders by this author-as-reader (books they've bought).
- **Notifications Tab:** All notification emails sent to this author (from NotificationLog). Date, type, status (Sent/Failed), preview of email content.

**"Generate & Send Royalty Summary" Button:**
Prominently placed button. When clicked:
1. Shows a confirmation modal: "This will generate an AI-powered royalty summary email for [Author Name] and send it to [email]. Proceed?"
2. On confirm: triggers the royalty notification workflow (Phase 6)
3. Shows a loading state: "Generating summary... Sending email..."
4. On completion: shows success toast and adds an entry to the NotificationLog
5. If failed: shows error message and logs to NotificationLog with status FAILED

### 5.4 Book Management (`/admin/books`)
- All books across all authors in one table
- Filter by status, genre, author, print partner, date
- Click a book → edit full details: title, description (Tiptap), cover image upload, ISBN, status update, MRP, royalty rate, platform listings, featured flag
- "Add New Book" → form to create a book record and assign to an author

### 5.5 Royalty Management (`/admin/royalties`)
- Overview of all royalty records
- Current quarter's pending payouts aggregated
- "Bulk Mark Paid" workflow: Filter to one quarter, select all authors, input payout date, click "Mark as Paid" → updates all selected RoyaltyRecord rows
- Individual payout adjustment form with mandatory justification note (for compliance)
- Export to CSV for accounting team

### 5.6 Order Management (Bookstore) (`/admin/orders`)
- All bookstore orders from all customers
- Filter by status, date range, customer, book
- Update order status (Processing → Shipped with tracking number input)
- Print packing slip (PDF)
- Issue refund (Stripe refund API)
- Export orders CSV

### 5.7 Notification Log (`/admin/notifications`)
The central log of all outgoing automated emails.
- Columns: Author | Type | Subject | Sent At | Status (Sent/Failed) | Triggered By | Actions
- "View Email" → modal showing the full HTML email content
- "Retry Failed" → re-triggers the notification workflow for failed emails
- Filter by: date range, notification type, status

### 5.8 Bookstore Management (`/admin/bookstore`)
- Books marked as Featured: drag-and-drop to reorder the featured carousel
- Genre collection management
- Homepage banner management
- Book cover image upload and crop tool

### 5.9 Writing Challenge Admin (`/admin/challenges`)
- List all writing challenges
- Create new challenge: title, dates, price, max slots, description
- For active challenge: list of all registrations, payment status, completion status
- View individual participant's poems (day by day)
- Mark challenge as completed → trigger book publishing workflow for each participant
- Send bulk progress reminder emails

### 5.10 Blog Admin (`/admin/blog`)
- List all blog posts
- Create/Edit post: title, slug, Tiptap rich text editor, cover image upload, tags, publish/draft toggle
- Post preview

### 5.11 User & Role Management (`/admin/users`)
- All users in the system
- Change roles
- Reset passwords
- Deactivate accounts

---

## PHASE 6: Writing Challenge Module (21-Day Writing Portal)

**Goal:** A self-contained writing portal for participants of #TheWriteAngle challenge. This is the most innovative and AI-powered feature of the platform. Participants write one poem per day for 21 days in a beautiful canvas interface.

**Route:** `app/(author)/author/challenge/[challengeId]/`

**Access Control:** Only users with a PAID WritingChallengeRegistration for the active challenge can access these routes.

### 6.1 Challenge Hub (`/author/challenge/[challengeId]`)
Landing page for the challenge participant.

**Top Section — Your Progress:**
- Circular progress ring (CSS animation): "Day 14 of 21 — 67% complete"
- Poems submitted: 14 | Remaining: 7
- Grace period indicator (if in grace period: "5 of 7 bonus days remaining")
- Streak counter: "🔥 7-day streak!"
- "Challenge ends in: [countdown timer]"

**Daily Poem Grid:**
A 21-cell calendar grid (+ 7 grace period cells if applicable). Each cell:
- Day number
- Status: 
  - Completed (green with checkmark)
  - Today (pulsing blue border with "Write Today's Poem" CTA)
  - Upcoming (gray, locked)
  - Missed (red, but still accessible for retrospective writing in grace period)
- Click any completed day → view that poem
- Click "Today" cell → open writing canvas

**Quick Stats:** Word count this challenge | Average poem length | Most used theme

### 6.2 Writing Canvas (`/author/challenge/[challengeId]/write/[dayNumber]`)
The centerpiece feature. A distraction-free, full-screen (or near full-screen) writing environment.

**Layout:**
- Minimal header: BookLeaf logo (small) | Day 14 | [Save Draft] [Submit Poem] buttons | Exit (back to hub)
- Writing area: Tiptap editor with a clean, paper-like surface. Playfair Display serif font at comfortable reading size. Off-white background (`--brand-cream`). Subtle drop shadow to simulate paper. No visible toolbar by default — slash commands (type `/` for formatting options like bold, italic, line break, stanza break).
- Poem title input at top of editor (large, subtle placeholder: "Give your poem a title...")
- Word count live counter at bottom: "47 words"

**Features:**
- **Auto-save:** Every 30 seconds, auto-save the draft to database. Show "Saved [timestamp]" indicator.
- **AI Writing Assistant (sidebar, toggleable):** Opens as a right-side panel:
  - "Inspire Me" button: sends current poem + "Give me 3 alternative first lines to inspire direction" to Claude API. Returns suggestions in a list. Click any suggestion to add it to the editor.
  - "Feedback" button: sends complete poem to Claude: "Give 3 brief observations about the rhythm, imagery, and emotional impact of this poem. Be encouraging. Under 100 words total." Returns inline feedback.
  - "Theme Suggestions" button: returns 5 potential themes for today's poem based on what the user has written in previous days (inject last 3 poems for context).
  - "Rhyme Helper": user highlights a word, clicks "Find Rhymes", gets suggestions.
  - Rate limit AI usage: max 5 AI requests per day per user (to control costs). Show remaining: "3 AI assists remaining today."
- **Focus Mode:** Button to hide everything except the writing canvas. ESC to exit.
- **Version History:** "Drafts" tab in AI sidebar shows last 5 auto-saved versions.

**Submit Flow:**
When user clicks "Submit Poem":
1. Validation: title must be filled, content must be at least 10 words
2. Confirmation dialog: "Are you sure you want to submit Day 14's poem? You can still edit it until the challenge ends."
3. Mark DailyPoem.submitted_at = now(), is_draft = false
4. Update WritingChallengeRegistration streak counter
5. Return to challenge hub with celebration animation (confetti burst, "Day 14 done! 🎉")

### 6.3 Poem Gallery (`/author/challenge/[challengeId]/poems`)
Read-only view of all submitted poems by this author. A beautiful, book-like layout. Poems displayed as pages. This doubles as the preview of what their book will look like.

### 6.4 Book Preview (`/author/challenge/[challengeId]/book-preview`)
A live preview of how their poetry collection will look as a published book. Shows cover template selector (from a gallery of 20+ cover designs, with ability to upload their own). Book title (default: their name + "Poems" but editable). Interior layout preview (poem titles in Playfair Display, body in a clean serif). This gives them a tangible sense of what they're building.

**Note:** The actual cover design and typesetting is done by BookLeaf's team after challenge completion. This preview is aspirational — manage that expectation with a tooltip.

### 6.5 Writing Challenge AI Prompt Architecture
The AI integration in the writing canvas must be cost-conscious. Strategy:
- For "Inspire Me" and "Feedback": Use `claude-haiku-4-5` — fast and cheap, adequate for creative suggestions
- For all AI calls, max_tokens = 200 (suggestions are short)
- Cache: If the same user clicks "Inspire Me" twice within 10 minutes without editing, return the cached response (don't call AI again)
- Log all AI usage per user per day in Redis (or a simple DB table) to enforce the 5-per-day rate limit
- Inject only the relevant context: for "Feedback", send only the current poem (not previous ones). For "Theme Suggestions", send last 3 poem titles only (not full content) to save tokens.

---

## PHASE 7: AI-Powered Royalty Notification System

**Goal:** Implement the automated royalty summary email system from Assignment 2, now as a native part of the Next.js platform (no n8n required — we build this directly in Next.js with background jobs and Resend). The admin triggers it from the admin portal; the system generates a personalised AI email and sends it.

### 7.1 Trigger Mechanism
Two trigger points (both seen in admin portal):
1. **Individual:** "Generate & Send Royalty Summary" button on Author Detail View (`/admin/authors/[authorId]`)
2. **Bulk:** "Send Royalty Summaries to ALL Pending" button on Author Management list

**API Route:** `POST /api/admin/notifications/royalty-summary`
Body: `{ authorId: string }` (or `{ allPending: true }` for bulk)

### 7.2 The Workflow (runs as a background job)
For each author:

**Step 1 — Fetch Author Data:**
From the database, collect:
- Author name, email, city
- All published books with: title, genre, total copies sold, total royalty earned, royalty paid, royalty pending, last payout date
- Books in production (with current status)
- Company's royalty policy: quarterly cycle, 45-day window, ₹1,000 minimum threshold

**Step 2 — Determine Context:**
Calculate:
- Which quarter are we in? What is the next expected payout date?
- For each book with pending royalty: is it overdue? (Overdue = pending > 0 AND last payout > 90 days ago OR book published > 90 days ago with zero payouts)
- Total summary: total earned, total paid, total pending across all books

**Step 3 — AI Generation:**
Call Claude API (`claude-sonnet-4-6`) with a carefully crafted prompt:

```
System: You are the author relations manager at BookLeaf Publishing. BookLeaf is a self-publishing company in India. We pay 80% of net profit as royalty to authors, calculated quarterly, paid within 45 days of quarter end. Minimum payout threshold is ₹1,000.

Your tone: warm, professional, specific. Address the author by first name. Include actual rupee amounts and dates. If royalties are overdue, acknowledge it honestly and give a resolution timeline. If everything is paid up, celebrate the author genuinely. Use the author's book titles in a way that feels personal — not generic.

Write a complete royalty summary email. Do not include a subject line. Start directly with the greeting. End with a warm sign-off from "The BookLeaf Team."

Author name: [full name]
Author city: [city]

BOOK-BY-BOOK DATA:
[For each published book:]
Book: [title] (Genre: [genre], published [publication_date])
- Copies Sold: [total_copies_sold]
- Total Royalty Earned: ₹[total_royalty_earned]
- Royalty Paid: ₹[royalty_paid]
- Royalty Pending: ₹[royalty_pending]
- Last Payout: [last_royalty_payout_date or "Never paid"]
- Payout Status: [GREEN/YELLOW/RED with reason]

[For each book in production:]
Book: [title] — Currently in [production_stage] stage.

FINANCIAL SUMMARY:
Total Earned (all books): ₹[X]
Total Paid: ₹[Y]
Total Pending: ₹[Z]

ROYALTY CYCLE CONTEXT:
Current date: [today's date]
Current quarter: [Q]
Next expected payout date: [calculated date]
[If pending < ₹1,000: "Note: Pending amount is below the ₹1,000 minimum threshold and will roll over to next quarter."]
[If overdue books exist: "Note: The following books have overdue royalties: [list]. We sincerely apologise for the delay."]

Generate the email body now:
```

**Step 4 — Format and Send:**
- Wrap the AI-generated body in a `React Email` template with BookLeaf's brand styling (green header, logo, warm footer)
- Send via Resend to the author's email address
- Email subject: `Your BookLeaf Royalty Summary — [Month Year]`

**Step 5 — Log the Result:**
- Create/update a NotificationLog entry: `{ author_id, type: ROYALTY_SUMMARY, subject, email_body, status: SENT/FAILED, sent_at, error_message }`
- If bulk trigger: update a job status record that the admin can see (progress: 7/23 authors emailed)

**Step 6 — Error Handling:**
- If AI API call fails: log FAILED with error, DO NOT send email, mark status as FAILED
- If Resend fails: log FAILED, retain the AI-generated body in the log (so admin can manually copy-send if needed)
- If the author has no pending royalties at all: skip and log as SKIPPED
- Implement retry logic: failed notifications can be retried from the admin Notification Log

**Idempotency:** Before triggering, check if a ROYALTY_SUMMARY notification for this author has been sent in the last 24 hours. If yes, skip and inform the admin: "A royalty summary was already sent to this author [X hours ago]. Trigger again?"

### 7.3 Email Template Design
The Resend/React Email template should look premium:
- Dark forest green header bar with BookLeaf logo (white)
- "Your Royalty Summary" heading in Playfair Display
- Personal greeting paragraph (AI-generated)
- Book-by-book royalty cards (each book in a clean card with a payout status badge)
- Summary totals box in warm gold background
- Next payout date callout box
- CTA button: "View Full Royalty Dashboard" (links to `/author/royalties`)
- Footer with social links and unsubscribe option

---

## CROSS-CUTTING CONCERNS (Apply throughout all phases)

### Security
- All API routes must check authentication using `getServerSession()` (Next.js Server Components) or `auth()` from NextAuth
- Row-level security: Authors can ONLY access their own data. Validate `author_id === session.user.authorId` on every author-specific API call
- Admin routes: Validate `session.user.role === 'ADMIN'` on every admin API call
- Never expose sensitive fields (bank account details, other authors' royalties) in API responses to non-admin users
- All environment variables server-side only (no `NEXT_PUBLIC_` prefix for secrets)
- Stripe webhook validation using `stripe.webhooks.constructEvent()` with the webhook secret
- Input validation on every API route using `zod` schemas
- SQL injection prevention: Use Prisma parameterized queries (never raw SQL with user input)
- Rate limiting on auth endpoints (login, signup) using `upstash/ratelimit`

### Error Handling Pattern
Every API route follows this pattern:
```typescript
try {
  // validate input with zod
  // check auth and permissions
  // business logic
  // return success response
} catch (error) {
  if (error instanceof ZodError) return 400 with validation details
  if (error instanceof AuthError) return 401 with message
  if (error instanceof PermissionError) return 403 with message
  if (error instanceof NotFoundError) return 404 with message
  // log to Sentry
  return 500 with generic message (never expose stack traces)
}
```

### Loading and Empty States
Every page and data-fetching component must have:
- Loading skeleton (not spinner — skeleton shapes matching the content layout)
- Empty state (illustrated, friendly message, relevant CTA)
- Error state (apologetic, suggest next action)

### Accessibility
- All interactive elements keyboard-navigable
- ARIA labels on icon-only buttons
- Color is never the ONLY differentiator (payout status: badge + icon + color)
- Focus rings visible in keyboard navigation mode
- `alt` text on all images

### Mobile Responsiveness
- All pages fully responsive down to 375px viewport
- Admin portal has a responsive sidebar (collapses to hamburger on mobile)
- Bookstore grid collapses from 4 columns → 3 → 2 → 1
- Writing canvas: full-screen on mobile with touch-friendly toolbar
- Royalty table: horizontal scroll on mobile with sticky first column

### Performance
- All images: `next/image` with proper `sizes` attribute
- Dynamic imports for heavy components (Tiptap editor, Recharts)
- API responses: cache headers for public data (bookstore catalog: `Cache-Control: s-maxage=60`)
- Prisma queries: always select only needed fields, never `findMany` without `take` limit
- Database indexes on frequently queried fields: `author_id`, `status`, `genre`, `created_at`

---

## IMPLEMENTATION PHASES SUMMARY (Recap for agent)

**Phase 1 — Foundation:** Project setup, DB schema, auth, all public marketing pages. Deploy to Vercel. This alone should look better than the current bookleafpub.in.

**Phase 2 — Bookstore:** Full e-commerce — catalog, search/filter, book detail, cart, Stripe checkout, orders, email confirmation.

**Phase 3 — Author Portal:** Dashboard, My Books (with production status), Royalty Overview (with status badges), Sales Reports, Profile Management, Support Ticket submission and viewing.

**Phase 4 — AI Ticket Management:** Admin ticket queue with AI classification, priority scoring, AI-drafted responses using BookLeaf Knowledge Base. Real-time ticket updates for authors.

**Phase 5 — Admin Command Center:** Full admin dashboard, author management, book management, royalty management, order management, notification log, bookstore management, blog admin.

**Phase 6 — Writing Challenge:** 21-day poem writing canvas with Tiptap, AI writing assistant (Claude Haiku), auto-save, progress tracking, book preview.

**Phase 7 — Royalty Notification System:** AI-powered royalty summary email generation (Claude Sonnet), triggered individually or in bulk from admin, with Resend delivery and full notification log.

---

## WHAT THIS MUST DEMONSTRATE TO THE FOUNDERS

When the BookLeaf founders evaluate this platform, they must feel:

1. **"This is what we should have built years ago."** — Every current pain point addressed (author support, royalty transparency, bookstore quality, writing challenge experience).

2. **"This person understands publishing, not just code."** — The royalty calculation logic is correct (80/20, quarterly, 45-day window, ₹1,000 threshold). The ticket categories match their actual author queries. The communication tone in AI-generated emails matches BookLeaf's voice.

3. **"This is actually production-ready."** — Stripe is real, auth is real, emails are real, the database schema handles every edge case from the sample data (books in production, zero-payout authors, multiple books per author).

4. **"The AI integration is thoughtful, not gimmicky."** — AI is used in ticket classification (saves admin time), response drafting (speeds up support), royalty summary emails (scales author communication), and the writing canvas (helps authors overcome writer's block). Each use case is clearly justified.

5. **"We can take this further."** — The codebase is clean, modular, and extensible. The schema can accommodate new features. The architecture can scale.

---

## SEED DATA (from bookleaf_sample_data.json)

The platform must be seeded with the exact data from the provided JSON file. This data contains 10 authors (Priya Sharma, Rohit Kapoor, Ananya Reddy, Vikram Joshi, Meera Nair, Arjun Malhotra, Sneha Kulkarni, Farhan Sheikh, Kavita Deshmukh, Diya Chatterjee) with 18 books across various statuses and royalty states. The seeding script must handle:

- Authors with fully paid royalties (Meera Nair's "Cardamom & Chaos", Vikram Joshi's "The Last Monsoon", Farhan Sheikh's "Ghazal of the Forgotten")
- Authors with pending royalties (Rohit Kapoor: ₹13,024 pending, Sneha Kulkarni: ₹7,865 pending)
- Authors with overdue royalties where no payout has ever been made (Ananya Reddy's "Between Two Temples", Arjun Malhotra's "Turban Tales")
- Books in production with null MRP and zero sales (Sneha Kulkarni's "Midnight in Mysore", Kavita Deshmukh's "Raising Roots")
- Test accounts: One admin account (admin@bookleaf.com / Admin@123) and one test author account per seeded author, with email = their email from the JSON.

---

*End of Master Planning Prompt. The agent should begin with Phase 1 and complete each phase before starting the next. Each phase must be production-deployable before the next phase starts.*
