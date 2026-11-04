import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_ROUTES, BASE_URL } from '../src/utils/seoData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "vite build" first.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

console.log('Generating pre-rendered SEO HTML files for all routes...');

let count = 0;

for (const [route, meta] of Object.entries(SEO_ROUTES)) {
  const canonicalUrl = `${BASE_URL}${route === '/' ? '' : route}`;
  let html = templateHtml;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${meta.title}</title>`);

  // 2. Replace Description
  if (html.includes('<meta name="description"')) {
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"/i,
      `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}"`
    );
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${meta.description.replace(/"/g, '&quot;')}">\n</head>`);
  }

  // 3. Replace Keywords
  if (html.includes('<meta name="keywords"')) {
    html = html.replace(
      /<meta\s+name="keywords"\s+content=".*?"/i,
      `<meta name="keywords" content="${meta.keywords.replace(/"/g, '&quot;')}"`
    );
  } else {
    html = html.replace('</head>', `  <meta name="keywords" content="${meta.keywords.replace(/"/g, '&quot;')}">\n</head>`);
  }

  // 4. Replace Canonical URL
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href=".*?"/i,
      `<link rel="canonical" href="${canonicalUrl}"`
    );
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}">\n</head>`);
  }

  // 5. Replace Open Graph Tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"/i,
    `<meta property="og:title" content="${meta.title.replace(/"/g, '&quot;')}"`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"/i,
    `<meta property="og:description" content="${meta.description.replace(/"/g, '&quot;')}"`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"/i,
    `<meta property="og:url" content="${canonicalUrl}"`
  );

  // 6. Replace Twitter Tags
  html = html.replace(
    /<meta\s+property="twitter:title"\s+content=".*?"/i,
    `<meta property="twitter:title" content="${meta.title.replace(/"/g, '&quot;')}"`
  );
  html = html.replace(
    /<meta\s+property="twitter:description"\s+content=".*?"/i,
    `<meta property="twitter:description" content="${meta.description.replace(/"/g, '&quot;')}"`
  );

  // Write file
  if (route === '/') {
    fs.writeFileSync(templatePath, html, 'utf8');
  } else {
    // Clean route string: remove leading slash
    const relativePath = route.replace(/^\//, '');
    const targetDir = path.join(distDir, relativePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
  }
  count++;
}

console.log(`Successfully generated SEO HTML files for all ${count} routes in dist/!`);
