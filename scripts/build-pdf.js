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

// Extract unit number and title from filename
function parseChapterFilename(filename) {
  // Format: 01-greetings-introductions.md
  const match = filename.match(/^(\d+)-(.+)\.md$/);
  if (!match) return { number: '1', title: filename };

  const number = parseInt(match[1], 10).toString();
  const slug = match[2];

  // Convert slug to title: greetings-introductions -> Greetings & Introductions
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(' And ', ' & ');

  return { number, title };
}

// Generate chapter divider HTML
function generateChapterDivider(number, title) {
  return `
    <div class="chapter-divider full-bleed-page">
      <div class="chapter-divider-number">${number}</div>
      <div class="chapter-divider-label">UNIT</div>
      <div class="chapter-divider-title">${title.toUpperCase()}</div>
    </div>
  `;
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

  // 2. Load Cover Image (optional - for abstract B graphic)
  let coverImgSrc = '';
  const coverPath = path.join(ASSETS_DIR, 'images/generated/cover.jpg');
  if (fs.existsSync(coverPath)) {
    const coverImage = fs.readFileSync(coverPath);
    const coverBase64 = coverImage.toString('base64');
    coverImgSrc = `data:image/jpeg;base64,${coverBase64}`;
  }

  // 3. Get Chapters
  const files = fs.readdirSync(CHAPTERS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} chapters.`);

  // Book metadata
  const bookTitle = 'Learn Indonesian';
  const bookTagline = 'the fun way!';
  const bookSubtitle = 'Beginner Course (A1-A2)';
  const bookSubtitle2 = '10 lessons to speak like a local';
  const authors = {
    primary: 'Maciej Cupial',
    secondary: 'Fawwaz Faishal'
  };
  const website = 'indonesianbasics.com';

  // Author bios for author page
  const authorBios = {
    maciej: {
      name: 'Maciej Cupial',
      role: 'Content Architect',
      bio: `A digital nomad based in Ubud, Bali. Having learned four languages (Polish, English, Spanish, German), Maciej understands that traditional textbooks move too slowly for modern travelers.

He designed this course using the same frameworks that helped him master European languages—focusing on high-frequency phrases and practical patterns that deliver results fast.

This ebook started as his personal study tool: structured, logical, and built for real conversations.`
    },
    fawwaz: {
      name: 'Fawwaz Faishal',
      role: 'Language Expert',
      bio: `A native Indonesian speaker with years of experience teaching Bahasa Indonesia to foreigners. Fawwaz ensures every phrase in this book sounds natural and is actually used by locals.

His deep understanding of both formal Indonesian and everyday colloquial speech helps learners avoid the stiff, textbook language that marks tourists as outsiders.

From proper titles (Mas, Mba, Pak, Bu) to authentic pronunciation, Fawwaz bridges the gap between classroom Indonesian and street-level fluency.`
    }
  };

  // Load author images if they exist
  function loadAuthorImage(filename) {
    const imgPath = path.join(PROJECT_ROOT, 'public/images/authors', filename);
    if (fs.existsSync(imgPath)) {
      const imgData = fs.readFileSync(imgPath);
      const ext = path.extname(imgPath).toLowerCase().slice(1);
      const mimeType = ext === 'jpg' ? 'jpeg' : ext;
      console.log(`  Embedded author image: ${filename}`);
      return `data:image/${mimeType};base64,${imgData.toString('base64')}`;
    }
    console.log(`  Author image not found: ${filename}`);
    return null;
  }

  const maciejImg = loadAuthorImage('maciej.jpg');
  const fawwazImg = loadAuthorImage('fawwaz.jpg');

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
            font-size: 2.5rem;
          }
          .cover-tagline {
            font-size: 1.5rem;
          }
          .chapter-divider-number {
            font-size: 140px;
          }
          .chapter-divider-title {
            font-size: 22px;
          }
        ` : ''}
      </style>
    </head>
    <body>
      <div class="full-bleed-page" style="height: 100vh; width: 100%; position: relative; display: flex; flex-direction: column; page-break-after: always; overflow: hidden; background-color: #65a9a5;">
        ${coverImgSrc ? `<img src="${coverImgSrc}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; z-index: 0;" alt="">` : ''}
        <div style="position: relative; z-index: 2; display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
          <div style="text-align: center; flex: 0 0 auto; margin-top: 0; margin-bottom: auto; padding: 3rem 3rem 8rem; background: linear-gradient(to bottom, #65a9a5 0%, rgba(101,169,165,0.95) 50%, rgba(101,169,165,0.7) 75%, transparent 100%);">
            <h1 style="font-family: 'Inter', sans-serif; font-size: 3.5rem; font-weight: 900; color: #FFFFFF; margin: 0 0 0.15em 0; padding: 0; line-height: 1.0; letter-spacing: -0.02em; border: none; background: transparent;">${bookTitle}</h1>
            <p style="font-family: 'Inter', sans-serif; font-size: 2.2rem; font-weight: 700; color: #FFE66D; margin: 0 0 0.35em 0; padding: 0; line-height: 1.1; border: none; background: transparent;">${bookTagline}</p>
            <p style="font-family: 'Inter', sans-serif; font-size: 1.4rem; font-weight: 500; color: rgba(255,255,255,0.9); margin: 0; padding: 0; border: none; background: transparent;">${bookSubtitle}</p>
          </div>
          <div style="position: absolute; bottom: 0; left: 0; right: 0; text-align: center; padding: 1.2rem 2rem 1.5rem;">
            <p style="font-family: 'Inter', sans-serif; font-size: 1.4rem; font-weight: 500; color: rgba(255,255,255,0.95); margin: 0 0 0.4rem 0; border: none; background: transparent;">${bookSubtitle2}</p>
            <p style="font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.8); margin: 0; border: none; background: transparent;">${authors.primary} & ${authors.secondary}</p>
          </div>
        </div>
      </div>
  `;

  // Process each chapter
  for (const file of files) {
    const filePath = path.join(CHAPTERS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Parse chapter info from filename
    const { number, title } = parseChapterFilename(file);

    // Add chapter divider page (already has page-break-after: always in CSS)
    htmlContent += generateChapterDivider(number, title);

    // No need for extra page-break div - the divider already breaks the page

    // Render Markdown (remove the first H1 since we have it in the divider)
    let rendered = md.render(content);
    // Remove the first H1 tag to avoid duplication
    rendered = rendered.replace(/<h1[^>]*>.*?<\/h1>/i, '');

    // Add answer-key class to Answer Key sections for page break control
    rendered = rendered.replace(
      /<h3([^>]*)>Answer Key/gi,
      '<h3$1 class="answer-key">Answer Key'
    );

    htmlContent += `<div class="chapter">${rendered}</div>`;
  }

  // Add author page at the end
  const maciejBioHtml = authorBios.maciej.bio.split('\n\n').map(p => `<p>${p}</p>`).join('');
  const fawwazBioHtml = authorBios.fawwaz.bio.split('\n\n').map(p => `<p>${p}</p>`).join('');

  htmlContent += `
    <div class="author-page full-bleed-page">
      <h2>About the Authors</h2>

      <div class="author-entry">
        ${maciejImg ? `<img class="author-photo" src="${maciejImg}" alt="${authorBios.maciej.name}">` : ''}
        <div class="author-info">
          <div class="author-name">${authorBios.maciej.name}</div>
          <div class="author-role">${authorBios.maciej.role}</div>
          <div class="author-bio">
            ${maciejBioHtml}
          </div>
        </div>
      </div>

      <div class="author-entry">
        ${fawwazImg ? `<img class="author-photo" src="${fawwazImg}" alt="${authorBios.fawwaz.name}">` : ''}
        <div class="author-info">
          <div class="author-name">${authorBios.fawwaz.name}</div>
          <div class="author-role">${authorBios.fawwaz.role}</div>
          <div class="author-bio">
            ${fawwazBioHtml}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Learn more at <strong>${website}</strong></p>
        <p>© 2026 ${authors.primary} & ${authors.secondary}. Free to share.</p>
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
