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
const filename = `IndoCourse_Survival_Indonesian_${lang.toUpperCase()}${isKdp ? '_KDP' : ''}.pdf`;
const OUTPUT_FILE = path.join(__dirname, `../output/${filename}`);

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
  const coverPath = path.join(ASSETS_DIR, 'images/cover.svg');
  const coverSvg = fs.readFileSync(coverPath, 'utf-8');
  const coverBase64 = Buffer.from(coverSvg).toString('base64');
  const coverImgSrc = `data:image/svg+xml;base64,${coverBase64}`;

  // 3. Get Chapters
  const files = fs.readdirSync(CHAPTERS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} chapters.`);

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
        ` : ''}
      </style>
    </head>
    <body>
      <div class="cover-page">
        <img src="${coverImgSrc}" class="cover-image" alt="Cover">
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

  htmlContent += `
    </body>
    </html>
  `;

  // 5. Generate PDF with Puppeteer
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