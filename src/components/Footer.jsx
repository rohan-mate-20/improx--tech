import { Link } from 'react-router-dom';

const cols = [
  {
    heading: 'Services',
    links: [
      { label: 'Product Engineering',    to: '/services/product-engineering' },
      { label: 'Application Services',   to: '/services/application-services' },
      { label: 'Technology Services',    to: '/#services' },
      { label: 'AI & Business Intel.',   to: '/#services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',  to: '/#about' },
      { label: 'Our Work',  to: '/#work'  },
      { label: 'Blog',      to: '/blog'   },
      { label: 'Careers',   to: '/careers' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Get in Touch', to: '/contact'  },
      { label: 'Privacy Policy',to: '/#'       },
      { label: 'Terms of Use', to: '/#'        },
    ],
  },
];

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <Link to="/" className="logo">Improx<span>Tech</span></Link>
          <p>Building secure, scalable digital platforms and intelligent technology systems for enterprise organisations worldwide.</p>
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-mid)' }}>
            <a href="mailto:enquiry@improxgroup.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
              <i className="fa-solid fa-envelope" style={{ color: 'var(--brand)', width: '16px' }} /> enquiry@improxgroup.com
            </a>
            <a href="tel:+919156470600" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'inherit', textDecoration: 'none' }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--brand)', width: '16px' }} /> +91 91564 70600
            </a>
          </div>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
            <a href="https://twitter.com"  target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fa-brands fa-x-twitter" /></a>
            <a href="https://github.com"   target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fa-brands fa-github" /></a>
          </div>
        </div>
        {cols.map(col => (
          <div key={col.heading}>
            <h4>{col.heading}</h4>
            {col.links.map(l => <Link key={l.label} to={l.to}>{l.label}</Link>)}
          </div>
        ))}
      </div>
      <p className="footer-copy">© 2026 Improx Tech Pvt. Ltd. All rights reserved. · Crafted in Pune, India.</p>
    </footer>
  );
}

export default Footer;
