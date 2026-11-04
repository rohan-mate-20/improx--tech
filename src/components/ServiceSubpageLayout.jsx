import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from './ContactForm';
import { fetchFromWp } from '../utils/wpApi';

/**
 * Shared layout for ALL service subpages (Application Services + Product Engineering).
 * parentLabel / parentTo: for the breadcrumb second crumb
 */
function ServiceSubpageLayout({ hero, overview, features, benefits, process, useCases, techs, blogs, ctaHeading, ctaBody, parentLabel = 'Application Services', parentTo = '/services/application-services' }) {
  const [displayBlogs, setDisplayBlogs] = useState(blogs || []);

  useEffect(() => {
    const loadWpPostsForService = async () => {
      try {
        // 1. Create a clean tag slug representing the active subpage (e.g. 'UX / UI Design' -> 'ux-design')
        const tagSlug = hero.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // 2. Fetch the Tag ID for this slug from WordPress
        const tagsData = await fetchFromWp(`/tags?slug=${tagSlug}`);
        
        let wpPosts = [];
        if (tagsData && tagsData.length > 0) {
          const tagId = tagsData[0].id;
          // 3. Query posts matching this specific Tag ID
          wpPosts = await fetchFromWp(`/posts?tags=${tagId}&per_page=3&_embed`);
        }

        // 4. Fallback to basic search if no tag matches
        if (!wpPosts || wpPosts.length === 0) {
          const term = encodeURIComponent(hero.title.toLowerCase().replace(/[^a-z0-9]+/g, ' '));
          wpPosts = await fetchFromWp(`/posts?search=${term}&per_page=3&_embed`);
        }

        if (wpPosts && wpPosts.length > 0) {
          setDisplayBlogs(wpPosts);
        }
      } catch (err) {
        console.warn('Fallback to static blogs list:', err);
      }
    };
    loadWpPostsForService();
  }, [hero.title, blogs]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(248,250,252,.85) 0%,rgba(255,255,255,.6) 50%,rgba(248,250,252,.98) 100%)', zIndex: 1 }} />
          {hero.bgVideo && (
            <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .08, filter: 'none' }}>
               <source src={hero.bgVideo} type="video/mp4" />
            </video>
          )}
          <img src={hero.bgImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hero.bgVideo ? 0 : .1, filter: 'none' }} />
        </div>
        <div className="hero-blob hero-blob-1" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
        <div className="hero-blob hero-blob-2" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '180px 24px 100px', position: 'relative', zIndex: 2, width: '100%' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-mid)', marginBottom: '28px', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: 'var(--text-mid)' }}>Home</Link>
            <span>/</span>
            <Link to={parentTo} style={{ color: 'var(--text-mid)' }}>{parentLabel}</Link>
            <span>/</span>
            <span style={{ color: 'var(--brand)' }}>{hero.title}</span>
          </nav>

          <span className="eyebrow reveal" style={{ color: 'var(--brand)' }}>
            <span className="glow-dot" style={{ background: 'var(--accent)' }} /> {hero.eyebrow}
          </span>
          <h1 className="reveal" style={{ fontSize: 'clamp(2.4rem,5.5vw,4.6rem)', fontWeight: 900, lineHeight: 1.06, marginBottom: '22px', color: 'var(--text-hi)', letterSpacing: '-0.03em', maxWidth: '820px' }}>
            {hero.title.split(' ').map((w, i, a) =>
              i === a.length - 1
                ? <span key={i} style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{w}</span>
                : <span key={i}>{w} </span>
            )}
          </h1>
          <p className="reveal" style={{ fontSize: 'clamp(1rem,1.8vw,1.2rem)', color: 'var(--text-mid)', maxWidth: '620px', lineHeight: 1.78, marginBottom: '38px' }}>
            {hero.subtitle}
          </p>
          <div className="reveal" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 34px', background: 'var(--grad-brand)' }}>Start a Conversation <i className="fa-solid fa-arrow-right" /></Link>
            <a href="#overview" className="btn btn-secondary" style={{ padding: '14px 34px', background: 'rgba(15,23,42,0.04)', color: 'var(--text-hi)', border: '1px solid var(--border)' }}>Learn More</a>
          </div>
        </div>
      </section>

      {/* ── Overview ──────────────────────────────── */}
      <section id="overview" className="section-pad-sm" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div className="glass-panel reveal" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem,2.8vw,2.1rem)', fontWeight: 800, marginBottom: '18px', color: 'var(--text-hi)' }}>{overview.heading}</h2>
            {Array.isArray(overview.body)
              ? overview.body.map((p, i) => <p key={i} style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.82, marginBottom: i < overview.body.length - 1 ? '14px' : 0 }}>{p}</p>)
              : <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.82 }}>{overview.body}</p>}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section id="features" className="section-pad" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Core Features</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>What We Deliver</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(275px,1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-card reveal" style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '11px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                  <i className={`fa-solid ${f.icon}`} style={{ fontSize: '1.2rem', color: 'var(--brand)' }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-hi)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────── */}
      <section className="section-pad section-raised" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '72px', alignItems: 'center' }}>
          <div className="reveal">
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Benefits</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '36px' }}>Why It Matters for Your Business</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {benefits.map((b, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className="fa-solid fa-check" style={{ color: '#fff', fontSize: '0.75rem' }} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-hi)', marginBottom: '4px' }}>{b.title}</h4>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <img src={useCases[0]?.img || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'}
              alt="Benefits" style={{ width: '100%', borderRadius: '20px', objectFit: 'cover', maxHeight: '480px', boxShadow: '0 20px 48px rgba(0,0,0,.06)', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────── */}
      <section id="process" className="section-pad" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Our Process</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>How We Work</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '20px' }}>
            {process.map((s, i) => (
              <div key={i} className="glass-card reveal" style={{ padding: '36px 28px', position: 'relative', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ position: 'absolute', top: '-12px', right: '-6px', fontSize: '6.5rem', fontWeight: 900, color: 'rgba(15,23,42,.02)', lineHeight: 1, userSelect: 'none', fontFamily: 'var(--font-head)' }}>{s.num}</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '0.8rem', color: '#fff' }}>{s.num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-hi)', marginBottom: '8px', position: 'relative', zIndex: 1 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', lineHeight: 1.65, position: 'relative', zIndex: 1 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ─────────────────────────────── */}
      <section className="section-pad section-alt" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Use Cases</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>Real-World Applications</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(255px,1fr))', gap: '24px' }}>
            {useCases.map((u, i) => (
              <div key={i} className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <img src={u.img} alt={u.title} className="img-hover" style={{ width: '100%', height: '175px', objectFit: 'cover' }} />
                <div style={{ padding: '22px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-hi)', marginBottom: '8px' }}>{u.title}</h3>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', lineHeight: 1.65 }}>{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────── */}
      <section className="section-pad" style={{ borderBottom: '1px solid var(--border)', textAlign: 'center', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '44px' }}>
            <span className="eyebrow" style={{ display: 'block', justifyContent: 'center', color: 'var(--brand)' }}>Technology Stack</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>Technologies We Use</h2>
          </div>
          <div className="reveal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {techs.map(t => <span key={t} className="tech-pill" style={{ background: 'rgba(15,23,42,0.015)', color: 'var(--text-mid)', border: '1px solid var(--border)' }}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* ── Blogs / Technical Articles ─────────────────────────────────── */}
      <section className="section-pad section-raised" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-raised)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '52px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Blogs & Tech Articles</span>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.8vw,2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>Latest Publications</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(275px,1fr))', gap: '24px' }}>
            {displayBlogs.map((b, i) => {
              // Handle WordPress post object format vs static backup format
              const isWp = !!b.id;
              const title = isWp ? b.title?.rendered : b.title;
              const desc = isWp 
                ? (b.excerpt?.rendered ? b.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 140) + '…' : '')
                : b.desc;
              const imgUrl = isWp 
                ? (b._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80')
                : b.img;
              const dateText = isWp 
                ? new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : b.date;
              const linkUrl = isWp ? `/blog/${b.id}` : '#read';

              return (
                <article key={i} className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <img src={imgUrl} alt={title} className="img-hover" style={{ width: '100%', height: '195px', objectFit: 'cover' }} />
                  <div style={{ padding: '22px' }}>
                    <span style={{ color: 'var(--brand)', fontSize: '0.74rem', fontWeight: 600 }}>{dateText}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-hi)', margin: '8px 0 10px', lineHeight: 1.4 }}>{title}</h3>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '14px' }}>{desc}</p>
                    {isWp ? (
                      <Link to={linkUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontWeight: 600, fontSize: '0.8rem' }}>
                        Read Article <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.68rem' }} />
                      </Link>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                        Read Article <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.68rem' }} />
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA / Contact ─────────────────────────── */}
      <section id="contact" className="section-pad" style={{ background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="contact-grid">
            <div className="reveal">
              <span className="eyebrow" style={{ color: 'var(--brand)' }}>Let's Build Together</span>
              <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '18px', lineHeight: 1.15 }}>
                {ctaHeading.split(' ').map((w, i, a) =>
                  i >= a.length - 2
                    ? <span key={i} style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{w} </span>
                    : <span key={i}>{w} </span>
                )}
              </h2>
              <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.78, marginBottom: '28px' }}>{ctaBody}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-hi)', fontSize: '0.92rem', marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-envelope" style={{ color: 'var(--brand)' }} />
                  <a href="mailto:enquiry@improxgroup.com" style={{ color: 'inherit', textDecoration: 'none' }}>enquiry@improxgroup.com</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-phone" style={{ color: 'var(--brand)' }} />
                  <a href="tel:+919156470600" style={{ color: 'inherit', textDecoration: 'none' }}>+91 91564 70600</a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default ServiceSubpageLayout;
