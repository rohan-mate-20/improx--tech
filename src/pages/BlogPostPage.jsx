import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogBySlugOrId } from '../utils/blogApi';
import { usePageSEO } from '../components/SEOManager';

function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBlogBySlugOrId(id);
        setPost(data);
      } catch (err) {
        setError('Article not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setError('Invalid post identifier.');
      setLoading(false);
    }
  }, [id]);

  // Dynamic SEO metadata derived from the fetched blog post
  usePageSEO(
    post
      ? {
          title: `${post.seoTitle || post.title} | Improx Tech Blog`,
          description: post.metaDescription || post.excerpt || 'Explore technical insights and enterprise engineering from Improx Tech.',
          keywords: post.tags || `${(post.title || '').toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 6).join(', ')}, technology insights, Improx Tech blog`,
          canonicalUrl: `https://improxtech.com/blog/${post.slug || id}`,
          ogImage: post.featuredImage,
        }
      : null
  );

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: '130px', paddingBottom: '96px' }}>
      <main className="post-wrapper" style={{ padding: '0 24px', maxWidth: '1000px', margin: '0 auto' }}>
        {loading && (
          <div className="loader-container">
            <div className="loader" aria-label="Loading" />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && post && (
          <>
            {/* Centered Breadcrumb / Back Navigation */}
            <nav style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: 'var(--text-lo)', marginBottom: '24px' }}>
              <Link to="/" style={{ color: 'var(--text-lo)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link to="/blog" style={{ color: 'var(--text-lo)', textDecoration: 'none' }}>Blogs</Link>
              <span>/</span>
              <span style={{ color: 'var(--brand)', fontWeight: 600 }}>Article</span>
            </nav>

            {/* Transparent Blog Header */}
            <header className="single-post-header" style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span className="eyebrow" style={{ color: 'var(--brand)', width: 'fit-content' }}>
                <span className="glow-dot" style={{ marginRight: '8px' }} /> {post.category || 'TECHNICAL ARTICLE'}
              </span>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, color: 'var(--text-hi)', lineHeight: 1.15, letterSpacing: '-0.04em', margin: 0, width: '100%' }}>
                {post.title}
              </h1>

              {/* Meta Row Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-lo)',
                fontSize: '0.92rem',
                flexWrap: 'wrap',
                gap: '12px 18px',
                margin: '10px 0 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-regular fa-calendar" />
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-regular fa-clock" />
                  <span>5 min read</span>
                </div>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-lo)' }}>By:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-mid)', fontSize: '0.85rem' }}>Improx Team</span>
                </div>
              </div>
            </header>

            {/* Hero Image */}
            {post.featuredImage && (
              <div className="post-hero-image-wrapper" style={{ margin: '0 0 48px 0', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
                <img src={post.featuredImage} alt={post.title} style={{ width: '100%', height: 'auto', maxHeight: '540px', objectFit: 'cover' }} />
              </div>
            )}

            {/* Dynamic Blog Content (HTML or rendered Markdown) */}
            <div
              className="single-post-content wp-content"
              style={{
                color: 'var(--text-mid)',
                fontSize: '1.15rem',
                lineHeight: 1.9,
                maxWidth: '820px',
                margin: '0 auto',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                wordBreak: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Article Footer & Consultation CTA */}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '64px', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <Link to="/blog" className="btn btn-secondary">
                <i className="fa-solid fa-arrow-left" style={{ marginRight: '8px' }} /> Back to All Articles
              </Link>
              <Link to="/contact" className="btn btn-primary">
                Discuss Your Architecture <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }} />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default BlogPostPage;
