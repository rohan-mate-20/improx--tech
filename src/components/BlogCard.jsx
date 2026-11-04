import { Link } from 'react-router-dom';

function BlogCard({ post }) {
  const title = typeof post.title === 'object' ? post.title?.rendered : (post.title || '');
  const excerpt = post.excerpt || (post.meta_description) || 'Read the full article to explore the approach, key takeaways, and implementation guidance.';
  const image = post.featuredImage || post.featured_image || post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&q=80';
  const targetId = post.slug || post.id;
  const dateStr = post.date || post.created_at || new Date().toISOString();
  const category = post.category || 'Engineering';

  return (
    <article className="blog-card glass-card reveal active">
      <img src={image} alt={title || 'Blog post'} loading="lazy" />
      <div className="blog-card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand)', letterSpacing: '0.05em' }}>
            {category}
          </span>
          <time dateTime={dateStr} style={{ fontSize: '0.82rem', color: 'var(--text-lo)' }}>
            {new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </time>
        </div>
        <h3>{title}</h3>
        <p>{typeof excerpt === 'string' && excerpt.length > 160 ? excerpt.slice(0, 160) + '…' : excerpt}</p>
        <Link to={`/blog/${targetId}`} className="btn btn-primary" style={{ marginTop: 'auto' }}>
          Read More <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px', fontSize: '0.85em' }} />
        </Link>
      </div>
    </article>
  );
}

export default BlogCard;
