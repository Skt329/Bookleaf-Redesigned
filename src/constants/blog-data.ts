export interface BlogPostSection {
  type: 'heading' | 'paragraph' | 'list' | 'quote';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  date: string;
  category: string;
  gradient: string;
  readTime: string;
  sections: BlogPostSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-self-publish-in-india-2025',
    title: 'How to Self-Publish in India in 2025',
    excerpt:
      'A comprehensive guide to navigating the Indian self-publishing landscape — from manuscript preparation to global distribution and marketing strategies.',
    author: 'Amir Shah',
    initials: 'AS',
    date: 'Jan 15, 2025',
    category: 'Publishing',
    gradient: 'from-brand-primary to-brand-primary-light',
    readTime: '6 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'Self-publishing has democratized the Indian literary scene, allowing thousands of aspiring writers to turn their manuscripts into fully realized printed books and eBooks without the gatekeeping of traditional publishing houses.',
      },
      {
        type: 'heading',
        text: '1. Prepare Your Manuscript for the Market',
      },
      {
        type: 'paragraph',
        text: 'Before you think about printing or formatting, your manuscript must be polished. Self-publishing does not mean skipping quality checks. In 2025, readers expect professional standards.',
      },
      {
        type: 'list',
        items: [
          '**Self-Editing**: Review your draft multiple times, looking for plot holes, formatting issues, and voice consistency.',
          '**Professional Proofreading**: Hire an editor or utilize self-publishing packages that include comprehensive editing services to ensure no grammatical errors bypass.',
          '**Formatting & Typesetting**: Format your pages properly for industry standards, keeping correct margins, headers, and page numbering.',
        ],
      },
      {
        type: 'heading',
        text: '2. Craft a Captivating Cover Design',
      },
      {
        type: 'paragraph',
        text: 'A book cover is your primary sales tool. A poorly designed cover tells the reader that the interior content might also be low quality. Work with professional designers who understand genre-specific layouts, typography, and contrast rules.',
      },
      {
        type: 'heading',
        text: '3. Legal Formalities: ISBN and Copyright',
      },
      {
        type: 'paragraph',
        text: 'An ISBN (International Standard Book Number) is mandatory for selling print books in commercial bookstores. Under Indian law, the copyright of the book belongs entirely to the author upon creation. Ensure your self-publishing platform secures a registered ISBN for your book.',
      },
      {
        type: 'heading',
        text: '4. Global Distribution Strategy',
      },
      {
        type: 'paragraph',
        text: 'In 2025, your book should be available globally. Make sure your platform distributes your title on major Indian marketplaces (Amazon India, Flipkart, BookLeaf Store) as well as global retail platforms (Amazon US/UK, Kobo, Apple Books, Google Books).',
      },
      {
        type: 'quote',
        text: 'The best self-publishing process is one that makes your book reach every corner of the globe without requiring you to leave your desk.',
      },
    ],
  },
  {
    slug: '5-tips-for-first-time-authors',
    title: '5 Tips for First-Time Authors',
    excerpt:
      'Writing your first book is a monumental achievement. Here are five essential tips to help you navigate the journey from blank page to published author.',
    author: 'Priya Menon',
    initials: 'PM',
    date: 'Jan 8, 2025',
    category: 'Writing Tips',
    gradient: 'from-brand-accent to-brand-accent-light',
    readTime: '4 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'Writing a book is a marathon, not a sprint. For a first-time author, the sheer scale of the project can feel overwhelming. These five tips will help you organize your workflow and reach the finish line.',
      },
      {
        type: 'heading',
        text: '1. Establish a Consistent Writing Routine',
      },
      {
        type: 'paragraph',
        text: 'Do not wait for inspiration to strike. Set a daily or weekly word count goal (e.g., 500 words per day) and stick to it. Consistency is the secret behind every completed manuscript.',
      },
      {
        type: 'heading',
        text: '2. Turn Off Your Inner Editor During the First Draft',
      },
      {
        type: 'paragraph',
        text: 'Write forward, not backward. Avoid reviewing and rewriting your previous chapters while drafting. The first draft is simply about getting your ideas onto the page. You will have plenty of time to polish it later.',
      },
      {
        type: 'heading',
        text: '3. Outline Your Plot and Key Characters',
      },
      {
        type: 'paragraph',
        text: 'Even if you prefer writing spontaneously, having a basic map of your story prevents writer\'s block. Outline your chapters, specify character motivations, and identify the primary conflict early in the process.',
      },
      {
        type: 'heading',
        text: '4. Share Your Work with Beta Readers',
      },
      {
        type: 'paragraph',
        text: 'Get feedback from honest, objective readers before submitting your book for publication. Avoid asking family members; instead, find writing groups or target readers who will give you constructive criticism.',
      },
      {
        type: 'heading',
        text: '5. Build Your Platform Early',
      },
      {
        type: 'paragraph',
        text: 'Do not wait until publication day to start marketing. Build your author presence on social media (Instagram, Twitter, LinkedIn) early on. Share your writing progress, snippets of your book, and interact with the writing community.',
      },
    ],
  },
  {
    slug: 'understanding-book-royalties',
    title: 'Understanding Book Royalties',
    excerpt:
      'Confused about royalty structures? We break down how platform royalties, author splits, and direct sales work — so you know exactly what you earn.',
    author: 'Rohan Kapoor',
    initials: 'RK',
    date: 'Dec 28, 2024',
    category: 'Publishing',
    gradient: 'from-brand-primary-light to-brand-accent',
    readTime: '5 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'Understanding how book sales translate into author earnings is critical for anyone entering the self-publishing space. Let\'s demystify royalty splits, printing costs, and distribution channel commissions.',
      },
      {
        type: 'heading',
        text: 'What are Royalties?',
      },
      {
        type: 'paragraph',
        text: 'A royalty is the amount paid to an author for each copy of their book sold. In traditional publishing, royalties are typically a small percentage (7% to 15%) of the book\'s retail price. In self-publishing, the percentage is much higher, often reaching 70% to 100% of net profits.',
      },
      {
        type: 'heading',
        text: 'The Formula: How Earnings are Calculated',
      },
      {
        type: 'paragraph',
        text: 'Most self-publishers calculate author royalties using a simple net formula:',
      },
      {
        type: 'quote',
        text: 'Royalty = MRP - Printing Cost - Distribution Fee (Platform Commission)',
      },
      {
        type: 'list',
        items: [
          '**MRP (Maximum Retail Price)**: The price readers pay to purchase your book.',
          '**Printing Cost**: The cost of printing the physical pages, dependent on page count and binding type (paperback vs. hardcover).',
          '**Distribution Fee**: The fee charged by platforms (like Amazon or Flipkart) to list, process payments, and ship your book to customers.',
        ],
      },
      {
        type: 'heading',
        text: 'Direct Sales vs. Retail Marketplace Sales',
      },
      {
        type: 'paragraph',
        text: 'When selling directly through your own website or author store, you bypass third-party retail commissions, allowing you to earn up to 100% of the net price. When selling via external marketplaces, a platform fee (typically 30% to 50%) is deducted.',
      },
    ],
  },
  {
    slug: 'bookleaf-journey-on-shark-tank-india',
    title: "BookLeaf's Journey on Shark Tank India",
    excerpt:
      "From a small startup in Kashmir to the Shark Tank India stage — here's the inside story of how BookLeaf pitched, pivoted, and prevailed.",
    author: 'Ananya Das',
    initials: 'AD',
    date: 'Dec 15, 2024',
    category: 'Author Stories',
    gradient: 'from-brand-accent to-brand-primary',
    readTime: '7 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'Pitching on Shark Tank India was a milestone for BookLeaf Publishing. It wasn\'t just an opportunity to seek funding, but a platform to showcase our mission to millions of households across India: democratizing authorship.',
      },
      {
        type: 'heading',
        text: 'From Srinagar to the National Stage',
      },
      {
        type: 'paragraph',
        text: 'Started as a small bootstrap project, BookLeaf aimed to resolve a fundamental problem in Indian publishing: traditional gatekeeping. With over 12,000 published books, our appearance on Shark Tank was the culmination of years of hard work by our founders and writers.',
      },
      {
        type: 'heading',
        text: 'The Pitch: The Numbers Behind the Passion',
      },
      {
        type: 'paragraph',
        text: 'During our pitch, we highlighted our key metrics: over 1 million copies sold, international distribution to 150+ countries, and our unique 100% direct author royalty policy. The Sharks were intrigued by our custom-built Print on Demand (POD) automated infrastructure and the community response.',
      },
      {
        type: 'heading',
        text: 'Key Takeaways for Aspiring Entrepreneurs',
      },
      {
        type: 'list',
        items: [
          '**Solve Real Problems**: BookLeaf succeeded because we addressed the frustration authors faced with traditional publishers.',
          '**Know Your Unit Economics**: Showing how we balance print costs and royalty splits demonstrated financial sustainability.',
          '**Build a Brand Community**: Our 55,000+ community members are our strongest brand ambassadors.',
        ],
      },
    ],
  },
  {
    slug: 'art-of-book-cover-design',
    title: 'The Art of Book Cover Design',
    excerpt:
      'Your book cover is the first impression readers get. Learn the principles of effective cover design and how to make your book stand out on shelves.',
    author: 'Vikram Joshi',
    initials: 'VJ',
    date: 'Dec 5, 2024',
    category: 'Marketing',
    gradient: 'from-brand-primary to-brand-accent-light',
    readTime: '5 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'It is a common saying that you shouldn\'t judge a book by its cover, but in the publishing marketplace, everyone does. A professional, striking cover is non-negotiable if you want your self-published book to get noticed.',
      },
      {
        type: 'heading',
        text: '1. Establish a Focal Point',
      },
      {
        type: 'paragraph',
        text: 'Your cover should have one primary element that draws the eye immediately. This could be a striking illustration, a clean typography layout, or a high-contrast photograph. Avoid cluttering the cover with too many visual elements.',
      },
      {
        type: 'heading',
        text: '2. Select the Right Typography',
      },
      {
        type: 'paragraph',
        text: 'The title text must be readable even as a tiny thumbnail on Amazon. Use bold, distinct fonts for the title, and keep the author\'s name clean and readable. Make sure the font style matches your book\'s genre (e.g., serif for historical fiction, modern sans-serif for non-fiction).',
      },
      {
        type: 'heading',
        text: '3. Use Contrast and Color Harmonies',
      },
      {
        type: 'paragraph',
        text: 'A good cover uses color theory to set the mood. Blue and grey tones suggest mystery or drama, while bright, saturated warm tones suggest energy, romance, or adventure. Ensure there is strong contrast between your background image and the title text.',
      },
      {
        type: 'heading',
        text: '4. Maintain Genre Alignment',
      },
      {
        type: 'paragraph',
        text: 'Your cover should instantly communicate the genre of the book to the target audience. A thriller needs dark, moody elements, while self-help needs clean, minimalistic space. Look at bestselling books in your category for design inspiration.',
      },
    ],
  },
  {
    slug: 'writing-your-first-novel-beginners-guide',
    title: "Writing Your First Novel: A Beginner's Guide",
    excerpt:
      'From outlining your plot to developing compelling characters — everything you need to know to start writing your debut novel with confidence.',
    author: 'Meera Iyer',
    initials: 'MI',
    date: 'Nov 28, 2024',
    category: 'Writing Tips',
    gradient: 'from-brand-accent-light to-brand-primary-light',
    readTime: '5 min read',
    sections: [
      {
        type: 'paragraph',
        text: 'Everyone has a story inside them, but translating that story into a 60,000-word novel requires structure, planning, and persistence. Here is a step-by-step roadmap to start writing your debut novel.',
      },
      {
        type: 'heading',
        text: 'Step 1: Define Your Core Premise',
      },
      {
        type: 'paragraph',
        text: 'Summarize your novel in a single sentence. Who is the protagonist? What do they want? What is the main obstacle stopping them? This elevator pitch will guide your writing and keep the plot focused.',
      },
      {
        type: 'heading',
        text: 'Step 2: Create Deep Characters',
      },
      {
        type: 'paragraph',
        text: 'Your readers will follow your characters, not just the plot. Create detailed character profiles. Figure out their desires, fears, background histories, and flaws. A flawed character is a relatable character.',
      },
      {
        type: 'heading',
        text: 'Step 3: Establish the Setting',
      },
      {
        type: 'paragraph',
        text: 'Your novel\'s setting should feel like a character itself. Whether it is a real-world city like Mumbai or an imaginary fantasy realm, describe the sights, sounds, smells, and atmosphere to immerse your readers.',
      },
      {
        type: 'heading',
        text: 'Step 4: Develop a Three-Act Structure',
      },
      {
        type: 'list',
        items: [
          '**Act I (Setup)**: Introduce the characters, the world, and the inciting incident that launches the adventure.',
          '**Act II (Confrontation)**: Increase the stakes. The protagonist faces obstacles, errors occur, and tensions rise to a climax.',
          '**Act III (Resolution)**: Solve the main conflict. The aftermath shows how the journey transformed the protagonist.',
        ],
      },
      {
        type: 'heading',
        text: 'Step 5: Write the First Draft Without Self-Judgment',
      },
      {
        type: 'paragraph',
        text: 'Accept that your first draft will not be perfect. The goal of the first draft is simply to write the story down. Editing and refining are where the magic happens.',
      },
    ],
  },
];
