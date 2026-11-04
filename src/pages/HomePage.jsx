import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import { fetchFromWp } from '../utils/wpApi';
import '../styles/hero.css';

/* ── Rotating headlines ─────────────────────────────── */
const HEADLINES = [
  'Engineering enterprise software that scales.',
  'Accelerating digital transformation globally.',
  'AI-powered platforms. Measurable outcomes.',
];

/* ── Data ─────────────────────────────────────────── */
const SERVICES = [
  {
    icon: 'fa-box-open',
    title: 'Product Engineering',
    desc: 'End-to-end product strategy, UX, prototyping, QA and DevOps — from concept to continuous delivery.',
    to: '/services/product-engineering',
    accent: 'linear-gradient(135deg,#4F6EF7,#8B5CF6)',
    subServices: [
      { label: 'Product Strategy', to: '/services/product-engineering/product-strategy' },
      { label: 'UX / UI Design', to: '/services/product-engineering/ux-design' },
      { label: 'Rapid Prototyping', to: '/services/product-engineering/rapid-prototyping' },
      { label: 'QA & Testing', to: '/services/product-engineering/qa-testing' },
      { label: 'DevOps & CI/CD', to: '/services/product-engineering/devops' },
      { label: 'Open Source', to: '/services/product-engineering/open-source' },
    ],
  },
  {
    icon: 'fa-layer-group',
    title: 'Application Services',
    desc: 'Custom software, enterprise apps, SaaS, mobile, cloud and API solutions built for enterprise scale.',
    to: '/services/application-services',
    accent: 'linear-gradient(135deg,#00C6A2,#4F6EF7)',
    subServices: [
      { label: 'Custom Software', to: '/services/application-services/custom-software' },
      { label: 'Enterprise Apps', to: '/services/application-services/enterprise-applications' },
      { label: 'SaaS Development', to: '/services/application-services/saas-development' },
      { label: 'Mobile Apps', to: '/services/application-services/mobile-app-development' },
      { label: 'Web Applications', to: '/services/application-services/web-applications' },
      { label: 'Cloud Applications', to: '/services/application-services/cloud-applications' },
      { label: 'API Development', to: '/services/application-services/api-development' },
      { label: 'System Integration', to: '/services/application-services/system-integration' },
      { label: 'Legacy Modernization', to: '/services/application-services/legacy-modernization' },
      { label: 'Maintenance & Support', to: '/services/application-services/maintenance-support' },
    ],
  },
  {
    icon: 'fa-server',
    title: 'Technology Services',
    desc: 'Cloud migration, DevSecOps, cybersecurity and infrastructure management for resilient operations.',
    to: '/services/technology-services',
    accent: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    subServices: [
      { label: 'Cloud Migration', to: '/services/technology-services/cloud-migration' },
      { label: 'DevSecOps', to: '/services/technology-services/devsecops' },
      { label: 'Data Engineering', to: '/services/technology-services/data-engineering' },
      { label: 'Cybersecurity', to: '/services/technology-services/cybersecurity' },
      { label: 'Infrastructure Mgmt', to: '/services/technology-services/infrastructure' },
      { label: 'IoT Solutions', to: '/services/technology-services/iot' },
    ],
  },
  {
    icon: 'fa-brain',
    title: 'AI & Business Intelligence',
    desc: 'Generative AI, machine learning, predictive analytics and intelligent automation at enterprise scale.',
    to: '/services/ai-ml',
    accent: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
    subServices: [
      { label: 'Generative AI', to: '/services/ai-ml/generative-ai' },
      { label: 'Machine Learning', to: '/services/ai-ml/machine-learning' },
      { label: 'Business Intelligence', to: '/services/ai-ml/business-intelligence' },
      { label: 'NLP & Automation', to: '/services/ai-ml/nlp-automation' },
      { label: 'Data Visualisation', to: '/services/ai-ml/data-visualisation' },
      { label: 'Predictive Analytics', to: '/services/ai-ml/predictive-analytics' },
    ],
  },
];

