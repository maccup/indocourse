import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LANGUAGE_CODE = process.argv[2] || 'en';
const AUDIO_SCRIPT_PATH = path.join(__dirname, `../assets/data/audio_production_script_${LANGUAGE_CODE.toUpperCase()}.json`);
const PROMPTS_PATH = path.join(__dirname, '../assets/prompts/chapter_prompts.txt');
const OUTPUT_AUDIO_DIR = path.join(__dirname, `../assets/audio/${LANGUAGE_CODE}`);
const OUTPUT_IMAGE_DIR = path.join(__dirname, '../assets/images/generated');

const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const API_KEY = process.env.GOOGLE_API_KEY;

const TTS_VOICE = 'id-ID-Wavenet-A';
const TTS_VOICE_MALE = 'id-ID-Wavenet-B';
const TTS_VOICE_FEMALE = 'id-ID-Wavenet-A';

if (!fs.existsSync(OUTPUT_AUDIO_DIR)) fs.mkdirSync(OUTPUT_AUDIO_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_IMAGE_DIR)) fs.mkdirSync(OUTPUT_IMAGE_DIR, { recursive: true });

let cachedAccessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  if (!CREDENTIALS_PATH || !fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS not found');
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${base64url(header)}.${base64url(payload)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const signature = sign.sign(credentials.private_key, 'base64url');

  const jwt = `${unsigned}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${await response.text()}`);
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  tokenExpiry = Date.now() + 3500 * 1000;
  return cachedAccessToken;
}

async function generateAudio(text, outputPath, voiceName = TTS_VOICE) {
  if (fs.existsSync(outputPath)) {
    return { skipped: true };
  }

  const accessToken = await getAccessToken();

  const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'id-ID', name: voiceName },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.85,
        pitch: 0
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TTS failed: ${error}`);
  }

  const data = await response.json();
  fs.writeFileSync(outputPath, Buffer.from(data.audioContent, 'base64'));
  return { generated: true };
}

async function generateImage(prompt, outputPath) {
  const pngPath = outputPath.replace(/\.\w+$/, '.png');
  if (fs.existsSync(pngPath)) {
    return { skipped: true };
  }

  if (!API_KEY) {
    throw new Error('GOOGLE_API_KEY not found');
  }

  const styledPrompt = `${prompt}

