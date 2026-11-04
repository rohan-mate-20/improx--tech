import { marked } from 'marked';
import { fetchFromWp } from './wpApi';

const FASTAPI_BASE_URL = import.meta.env.VITE_BLOG_API_URL || 'http://localhost:8000/api';

/**
 * Normalizes blog post object from either FastAPI (blogs.db) or WordPress API.
 */
export function normalizePost(post) {
  if (!post) return null;

  // Title
  const title = typeof post.title === 'object' ? post.title?.rendered : (post.title || '');

  // Identifier / Slug
  const slug = post.slug || String(post.id || '');
  const id = post.id || slug;

  // Excerpt / Meta Description
  let excerpt = post.meta_description || '';
  if (!excerpt && post.excerpt) {
    excerpt = typeof post.excerpt === 'object'
      ? post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
      : String(post.excerpt).replace(/<[^>]+>/g, '').trim();
  }
  if (!excerpt) {
    excerpt = 'Read the full article to explore insights, architecture patterns, and technical recommendations.';
  }

  // Content (Markdown or HTML)
  let rawContent = typeof post.content === 'object' ? post.content?.rendered : (post.content || '');
  let htmlContent = rawContent;
  
  // If content contains markdown markers (headings, lists, bold) and not raw HTML tags, parse it
  if (rawContent && !rawContent.includes('<p>') && !rawContent.includes('<div>')) {
    try {
      htmlContent = marked.parse(rawContent);
    } catch {
      htmlContent = rawContent;
    }
  }

  // Featured Image
  const featuredImage =
    post.featured_image ||
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80';

  // Date
  const date = post.created_at || post.date || new Date().toISOString();

  // Category & Tags
  const category = post.category || 'Engineering';
  const tags = Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '');

  // SEO fields
  const seoTitle = post.seo_title || title;
  const metaDescription = post.meta_description || excerpt.slice(0, 155);

  return {
    id,
    slug,
    title,
    excerpt,
    content: htmlContent,
    featuredImage,
    date,
    category,
    tags,
    seoTitle,
    metaDescription,
  };
}

/**
 * Fetches all approved blogs from FastAPI (blogs.db) with graceful fallback to WP.
 */
export async function getBlogs() {
  // 1. Try FastAPI backend first
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/blogs`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizePost);
      }
    }
  } catch (err) {
    console.info('FastAPI blogs endpoint not reachable, trying WordPress fallback...');
  }

  // 2. Fallback to existing WordPress API
  try {
    const wpData = await fetchFromWp('/posts?per_page=20&_embed');
    if (Array.isArray(wpData)) {
      return wpData.map(normalizePost);
    }
  } catch (wpErr) {
    console.warn('WordPress API fallback also failed:', wpErr);
  }

  return [];
}

/**
 * Fetches a single blog post by slug or ID.
 */
export async function getBlogBySlugOrId(slugOrId) {
  // 1. Try FastAPI backend first
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/blogs/${encodeURIComponent(slugOrId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return normalizePost(data);
      }
    }
  } catch (err) {
    console.info('FastAPI single post endpoint not reachable, trying WordPress fallback...');
  }

  // 2. Fallback to WordPress API
  try {
    const wpData = await fetchFromWp(`/posts/${slugOrId}?_embed`);
    if (wpData) {
      return normalizePost(wpData);
    }
  } catch (wpErr) {
    console.warn('WordPress single post fallback failed:', wpErr);
  }

  throw new Error('Blog post not found.');
}
