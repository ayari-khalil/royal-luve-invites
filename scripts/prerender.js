import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const invitationsPath = path.resolve(rootDir, 'public/invitations.json');
const indexHtmlPath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(invitationsPath)) {
  console.error("invitations.json not found");
  process.exit(1);
}

if (!fs.existsSync(indexHtmlPath)) {
  console.error("dist/index.html not found. Run npm run build first.");
  process.exit(1);
}

const invitations = JSON.parse(fs.readFileSync(invitationsPath, 'utf8'));
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

invitations.forEach((inv) => {
  const title = `${inv.brideName} و ${inv.groomName} — دعوة زفاف`;
  const description = `يتشرف العروسان بدعوتكم لحضور حفل زفافهم في ${inv.venue}. حضوركم يكتمل به بهاؤنا.`;
  const image = inv.photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80';

  let customizedHtml = indexHtml;
  
  // Clean existing title
  customizedHtml = customizedHtml.replace(/<title>.*?<\/title>/g, '');
  
  // Clean existing Open Graph and description tags if they exist in the root index.html template
  customizedHtml = customizedHtml.replace(/<meta property="og:.*?"\s*\/?>/g, '');
  customizedHtml = customizedHtml.replace(/<meta name="description"\s*\/?>/g, '');

  const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Royal Luxe Invites" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  `;

  // Inject right before </head>
  customizedHtml = customizedHtml.replace('</head>', `${metaTags}\n</head>`);

  // Write for /invitation/[slug]
  const invRouteDir = path.resolve(distDir, 'invitation', inv.slug);
  fs.mkdirSync(invRouteDir, { recursive: true });
  fs.writeFileSync(path.resolve(invRouteDir, 'index.html'), customizedHtml, 'utf8');

  // Write for /marriage/[slug]
  const marRouteDir = path.resolve(distDir, 'marriage', inv.slug);
  fs.mkdirSync(marRouteDir, { recursive: true });
  fs.writeFileSync(path.resolve(marRouteDir, 'index.html'), customizedHtml, 'utf8');

  console.log(`Pre-rendered metadata routes for slug: ${inv.slug}`);
});