Style requirements:
- Minimalist flat vector illustration
- Clean geometric shapes, no gradients or shadows
- Color palette: cream background (#FDFBF7), terracotta (#E07A5F), sage green (#81B29A), charcoal details (#3D405B)
- Modern, sophisticated, educational feel
- Simple, clean lines suitable for a language learning book
- No text in the image`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: styledPrompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE']
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Image generation failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    const inlineData = part?.inline_data || part?.inlineData;
    const mime = inlineData?.mimeType || inlineData?.mime_type;
    if (inlineData?.data && mime?.startsWith('image/')) {
      fs.writeFileSync(pngPath, Buffer.from(inlineData.data, 'base64'));
      return { generated: true };
    }
  }

  const feedback = data.promptFeedback?.blockReason;
  if (feedback) {
    throw new Error(`Image blocked: ${feedback}`);
  }

  throw new Error('No image data in response');
}

async function generateCover() {
  const outputPath = path.join(OUTPUT_IMAGE_DIR, 'cover.png');
  if (fs.existsSync(outputPath)) {
    console.log('  [SKIP] cover.png exists');
    return;
  }

  const coverPrompt = `Create a book cover illustration:

Subject: Indonesian Gunungan (Wayang Kulit "Tree of Life" mountain shape) - a symmetrical, ornate triangular mountain silhouette from Indonesian shadow puppetry

Composition:
- Centered Gunungan shape taking 60% of vertical space
- Simple decorative batik-inspired patterns within the shape
- Clean empty space around for text placement (will be added separately)
- Portrait orientation suitable for ebook cover
- No text whatsoever`;

  try {
    await generateImage(coverPrompt, outputPath);
    console.log('  [OK] cover.png generated');
  } catch (err) {
    console.error('  [ERROR] cover.png:', err.message);
  }
}

async function main() {
  console.log('=== INDOCOURSE ASSET GENERATOR ===\n');

  let hasCredentials = true;
  if (!CREDENTIALS_PATH || !fs.existsSync(CREDENTIALS_PATH)) {
    console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS missing - audio generation disabled');
    hasCredentials = false;
  }
  if (!API_KEY) {
    console.error('ERROR: GOOGLE_API_KEY missing - image generation disabled');
  }

  // 1. Generate Cover
  console.log('\n--- Cover Image ---');
  if (API_KEY) {
    await generateCover();
  }

  // 2. Generate Chapter Images
  console.log('\n--- Chapter Images ---');
  if (API_KEY && fs.existsSync(PROMPTS_PATH)) {
    const content = fs.readFileSync(PROMPTS_PATH, 'utf-8');
    const regex = /\*\*Unit (\d+):.*?\*\*\s*>\s*(.*?)(?=\n\n|\n\*\*|$)/gs;

    const prompts = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      prompts.push({ unit: match[1].padStart(2, '0'), prompt: match[2].trim() });
    }

    console.log(`Found ${prompts.length} chapter prompts`);

    for (const item of prompts) {
      const filename = `unit_${item.unit}.png`;
      const outputPath = path.join(OUTPUT_IMAGE_DIR, filename);

      try {
        const result = await generateImage(item.prompt, outputPath);
        if (result.skipped) {
          console.log(`  [SKIP] ${filename} exists`);
        } else {
          console.log(`  [OK] ${filename} generated`);
        }
      } catch (err) {
        console.error(`  [ERROR] ${filename}:`, err.message);
      }

      await sleep(1500);
    }
  }

  // 3. Generate Audio
  console.log('\n--- Audio Files ---');
  if (hasCredentials && fs.existsSync(AUDIO_SCRIPT_PATH)) {
    const script = JSON.parse(fs.readFileSync(AUDIO_SCRIPT_PATH, 'utf-8'));

    let generated = 0;
    let skipped = 0;
    let errors = 0;

    for (const unit of script) {
      const unitId = unit.unit.split(':')[0].replace(/\s+/g, '').toLowerCase();
      console.log(`\n  Processing ${unit.unit}...`);

      // Vocabulary
      for (const vocab of unit.vocabulary) {
        const sanitized = vocab.indonesian.replace(/[\/\s]+/g, '_').toLowerCase();
        const filename = `${unitId}_vocab_${sanitized}.mp3`;
        const outputPath = path.join(OUTPUT_AUDIO_DIR, filename);

        try {
          const result = await generateAudio(vocab.indonesian, outputPath);
          if (result.skipped) skipped++;
          else generated++;
        } catch (err) {
          console.error(`    [ERROR] ${filename}:`, err.message);
          errors++;
        }
      }

      // Dialogue
      for (let i = 0; i < unit.dialogue.length; i++) {
        const line = unit.dialogue[i];
        const speaker = line.speaker.replace(/[\/\s]+/g, '_');
        const filename = `${unitId}_dialogue_${i}_${speaker}.mp3`;
        const outputPath = path.join(OUTPUT_AUDIO_DIR, filename);

        const isMale = ['Budi', 'Pak', 'Mas', 'Driver', 'Dokter'].some(n => line.speaker.includes(n));
        const voice = isMale ? TTS_VOICE_MALE : TTS_VOICE_FEMALE;

        try {
          const result = await generateAudio(line.text, outputPath, voice);
          if (result.skipped) skipped++;
          else generated++;
        } catch (err) {
          console.error(`    [ERROR] ${filename}:`, err.message);
          errors++;
        }
      }
    }

    console.log(`\n  Audio Summary: ${generated} generated, ${skipped} skipped, ${errors} errors`);
  } else {
    console.log('  Skipped (no credentials or script file)');
  }

  console.log('\n=== DONE ===');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
