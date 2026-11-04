import { Link } from 'react-router-dom';

const perks = [
  { icon: 'fa-laptop-code', title: 'Cutting-Edge Tech Stack', desc: 'Work with modern frameworks, cloud-native architectures, LLMs, and distributed data systems.' },
  { icon: 'fa-arrow-trend-up', title: 'Career Acceleration', desc: 'Clear career pathways, mentorship from principal engineers, and fast-track growth for high performers.' },
  { icon: 'fa-scale-balanced', title: 'Work-Life Flexibility', desc: 'Flexible hours, remote/hybrid work options, and balanced sprint cadences that respect personal time.' },
  { icon: 'fa-heart-pulse', title: 'Health & Wellness', desc: 'Comprehensive medical coverage for you and your dependents with wellness programs.' },
  { icon: 'fa-graduation-cap', title: 'Learning & Certifications', desc: 'Dedicated annual learning budgets, AWS/GCP/Azure certification sponsorships, and hackathons.' },
  { icon: 'fa-champagne-glasses', title: 'Vibrant Culture', desc: 'Inclusive environment, annual company retreats, collaborative retrospectives, and social clubs.' },
];

const openPositions = [
  {
    role: 'Senior Full Stack Engineer (React / Node.js)',
    dept: 'Application Engineering',
    type: 'Full-time · Hybrid / Remote',
    location: 'Pune, India',
    desc: 'Lead the architecture and delivery of scalable enterprise platforms with React 18, TypeScript, Node.js, and microservices.',
  },
  {
    role: 'AI / Machine Learning Engineer',
    dept: 'AI & Data Lab',
    type: 'Full-time · On-site / Hybrid',
    location: 'Pune, India',
    desc: 'Build RAG pipelines, fine-tune open-source LLMs, and deploy production ML models using Python, PyTorch, and LangChain.',
  },
  {
    role: 'Cloud DevOps & SRE Specialist',
    dept: 'Technology Services',
    type: 'Full-time · Remote',
    location: 'Pune, India',
    desc: 'Architect resilient multi-cloud environments across AWS and Azure using Terraform, Kubernetes, and hardened CI/CD pipelines.',
  },
  {
    role: 'Senior UX / UI Product Designer',
    dept: 'Product Engineering',
    type: 'Full-time · Hybrid',
    location: 'Pune, India',
    desc: 'Translate complex enterprise workflows into intuitive, accessible design systems and high-fidelity interactive Figma prototypes.',
  },
  {
    role: 'Lead Data Engineer',
    dept: 'Data Engineering',
    type: 'Full-time · Hybrid / Remote',
    location: 'Pune, India',
    desc: 'Design and optimize streaming and batch ETL pipelines using Apache Spark, Snowflake, dbt, and Kafka for enterprise clients.',
  },
];

export default function CareersPage() {
  return (
    <main style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: '80px' }}>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: '120px 24px 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(248,250,252,.85) 0%,rgba(255,255,255,.6) 50%,rgba(248,250,252,.98) 100%)', zIndex: 1 }} />
        <div className="hero-blob hero-blob-1" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', top: '-10%', left: '-5%' }} />

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: 'var(--brand)', justifyContent: 'center' }}>
            <span className="glow-dot" /> Join Our Team
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 900, color: 'var(--text-hi)', lineHeight: 1.1, marginBottom: '22px', letterSpacing: '-0.03em' }}>
            Build the Future of{' '}
            <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Enterprise Tech & AI
            </span>
          </h1>
          <p style={{ color: 'var(--text-mid)', fontSize: '1.08rem', lineHeight: 1.8, maxWidth: '720px', margin: '0 auto 36px' }}>
            At Improx Tech, you work with world-class engineers, architects, and designers solving mission-critical challenges for enterprise organizations worldwide.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#positions" className="btn btn-primary" style={{ background: 'var(--grad-brand)' }}>
              View Open Roles <i className="fa-solid fa-arrow-down" />
            </a>
            <Link to="/contact" className="btn btn-secondary">
              General Inquiries
            </Link>
          </div>
        </div>
      </section>

      {/* ── Culture & Perks ── */}
      <section className="section-pad" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal active" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)', justifyContent: 'center' }}>Why Improx Tech</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>A Place to Do Your Best Work</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {perks.map((p, idx) => (
              <div key={idx} className="glass-card reveal active" style={{ padding: '36px 30px', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '22px' }}>
                  <i className={`fa-solid ${p.icon}`} style={{ fontSize: '1.25rem', color: 'var(--brand)' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-hi)', marginBottom: '10px' }}>{p.title}</h3>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.88rem', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section id="positions" className="section-pad">
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal active" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)', justifyContent: 'center' }}>Current Openings</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-hi)' }}>Explore Available Opportunities</h2>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.96rem', marginTop: '12px' }}>
              Don't see an exact match? Send your resume to <a href="mailto:enquiry@improxgroup.com" style={{ color: 'var(--brand)', fontWeight: 600 }}>enquiry@improxgroup.com</a>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {openPositions.map((pos, idx) => (
              <div key={idx} className="glass-card reveal active" style={{ padding: '32px 36px', border: '1px solid var(--border)', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ flex: '1 1 500px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,99,235,0.08)', color: 'var(--brand)' }}>
                      {pos.dept}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-lo)' }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: '5px' }} />{pos.type}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-lo)' }}>
                      <i className="fa-solid fa-location-dot" style={{ marginRight: '5px' }} />{pos.location}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '8px' }}>{pos.role}</h3>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.6 }}>{pos.desc}</p>
                </div>
                <div>
                  <Link to="/contact" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Apply Now <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
