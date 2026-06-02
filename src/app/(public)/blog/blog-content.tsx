'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BLOG_POSTS, BlogPost } from '@/constants/blog-data';

const CATEGORIES = [
  'All',
  'Writing Tips',
  'Publishing',
  'Marketing',
  'Author Stories',
  'Industry News',
];

export function BlogContent() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === activeCategory);

  return (
    <div className="container-bookleaf animate-fade-in">
      {/* Category Filter Row */}
      <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Blog categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-body-sm font-medium transition-all duration-200 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent/50',
              activeCategory === cat
                ? 'bg-brand-primary text-text-inverse border-brand-primary shadow-sm'
                : 'bg-surface-card text-text-secondary border-border hover:border-brand-accent hover:text-text-primary',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 card bg-surface-card border-border border">
          <p className="text-body-lg text-text-secondary font-body">
            No articles found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="card overflow-hidden group h-full flex flex-col hover:shadow-lg transition-all duration-300 no-underline text-inherit hover:border-brand-accent border border-border"
              >
                {/* Header Gradient */}
                <div
                  className={cn(
                    'h-44 bg-gradient-to-br relative flex items-end p-5 shrink-0',
                    post.gradient,
                  )}
                >
                  <span className="badge bg-surface-card/90 text-text-primary backdrop-blur-sm text-caption">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-heading-sm text-text-primary leading-snug group-hover:text-brand-primary transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-body-sm text-text-secondary font-body line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Meta Row */}
                  <div className="mt-6 flex items-center justify-between border-t border-border-muted pt-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-primary/10 flex items-center justify-center">
                        <span className="text-[0.625rem] font-bold text-brand-primary font-display">
                          {post.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-caption text-text-primary font-medium font-body leading-tight">
                          {post.author}
                        </p>
                        <p className="text-caption text-text-muted font-body leading-tight">
                          {post.date}
                        </p>
                      </div>
                    </div>

                    <span className="text-body-sm font-semibold text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
