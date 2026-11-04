import ContactForm from '../components/ContactForm';

const FAQ_ITEMS = [
  { q: 'How long does a typical discovery phase take?', a: 'For most mid-to-large custom software applications, a thorough discovery mapping, UX prototype, and architectural scoping phase takes between 1 and 3 weeks.' },
  { q: 'Can you scale up squads dynamically?', a: 'Yes. Our agile contract models allow us to scale squads up or down at sprint boundaries based on product objectives and feature backlogs.' },
  { q: 'How do you handle security and compliance?', a: 'Security is embedded in our design systems. We hold ISO 27001 certification, adhere to OWASP Top-10 dev guidelines, and automate vulnerability scanning in every deploy.' },
  { q: 'Do you offer post-launch maintenance SLA?', a: 'Absolutely. We offer tier 2 and tier 3 production support contracts with SLA-backed response times under 15 minutes for critical incidents.' }
];

function ContactPage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: '80px' }}>
      
      {/* ── Header ── */}
      <section style={{ position: 'relative', padding: '120px 24px 60px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(248,250,252,.85) 0%,rgba(255,255,255,.6) 50%,rgba(248,250,252,.98) 100%)', zIndex: 1 }} />
        <div className="hero-blob hero-blob-1" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', top: '-10%', left: '-5%' }} />
        
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="eyebrow" style={{ justifyContent: 'center', color: 'var(--brand)' }}>
            <span className="glow-dot" /> Contact Us
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900, color: 'var(--text-hi)', lineHeight: 1.1, marginBottom: '22px', letterSpacing: '-0.03em' }}>
            Let's Start a{' '}
            <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Conversation</span>
          </h1>
          <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '640px', margin: '0 auto' }}>
            Whether you need to scale your engineering capability, modernize infrastructure, or launch a new digital product, our architects are ready to assist.
          </p>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <section className="section-pad-sm" style={{ paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="contact-grid">
            
            {/* Info Panel */}
            <div className="reveal active" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '18px' }}>Global Offices & Delivery</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '32px' }}>
                  Our primary delivery center is located in Pune, India, serving enterprises globally with 24/7 support structures and reliable communications channels.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { icon: 'fa-location-dot', t: 'Pune Delivery HQ', d: 'Improx Tech, Baner Road, Pune, Maharashtra, India' },
                    { icon: 'fa-envelope',     t: 'Email Inquiry',  d: 'enquiry@improxgroup.com' },
                    { icon: 'fa-phone',        t: 'Call Us',        d: '+91 91564 70600 (Sales & Partnerships)' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)', flexShrink: 0 }}>
                        <i className={`fa-solid ${item.icon}`} />
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-hi)', marginBottom: '2px' }}>{item.t}</strong>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-mid)' }}>{item.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '20px' }}>Frequently Asked Questions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {FAQ_ITEMS.map((item, idx) => (
                    <div key={idx} style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-hi)', marginBottom: '6px' }}>Q: {item.q}</strong>
                      <p style={{ color: 'var(--text-mid)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Form Panel */}
            <div className="reveal active">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}

export default ContactPage;
