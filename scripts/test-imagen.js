import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY not found in .env');
  process.exit(1);
}

console.log('--- Gemini Image Generation Test ---');

// Cover design prompt based on AGENTS.md visual identity
const COVER_PROMPT = `Create a book cover illustration with these specifications:

Style: Minimalist flat vector illustration, clean geometric shapes, no gradients
Subject: Indonesian Gunungan (Wayang Kulit "Tree of Life" mountain shape) - a symmetrical, ornate triangular/mountain silhouette from Indonesian shadow puppetry

Color palette:
- Background: Warm cream/off-white (#F5F0E6)
- Main shape: Terracotta/brick red (#E07A5F)
- Accent details: Sage green (#81B29A)
- Fine details: Charcoal gray (#3D405B)

Composition:
- Centered Gunungan shape taking 60% of vertical space
- Simple decorative batik-inspired patterns within the shape
- Clean empty space around for text placement
- Modern, sophisticated, educational feel
- No text in the image

Output: High resolution, suitable for book cover (portrait orientation)`;

async function generateWithGeminiFlashImage(prompt) {
  console.log('\nUsing gemini-2.5-flash-image model...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE']
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('  Status:', response.status);
      console.log('  Error:', JSON.stringify(error, null, 2));
      return null;
    }

    const data = await response.json();

    // Find the image part (handle both snake_case and camelCase)
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      const inlineData = part?.inline_data || part?.inlineData;
      const mime = inlineData?.mimeType || inlineData?.mime_type;
      if (inlineData?.data && mime?.startsWith('image/')) {
        console.log('  Image generated successfully');
        return { data: inlineData.data, mimeType: mime };
      }
    }

    // Log feedback if no image
    const feedback = data.promptFeedback?.blockReason;
    if (feedback) {
      console.log('  Blocked:', feedback);
    }

    return null;
  } catch (err) {
    console.log('  Error:', err.message);
    return null;
  }
}

async function main() {
  console.log('\nPrompt:', COVER_PROMPT.slice(0, 100) + '...\n');

  const outputDir = path.join(__dirname, '../assets/images/test');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const result = await generateWithGeminiFlashImage(COVER_PROMPT);

  if (result) {
    const ext = result.mimeType.split('/')[1] || 'png';
    const outputPath = path.join(outputDir, `cover_gemini_flash_image.${ext}`);
    fs.writeFileSync(outputPath, Buffer.from(result.data, 'base64'));
    console.log(`\n  SUCCESS! Saved to: ${outputPath}`);
    console.log('  Cost: ~$0.039');
  } else {
    console.log('\n  FAILED - Image generation did not return data');
  }
}

main();
