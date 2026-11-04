import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { getBlogs } from '../utils/blogApi';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getBlogs();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const cats = new Set(['All']);
    posts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [posts]);

  // Compute recent posts
  const recentPosts = useMemo(() => {
    return posts.slice(0, 4);
  }, [posts]);

  // Compute filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <main className="blog-page-wrap">
      <section className="blog-page-hero reveal active">
        <span className="badge">Insights & Analytics</span>
        <h1>Improx Tech Intelligence Reports</h1>
        <p>
          Our latest technical observations, engineering blueprints, cloud setup guides, and software security reviews.
        </p>
      </section>

      <div className="blog-layout">
        <div className="blog-main">
          {loading && (
            <div className="loader-container">
              <div className="loader" aria-label="Loading" />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <h3>No articles found</h3>
              <p style={{ color: 'var(--text-mid)', marginTop: '8px' }}>
                Try adjusting your search query or selecting a different category.
              </p>
            </div>
          )}

          {!loading && !error && filteredPosts.length > 0 && (
            <div className="blog-list">
              {filteredPosts.map((post) => (
                <BlogCard key={post.slug || post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside className="blog-sidebar">
          {/* Search */}
          <div className="glass-card sidebar-widget">
            <h3>Search</h3>
            <div className="blog-search-wrap">
              <input
                type="search"
                placeholder="Search articles..."
                aria-label="Search blog posts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="btn btn-primary" aria-label="Search">
                <i className="fas fa-magnifying-glass" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="glass-card sidebar-widget">
            <h3>Categories</h3>
            <div className="sidebar-list">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: selectedCategory === cat ? 'rgba(37,99,235,0.1)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--brand)' : 'var(--text-mid)',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div className="glass-card sidebar-widget">
              <h3>Recent Posts</h3>
              <div className="sidebar-recent" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentPosts.map((rp) => (
                  <Link
                    key={rp.slug || rp.id}
                    to={`/blog/${rp.slug || rp.id}`}
                    style={{ textDecoration: 'none', display: 'flex', gap: '12px', alignItems: 'center' }}
                  >
                    <img
                      src={rp.featuredImage}
                      alt={rp.title}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-hi)', lineHeight: 1.3 }}>
                        {rp.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-lo)', marginTop: '3px' }}>
                        {new Date(rp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <section className="section cta-banner-section">
        <div className="glass-card reveal cta-banner">
          <h2>Looking for Technical Consultation?</h2>
          <p>
            Get in touch with an engineering consultant today to review database performance, cloud infrastructure, or code reviews.
          </p>
          <Link className="btn btn-primary" to="/contact">
            Contact Our Team <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default BlogPage;