const STATS = [
  { value: 300,  suffix: '+',    label: 'Enterprise Clients'   },
  { value: 1200, suffix: '+',    label: 'Projects Delivered'   },
  { value: 15,   suffix: ' Yrs', label: 'Industry Experience'  },
  { value: 98,   suffix: '%',    label: 'Client Retention'     },
];

const CASE_STUDIES = [
  {
    title: 'Enterprise ERP Modernization',
    tags: 'Cloud · Modernization',
    result: '38% TCO Reduction',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
    desc: 'Unified 12 legacy modules into a cloud-native platform for a global manufacturing group.',
  },
  {
    title: 'AI-Powered Support Automation',
    tags: 'AI · Automation',
    result: '78% Faster Resolution',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=700&q=80',
    desc: 'NLP ticket triage system cutting average handle time from 18 minutes to under 4.',
  },
  {
    title: 'Real-Time BI Platform',
    tags: 'Data · Analytics',
    result: '5× Faster Insights',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
    desc: 'Consolidated multi-source data into a unified BI layer for real-time executive decisions.',
  },
];

// Fallback BLOGS list if WordPress is offline
const FALLBACK_BLOGS = [
  {
    category: 'Cloud',
    date: 'June 10, 2026',
    title: 'The Future of Cloud Native Applications in 2026',
    desc: 'How containerization and platform engineering are redefining enterprise software delivery.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80',
  },
  {
    category: 'Security',
    date: 'May 28, 2026',
    title: 'Zero Trust Architecture at Scale',
    desc: 'A practical guide to securing enterprise endpoints and network perimeters in 2026.',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=700&q=80',
  },
  {
    category: 'AI',
    date: 'May 15, 2026',
    title: 'LLMs in Enterprise: Beyond the Hype',
    desc: 'Where Generative AI is delivering real, measurable value in enterprise operations.',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=700&q=80',
  },
];

