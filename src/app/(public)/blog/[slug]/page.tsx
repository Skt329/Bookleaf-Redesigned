import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import { PageHeader } from '@/components/shared';
import { BLOG_POSTS } from '@/constants/blog-data';
import { cn } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found — BookLeaf Blog',
    };
  }

  return {
    title: `${post.title} — BookLeaf Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          title={post.title}
          subtitle={`By ${post.author} on ${post.date}`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        <section className="section bg-surface-background">
          <div className="container-bookleaf max-w-3xl mx-auto">
            {/* Back to Blog */}
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-body-sm font-medium text-text-secondary hover:text-brand-primary transition-colors duration-150 no-underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>

            {/* Main Header Banner */}
            <div className={cn("rounded-2xl h-64 bg-gradient-to-br flex items-end p-8 md:p-12 mb-10 shadow-lg text-text-inverse", post.gradient)}>
              <div>
                <span className="badge bg-surface-card/90 text-text-primary backdrop-blur-sm text-caption mb-4">
                  {post.category}
                </span>
                <h1 className="font-display text-display-sm md:text-display-md leading-tight text-text-inverse mt-2">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Author Meta Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-8 text-body-sm text-text-muted font-body">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                  <span className="text-body-md font-bold text-brand-primary font-display">
                    {post.initials}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-text-primary leading-tight">{post.author}</p>
                  <p className="text-caption mt-0.5">Author & Expert</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-brand max-w-none">
              {post.sections.map((section, idx) => {
                if (section.type === 'heading') {
                  return (
                    <h2 key={idx} className="font-display text-heading-lg text-text-primary mt-8 mb-4 font-bold">
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === 'paragraph') {
                  const text = section.text || '';
                  const parts = text.split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <p key={idx} className="font-body text-body-md text-text-secondary leading-relaxed mb-6">
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={j} className="text-text-primary font-semibold">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </p>
                  );
                }
                if (section.type === 'list') {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-3 mb-6 font-body text-body-md text-text-secondary leading-relaxed">
                      {section.items?.map((item, itemIdx) => {
                        const parts = item.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <li key={itemIdx}>
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={j} className="text-text-primary font-semibold">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return <span key={j}>{part}</span>;
                            })}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                if (section.type === 'quote') {
                  return (
                    <blockquote key={idx} className="border-l-4 border-brand-accent bg-surface-muted px-6 py-4 rounded-r-lg font-body text-body-lg italic text-text-primary my-6 leading-relaxed">
                      {section.text}
                    </blockquote>
                  );
                }
                return null;
              })}
            </article>

            {/* Bottom Feed Navigation */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="card p-6 md:p-8 bg-surface-muted text-center max-w-xl mx-auto">
                <h3 className="font-display text-heading-md text-text-primary">
                  Did you enjoy this article?
                </h3>
                <p className="mt-2 text-body-sm text-text-secondary font-body">
                  Subscribe to our author newsletter to receive direct publishing guides and industry tips weekly.
                </p>
                <Link
                  href="/blog"
                  className="mt-5 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-brand-primary text-text-inverse font-semibold text-body-sm hover:bg-brand-primary-hover transition-colors no-underline"
                >
                  Back to Blog Feed
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
