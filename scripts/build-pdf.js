import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
});

// Parse Args
const args = process.argv.slice(2);
const lang = args.find(arg => !arg.startsWith('--')) || 'en';
const isKdp = args.includes('--kdp');

const CHAPTERS_DIR = path.join(__dirname, `../ebook/chapters/${lang}`);
const ASSETS_DIR = path.join(__dirname, '../assets');
const PROJECT_ROOT = path.join(__dirname, '..');
const filename = `IndoCourse_Survival_Indonesian_${lang.toUpperCase()}${isKdp ? '_KDP' : ''}.pdf`;
const OUTPUT_FILE = path.join(__dirname, `../output/${filename}`);

function embedImages(html, basePath) {
  return html.replace(/<img\s+([^>]*?)src="([^"]+)"([^>]*)>/gi, (match, before, src, after) => {
    if (src.startsWith('data:')) return match;

    let imgPath;
    if (src.startsWith('../../../')) {
      imgPath = path.join(PROJECT_ROOT, src.replace('../../../', ''));
    } else if (src.startsWith('/')) {
      imgPath = path.join(PROJECT_ROOT, src);
    } else {
      imgPath = path.join(basePath, src);
    }

    if (!fs.existsSync(imgPath)) {
      console.warn(`Warning: Image not found: ${imgPath}`);
      return match;
    }

    const ext = path.extname(imgPath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    const imgData = fs.readFileSync(imgPath);
    const base64 = imgData.toString('base64');

    console.log(`  Embedded: ${path.basename(imgPath)}`);
    return `<img ${before}src="data:image/${mimeType};base64,${base64}"${after}>`;
  });
}

// Ensure output directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}

async function buildPdf() {
  console.log(`Starting PDF Build Process...`);
  console.log(`Language: ${lang}`);
  console.log(`Format: ${isKdp ? 'KDP (6x9 in)' : 'Digital (A4)'}`);
  console.log(`Source: ${CHAPTERS_DIR}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  if (!fs.existsSync(CHAPTERS_DIR)) {
    console.error(`Error: Directory not found: ${CHAPTERS_DIR}`);
    process.exit(1);
  }

  // 1. Load CSS
  const cssPath = path.join(ASSETS_DIR, 'styles/ebook.css');
  const cssContent = fs.readFileSync(cssPath, 'utf-8');

  // 2. Load Cover Image
  const coverPath = path.join(ASSETS_DIR, 'images/generated/cover.png');
  const coverImage = fs.readFileSync(coverPath);
  const coverBase64 = coverImage.toString('base64');
  const coverImgSrc = `data:image/png;base64,${coverBase64}`;

  // 3. Get Chapters
  const files = fs.readdirSync(CHAPTERS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} chapters.`);

  // Book metadata
  const bookTitle = 'Survival Indonesian';
  const bookSubtitle = '10 Lessons to Speak Like a Local in Bali';
  const authorName = 'Maciej Cupial';
  const website = 'indonesianbasics.com';

  // Author bio for author page
  const authorBio = `Maciej Cupial is a digital nomad living in Ubud, Bali. With a background in four languages (Polish, English, Spanish, German), he knows that traditional learning methods are often too slow for modern travelers.

Need driven innovation: he utilized AI to curate the most essential parts of Bahasa Indonesia, structuring them based on the effective learning frameworks he used to master European languages.

This ebook is the tool he built for himself to speak with locals immediately—fast, logical, and practical.`;

  // 4. Build HTML Content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        ${cssContent}
        ${isKdp ? `
          @page {
            size: 6in 9in;
            margin: 0.75in 0.5in 0.75in 0.5in;
          }
          body {
            font-size: 11pt;
          }
          .chapter {
            page-break-before: always;
          }
          .cover-title {
            font-size: 2.8rem;
          }
          .cover-subtitle {
            font-size: 1.1rem;
          }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="cover-page">
        <img src="${coverImgSrc}" class="cover-background" alt="">
        <div class="cover-overlay"></div>
        <div class="cover-content">
          <div class="cover-header">
            <h1 class="cover-title">${bookTitle}</h1>
            <p class="cover-subtitle">${bookSubtitle}</p>
          </div>
          <div class="cover-spacer"></div>
          <div class="cover-footer">
            <p class="cover-author">by ${authorName}</p>
            <p class="cover-website">${website}</p>
            <span class="cover-badge">Free eBook</span>
          </div>
        </div>
      </div>
  `;

  for (const file of files) {
    const filePath = path.join(CHAPTERS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    htmlContent += `<div class="page-break"></div>`;
    
    // Render Markdown
    const rendered = md.render(content);
    htmlContent += `<div class="chapter">${rendered}</div>`;
  }

  // Add author page at the end
  const authorBioHtml = authorBio.split('\n\n').map(p => `<p>${p}</p>`).join('');
  htmlContent += `
    <div class="author-page">
      <h2>About the Author</h2>
      <div class="author-bio">
        ${authorBioHtml}
      </div>
      <div class="footer">
        <p>Learn more at <strong>${website}</strong></p>
        <p>© 2025 ${authorName}. Free to share.</p>
      </div>
    </div>
    </body>
    </html>
  `;

  // 5. Embed all images as base64
  console.log('Embedding images...');
  htmlContent = embedImages(htmlContent, CHAPTERS_DIR);

  // 6. Generate PDF with Puppeteer
  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log('Setting content...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  console.log('Printing to PDF...');
  
  const pdfOptions = isKdp ? {
    path: OUTPUT_FILE,
    printBackground: true,
    width: '6in',
    height: '9in',
    margin: { top: '0cm', right: '0cm', bottom: '0cm', left: '0cm' }
  } : {
    path: OUTPUT_FILE,
    format: 'A4',
    printBackground: true,
    margin: { top: '0cm', right: '0cm', bottom: '0cm', left: '0cm' }
  };

  await page.pdf(pdfOptions);

  await browser.close();
  console.log(`PDF created successfully at: ${OUTPUT_FILE}`);
}

buildPdf().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});