/* ── ServiceHoverCard ───────────────────────────────── */
function ServiceHoverCard({ service }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="glass-card reveal" 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        padding: '32px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        minHeight: '380px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'none',
        borderColor: hovered ? 'rgba(37, 99, 235, 0.35)' : 'var(--border)',
      }}
    >
      {/* Icon & Title - stays visible */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: service.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={`fa-solid ${service.icon}`} style={{ fontSize: '1.3rem', color: '#fff' }} />
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-hi)', margin: 0 }}>{service.title}</h3>
      </div>

      {/* Container holding both panels with smooth opacity/slide transition */}
      <div style={{ position: 'relative', flex: 1, zIndex: 2, overflow: 'hidden', marginTop: '8px' }}>
        
        {/* Description Panel (Visible by default, fades out on hover) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hovered ? 0 : 1,
          transform: hovered ? 'translateY(-20px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: hovered ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <p style={{ color: 'var(--text-mid)', fontSize: '0.88rem', lineHeight: 1.7 }}>
            {service.desc}
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontWeight: 600, fontSize: '0.82rem', marginTop: 'auto' }}>
            Hover to view capabilities <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem' }} />
          </span>
        </div>

        {/* Sub-services List Panel (Fades in and slides up on hover) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: hovered ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}>
          <p style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-lo)', margin: '0 0 4px' }}>
            Capabilities:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {service.subServices.map((sub, idx) => (
              <Link
                key={idx}
                to={sub.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-mid)',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 500,
                  transition: 'color 0.2s, padding-left 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '4px'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-mid)'; e.currentTarget.style.paddingLeft = '0px'; }}
              >
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
                {sub.label}
              </Link>
            ))}
          </div>
          <Link
            to={service.to}
            style={{
              marginTop: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--brand)',
              fontWeight: 600,
              fontSize: '0.82rem',
              textDecoration: 'none',
              paddingTop: '8px',
            }}
          >
            Explore Main Practice <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────── */
function Hero() {
  const [idx, setIdx] = useState(0);
  const text = useMemo(() => HEADLINES[idx], [idx]);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HEADLINES.length), 3400);
    return () => clearInterval(t);
  }, []);

  const [activeNode, setActiveNode] = useState(0);

  // 4 random positions to shift nodes off-center or add float offsets
  const SERVICES_NODES = [
    {
      title: 'Product Engineering',
      icon: 'fa-rocket',
      color: '#2563EB',
      desc: 'Human-centred UX/UI design systems, rapid prototypes, automated QA pipelines and continuous DevOps deployment.',
      to: '/services/product-engineering',
      floatClass: 'float-node-1',
      sub: [
        { label: 'Product Strategy', to: '/services/product-engineering/product-strategy' },
        { label: 'UX/UI Design', to: '/services/product-engineering/ux-design' },
        { label: 'Rapid Prototyping', to: '/services/product-engineering/rapid-prototyping' },
        { label: 'QA & Testing', to: '/services/product-engineering/qa-testing' },
        { label: 'DevOps & CI/CD', to: '/services/product-engineering/devops' },
        { label: 'Open Source', to: '/services/product-engineering/open-source' }
      ]
    },
    {
      title: 'Application Services',
      icon: 'fa-layer-group',
      color: '#06B6D4',
      desc: 'Bespoke custom systems, multi-tenant SaaS architectures, mobile applications, and enterprise systems integration.',
      to: '/services/application-services',
      floatClass: 'float-node-2',
      sub: [
        { label: 'Custom Software', to: '/services/application-services/custom-software' },
        { label: 'Enterprise Apps', to: '/services/application-services/enterprise-applications' },
        { label: 'SaaS Dev', to: '/services/application-services/saas-development' },
        { label: 'Mobile Apps', to: '/services/application-services/mobile-app-development' },
        { label: 'Web Applications', to: '/services/application-services/web-applications' },
        { label: 'API Development', to: '/services/application-services/api-development' }
      ]
    },
    {
      title: 'Technology Services',
      icon: 'fa-server',
      color: '#4F46E5',
      desc: 'Hardened cloud migrations, cybersecurity, DevSecOps compliance, and enterprise data warehousing.',
      to: '/services/technology-services',
      floatClass: 'float-node-3',
      sub: [
        { label: 'Cloud Migration', to: '/services/technology-services/cloud-migration' },
        { label: 'DevSecOps', to: '/services/technology-services/devsecops' },
        { label: 'Data Engineering', to: '/services/technology-services/data-engineering' },
        { label: 'Cybersecurity', to: '/services/technology-services/cybersecurity' },
        { label: 'Managed Cloud', to: '/services/technology-services/infrastructure' },
        { label: 'IoT Solutions', to: '/services/technology-services/iot' }
      ]
    },
    {
      title: 'AI & Analytics',
      icon: 'fa-brain',
      color: '#8B5CF6',
      desc: 'Generative AI LLM integration, custom machine learning, real-time BI dashboards, and predictive forecasting.',
      to: '/services/ai-ml',
      floatClass: 'float-node-4',
      sub: [
        { label: 'Generative AI', to: '/services/ai-ml/generative-ai' },
        { label: 'Machine Learning', to: '/services/ai-ml/machine-learning' },
        { label: 'BI & Analytics', to: '/services/ai-ml/business-intelligence' },
        { label: 'NLP Automation', to: '/services/ai-ml/nlp-automation' },
        { label: 'Data Visualisation', to: '/services/ai-ml/data-visualisation' },
        { label: 'Predictive', to: '/services/ai-ml/predictive-analytics' }
      ]
    }
  ];

  const currentNode = SERVICES_NODES[activeNode] || SERVICES_NODES[0];
  const activeNodeColor = currentNode.color;

  return (
    <section className="hero-section" style={{ paddingTop: 0, background: 'var(--bg-base)' }}>
      {/* Soft Light Gradients with Subtle Ambient Glows */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(155deg, rgba(248,250,252,0.95) 0%, rgba(37,99,235,0.03) 50%, rgba(248,250,252,0.99) 100%)', zIndex: 2 }} />
        <div className="hero-overlay" />
        <img className="hero-bg-img" src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80" alt="" style={{ opacity: 0.08 }} />
      </div>

      {/* Floating watercolor blobs */}
      <div className="hero-blob hero-blob-1" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', top: '-150px', left: '-100px', width: '650px', height: '650px' }} />
      <div className="hero-blob hero-blob-2" style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)', bottom: '-100px', right: '-50px', width: '550px', height: '550px' }} />

      {/* Content Grid (lifted higher by reducing padding-top) */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '1240px', margin: '0 auto', padding: '0 24px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center', paddingTop: '110px', paddingBottom: '80px' }}>

        <div className="reveal active" style={{ transform: 'translateY(-15px)', transitionDelay: '0.1s' }}>
          <span className="eyebrow" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)', padding: '6px 14px', borderRadius: '99px', color: 'var(--brand)' }}>
            <span className="glow-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} /> Pune, India &nbsp;·&nbsp; Global Digital Engineering
          </span>
          <h1 style={{ fontSize: 'clamp(3rem,6vw,5.5rem)', fontWeight: 900, lineHeight: 1.02, marginBottom: '18px', color: 'var(--text-hi)', letterSpacing: '-0.04em' }}>
            <span style={{ display: 'inline-block', animation: 'fadeInTab 0.8s cubic-bezier(0.16,1,0.3,1) both' }}>Improx</span>
            <span style={{ display: 'inline-block', background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginLeft: '12px', animation: 'fadeInTab 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both' }}>Tech</span>
          </h1>
          <p className="hero-rotator" style={{ fontSize: 'clamp(1.2rem,2.4vw,1.75rem)', color: 'var(--brand)', fontWeight: 700, minHeight: '2.8rem', lineHeight: 1.4, marginBottom: '22px' }}>
            {text}
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-mid)', maxWidth: '540px', lineHeight: 1.8, marginBottom: '38px' }}>
            We engineer mission-critical digital systems. Accelerate your enterprise with next-generation cloud architectures, bespoke software delivery, and automated intelligence.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary" style={{ fontSize: '0.94rem', padding: '14px 34px', background: 'var(--grad-brand)', boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)' }}>
              Get Started <i className="fa-solid fa-arrow-right" />
            </Link>
            <a href="#services" className="btn btn-secondary" style={{ fontSize: '0.94rem', padding: '14px 34px', background: 'rgba(15,23,42,0.04)', color: 'var(--text-hi)', border: '1px solid var(--border)' }}>
              Explore Services
            </a>
          </div>
        </div>

        {/* ── DYNAMIC SERVICES CONSTELLATION MAP ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
          
          <div style={{ 
            position: 'relative', 
            width: '380px', 
            height: '380px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            padding: '20px'
          }}>
            
            {/* Ambient background ring glow with ecosystem.png asset blurred subtly */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1.5px dashed rgba(37,99,235,0.2)', animation: 'spin 40s linear infinite', zIndex: 0 }} />
            <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '50%', border: '1px solid rgba(6,182,212,0.15)', animation: 'spin 20s linear infinite reverse', zIndex: 0 }} />
            
            {/* Holographic generated visual asset backdrop */}
            <img src="/src/assets/images/ecosystem.png" alt="" style={{ position: 'absolute', width: '240px', height: '240px', objectFit: 'contain', opacity: 0.18, filter: 'blur(2px)', zIndex: 0 }} />

            {/* Orbiting Laser Particle Satellites */}
            <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', animation: 'spin 10s linear infinite', zIndex: 1 }}>
              <div style={{ position: 'absolute', top: '0', left: '50%', width: '10px', height: '10px', borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 15px #06B6D4, 0 0 30px #06B6D4' }} />
            </div>
            <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', animation: 'spin 6s linear infinite reverse', zIndex: 1 }}>
              <div style={{ position: 'absolute', bottom: '0', left: '50%', width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 12px #8B5CF6, 0 0 24px #8B5CF6' }} />
            </div>

            {/* SVG Connecting laser lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <defs>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                  <stop offset="100%" stopColor={activeNodeColor} stopOpacity="1" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {(() => {
                const angle = (activeNode * 90 * Math.PI) / 180;
                const radius = 135;
                const x2 = 190 + radius * Math.cos(angle);
                const y2 = 190 + radius * Math.sin(angle);
                return (
                  <line 
                    x1="190" 
                    y1="190" 
                    x2={x2} 
                    y2={y2} 
                    stroke="url(#laserGrad)" 
                    strokeWidth="4" 
                    filter="url(#glow)"
                    strokeDasharray="8 4"
                    style={{ transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                );
              })()}
            </svg>

            {/* Central Glow Core */}
            <div style={{ 
              position: 'absolute', 
              zIndex: 2, 
              width: '124px', 
              height: '124px', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.95)', 
              border: '1.5px solid var(--brand)', 
              boxShadow: '0 10px 40px rgba(37,99,235,0.2), inset 0 0 15px rgba(37,99,235,0.1)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center', 
              padding: '10px',
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 900, color: 'var(--text-lo)', letterSpacing: '2px' }}>Improx</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--brand)', fontWeight: 950 }}>Ecosystem</strong>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand)', marginTop: '6px', animation: 'pulse 1.2s infinite', boxShadow: '0 0 8px var(--brand)' }} />
            </div>

             {/* Orbiting Service Nodes */}
            {SERVICES_NODES.map((node, i) => {
              const isActive = activeNode === i;
              
              // Map nodes onto the circular path
              const angle = (i * 90 * Math.PI) / 180;
              const radius = 135; // Orbit radius
              const x = Math.round(radius * Math.cos(angle));
              const y = Math.round(radius * Math.sin(angle));

              return (
                <button
                  key={node.title}
                  onClick={() => setActiveNode(i)}
                  className={node.floatClass}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 28px)`,
                    top: `calc(50% + ${y}px - 28px)`,
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: isActive ? node.color : 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid',
                    borderColor: isActive ? node.color : 'rgba(15, 23, 42, 0.1)',
                    boxShadow: isActive ? `0 0 30px ${node.color}80, 0 4px 12px rgba(0,0,0,0.1)` : 'var(--shadow-card)',
                    color: isActive ? '#FFFFFF' : 'var(--text-hi)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                    zIndex: 3,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.borderColor = node.color;
                      e.currentTarget.style.color = node.color;
                      e.currentTarget.style.boxShadow = `0 0 20px ${node.color}40`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.1)';
                      e.currentTarget.style.color = 'var(--text-hi)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    }
                  }}
                >
                  <i className={`fa-solid ${node.icon}`} style={{ fontSize: '1.35rem' }} />
                  {/* Outer label */}
                  <span style={{
                    position: 'absolute',
                    top: y > 0 ? '64px' : '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: isActive ? 'var(--brand)' : 'var(--text-mid)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isActive ? `1.5px solid ${node.color}` : '1.5px solid var(--border)',
                    boxShadow: isActive ? `0 4px 15px ${node.color}20` : '0 4px 12px rgba(15,23,42,0.04)',
                    opacity: isActive ? 1 : 0.85,
                    transition: 'all 0.3s'
                  }}>
                    {node.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Node Detail Card */}
          <div className="glass-card reveal active" style={{ width: '100%', maxWidth: '480px', padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-raise)' }}>
            <div key={activeNode} style={{ animation: 'fadeInTab 0.4s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentNode.color, boxShadow: `0 0 10px ${currentNode.color}` }} />
                <h4 style={{ color: 'var(--text-hi)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  {currentNode.title}
                </h4>
              </div>
              <p style={{ color: 'var(--text-mid)', fontSize: '0.88rem', lineHeight: 1.65, margin: '0 0 20px 0' }}>
                {currentNode.desc}
              </p>

              {/* Orbit Sub-services Flow */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-lo)', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                  Core Capabilities
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentNode.sub.map((subText, idx) => (
                    <Link
                      key={subText.label}
                      to={subText.to}
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--brand)',
                        background: 'rgba(37,99,235,0.05)',
                        border: '1px solid var(--border)',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        animation: `fadeInTab 0.3s ease-out ${idx * 0.05}s both`
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = currentNode.color;
                        e.currentTarget.style.background = currentNode.color;
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'rgba(37,99,235,0.05)';
                        e.currentTarget.style.color = 'var(--brand)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {subText.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{ color: 'var(--text-lo)' }}>
        <i className="fa-solid fa-chevron-down" />
        Scroll
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────── */
function HomePage() {
  const [homePosts, setHomePosts] = useState(FALLBACK_BLOGS);

  useEffect(() => {
    const fetchHomeWpPosts = async () => {
      try {
        const posts = await fetchFromWp('/posts?per_page=3&_embed');
        if (posts && posts.length > 0) {
          setHomePosts(posts);
        }
      } catch (err) {
        console.warn('WordPress offline, showing fallback home posts:', err);
      }
    };
    fetchHomeWpPosts();
  }, []);

  return (
    <>
      <Hero />

      {/* ── Services Overview ── */}
      <section id="services" className="section-pad">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '56px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>What We Do</span>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)', maxWidth: '520px' }}>Four Practices. One Integrated Partner.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px' }}>
            {SERVICES.map((s, i) => (
              <ServiceHoverCard key={i} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="section-pad section-raised" style={{ background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="about-grid">
            <div className="reveal">
              <span className="eyebrow" style={{ color: 'var(--brand)' }}>About Improx Tech</span>
              <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '20px' }}>
                Engineering future-ready technology for{' '}
                <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ambitious enterprises
                </span>
              </h2>
              <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
                Improx Tech is a premier digital engineering partner helping organisations globally to modernise systems, accelerate software delivery, and unlock the full potential of their data.
              </p>
              <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '40px' }}>
                With deep expertise across cloud, AI, and enterprise application engineering, our teams operate as an extension of yours — aligned to your goals, transparent in execution, relentless in delivery quality.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '36px' }}>
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className="stat-num" style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}><span data-count={s.value}>0</span>{s.suffix}</div>
                    <div className="stat-label" style={{ color: 'var(--text-mid)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary" style={{ background: 'var(--grad-brand)' }}>Start a Project</Link>
                <Link to="/#work" className="btn btn-outline">View Our Work</Link>
              </div>
            </div>

            <div className="reveal" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-raise)' }}>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80" 
                alt="Improx Tech software development team collaborating"
                style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '380px', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(248,250,252,0.85) 0%, transparent 100%)' }} />
              {/* floating badge */}
              <div className="glass-card" style={{ position: 'absolute', bottom: '-20px', left: '-20px', padding: '16px 22px', borderRadius: '14px', maxWidth: '220px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#fff', fontSize: '0.8rem' }} />
                  </div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-hi)' }}>ISO 27001 Certified</strong>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.75rem', margin: 0 }}>Security-first across all projects.</p>
              </div>
              <div className="glass-card" style={{ position: 'absolute', top: '20px', right: '-16px', padding: '14px 18px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-hi)' }}>24/7 Support Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section id="work" className="section-pad">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '56px' }}>
            <span className="eyebrow" style={{ color: 'var(--brand)' }}>Case Studies</span>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)' }}>Featured Engagements</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
            {CASE_STUDIES.map((cs, i) => (
              <article key={i} className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={cs.img} alt={cs.title} className="img-hover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge" style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--brand)', color: '#fff', border: 'none' }}>{cs.result}</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ color: 'var(--brand)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>{cs.tags}</p>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-hi)', marginBottom: '10px' }}>{cs.title}</h3>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.87rem', lineHeight: 1.65 }}>{cs.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Innovation Video Lab ── */}
      <section className="section-pad section-alt" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
            <div className="reveal">
              <span className="eyebrow" style={{ color: 'var(--brand)' }}><span className="glow-dot" style={{ background: 'var(--brand)' }} /> Innovation Lab</span>
              <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '20px' }}>
                Developing software at the speed of thought
              </h2>
              <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '22px' }}>
                See how our distributed engineering teams use modern CI/CD tooling, automated testing suites, and containerized architectures to deliver high-quality platforms.
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ color: 'var(--text-hi)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>Cloud Pipelines</h4>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>Auto-deployments built on secure Docker & Kubernetes server nodes.</p>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <h4 style={{ color: 'var(--text-hi)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>Continuous Delivery</h4>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>Changes compiled, fully tested, and securely deployed in under 20 minutes.</p>
                </div>
              </div>
            </div>
            
            {/* Interactive Image Frame */}
            <div className="reveal" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-raise)' }}>
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80" 
                alt="Improx Tech server network cloud infrastructure"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '340px' }}
              />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'var(--bg-card)', padding: '12px 18px', borderRadius: '10px', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', display: 'block', letterSpacing: '1px' }}>Global Server Node</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-hi)', fontWeight: 600 }}>Active Cloud Analytics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-mid)' }}>Live Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog ── */}
      <section id="blog" className="section-pad section-raised">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="reveal" style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--brand)' }}>Latest Insights</span>
              <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)' }}>News & Articles</h2>
            </div>
            <Link to="/blog" className="btn btn-outline" style={{ fontSize: '0.88rem' }}>View All <i className="fa-solid fa-arrow-right" /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
            {homePosts.map((b, i) => {
              const isWp = !!b.id;
              const title = isWp ? b.title?.rendered : b.title;
              const desc = isWp
                ? (b.excerpt?.rendered ? b.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 120) + '…' : '')
                : b.desc;
              const imgUrl = isWp
                ? (b._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80')
                : b.img;
              const dateText = isWp
                ? new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : b.date;
              const category = isWp ? 'Tech Article' : b.category;
              const linkUrl = isWp ? `/blog/${b.id}` : '#read';

              return (
                <article key={i} className="glass-card reveal" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img src={imgUrl} alt={title} className="img-hover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '14px', left: '14px', padding: '3px 12px', background: 'var(--grad-brand)', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, color: '#fff' }}>{category}</span>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{ color: 'var(--brand)', fontSize: '0.76rem', fontWeight: 600 }}>{dateText}</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-hi)', margin: '8px 0 10px', lineHeight: 1.4 }}>{title}</h3>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.86rem', lineHeight: 1.65, marginBottom: '16px' }}>{desc}</p>
                    {isWp ? (
                      <Link to={linkUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>
                        Read Article <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.68rem' }} />
                      </Link>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--brand)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
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

      {/* ── Contact ── */}
      <section id="contact" className="section-pad">
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="contact-grid">
            <div className="reveal">
              <span className="eyebrow" style={{ color: 'var(--brand)' }}>Contact Us</span>
              <h2 style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', fontWeight: 800, color: 'var(--text-hi)', marginBottom: '18px' }}>
                Let's discuss your next{' '}
                <span style={{ background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  technology milestone
                </span>
              </h2>
              <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.78, marginBottom: '36px' }}>
                Tell us your goals — our team will define a practical roadmap for product engineering, cloud transformation or AI implementation.
              </p>
              {[
                { icon: 'fa-location-dot', text: 'Pune, India · Global Delivery' },
                { icon: 'fa-phone',        text: '+91 91564 70600'              },
                { icon: 'fa-envelope',     text: 'enquiry@improxgroup.com'      },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', color: 'var(--text-hi)', fontSize: '0.95rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37,99,235,.08)', border: '1px solid rgba(37,99,235,.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-lt)', flexShrink: 0 }}>
                    <i className={`fa-solid ${item.icon}`} />
                  </div>
                  {item.text}
                </div>
              ))}

              {/* Testimonial */}
              <div className="glass-card" style={{ padding: '22px 26px', display: 'flex', gap: '14px', marginTop: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Client" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <p style={{ color: 'var(--text-mid)', fontSize: '0.86rem', lineHeight: 1.65, marginBottom: '8px' }}>
                    "Improx Tech delivered our entire platform in 14 weeks — on time, on budget, beyond expectations."
                  </p>
                  <strong style={{ fontSize: '0.8rem', color: 'var(--text-hi)' }}>— CTO, Global FinTech Firm</strong>
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

export default HomePage;
