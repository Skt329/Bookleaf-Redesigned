import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/constants/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.bookleafpub.in';

  const staticRoutes = [
    '',
    '/about',
    '/get-published',
    '/writing-challenge',
    '/bookstore',
    '/reviews',
    '/blog',
    '/faq',
    '/contact',
    '/careers',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
    '/royalty-calculator',
  ];

  const staticSitemaps = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogSitemaps = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticSitemaps, ...blogSitemaps];
}
