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

async function generateImage(prompt, outputPath, useCustomStyle = true) {
  const pngPath = outputPath.replace(/\.\w+$/, '.png');
  const jpgPath = outputPath.replace(/\.\w+$/, '.jpg');
  if (fs.existsSync(pngPath) || fs.existsSync(jpgPath)) {
    return { skipped: true };
  }

  if (!API_KEY) {
    throw new Error('GOOGLE_API_KEY not found');
  }

  const styledPrompt = useCustomStyle ? prompt : `${prompt}

Style requirements:
- Minimalist flat vector illustration
- Clean geometric shapes, no gradients or shadows
- Color palette: cream background (#FDFBF7), terracotta (#E07A5F), sage green (#81B29A), charcoal details (#3D405B)
- Modern, sophisticated, educational feel
- Simple, clean lines suitable for a language learning book
- No text in the image`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

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

// Hero mascot: Kiki the Monkey - a cute, friendly monkey learning Indonesian
// Consistent character design across all illustrations
const MASCOT_STYLE = `A cute cartoon monkey character named Kiki: small friendly monkey with big expressive eyes, warm brown fur, wearing a small teal (#2EC4B6) backpack. Round face, always expressive and emotive. Duolingo/Headspace style flat illustration. Bright, cheerful, minimal background.`;

const UNIT_PROMPTS = {
  '01': `${MASCOT_STYLE} Scene: Kiki the monkey enthusiastically waving with both hands at a friendly Indonesian person. Over-eager, slightly awkward greeting. The person waves back with an amused smile. Sunny yellow (#FFE66D) sun in corner. Warm, welcoming mood. No text.`,

  '02': `${MASCOT_STYLE} Scene: Kiki the monkey with swirly confused eyes, holding Indonesian Rupiah banknotes with many zeros. A comically long receipt trails behind. Money notes floating around. Expression of bewilderment at all the zeros. Funny and relatable. No text.`,

  '03': `${MASCOT_STYLE} Scene: Kiki the monkey at a food stall, face bright red, sweating drops flying off, steam shooting from ears after eating spicy sambal. Tongue out, fanning mouth. A plate of nasi goreng and chili visible. Hilarious overreaction. No text.`,

  '04': `${MASCOT_STYLE} Scene: Kiki the monkey riding a small teal scooter, wearing a green safety helmet on head. Looking confused while holding a map upside down. Road signs with arrows (no text, just arrow symbols) pointing in different directions. Kiki is ON the scooter, helmet securely on head. Comedic lost tourist situation. IMPORTANT: Kiki must wear a helmet and be riding the scooter. NO TEXT anywhere in the image - signs should only have arrow symbols.`,

  '05': `${MASCOT_STYLE} Scene: Kiki the monkey in panic mode, running fast while holding a ringing alarm clock. Messy bed-head fur, stressed expression, running late! One empty sandal (no foot in it) left behind on the ground. Morning sun rising. Comedic "overslept and late" chaos energy. Yellow (#FFE66D) alarm effects. IMPORTANT: The sandal on the ground should be empty, not attached to any foot. No text.`,

  '06': `${MASCOT_STYLE} Scene: Kiki the monkey surrounded by a big loving Indonesian family - grandma pinching cheeks, uncle patting head, kids hugging. Kiki looks overwhelmed but happy, blushing. Hearts floating around. Warm family chaos. No text.`,

  '07': `${MASCOT_STYLE} Scene: Split image - LEFT: Kiki melting in tropical heat, sun blazing, sweat puddle forming. RIGHT: Same Kiki freezing with icicles, shivering in an over-airconditioned space. Extreme contrast, exaggerated reactions. Comedy of temperature. No text.`,

  '08': `${MASCOT_STYLE} Scene: Kiki the monkey looking sick, wrapped in a cozy blanket, thermometer in mouth, sad puppy eyes. Next to Kiki is a small table with medicine bottle and young coconut (kelapa muda). Get-well-soon vibes, adorably dramatic sick face. Simple composition - just sick Kiki with remedies nearby. IMPORTANT: No other characters, just Kiki alone being sick. No text.`,

  '09': `${MASCOT_STYLE} Scene: Kiki the monkey in the center with two thought bubbles - LEFT bubble shows chaotic yesterday (mess, mistakes). RIGHT bubble shows bright tomorrow (stars, checkmarks, success). Kiki looks determined and hopeful. Timeline feeling. No text.`,

  '10': `${MASCOT_STYLE} Scene: Kiki the monkey at a doorway, politely removing ONE pair of small sandals before entering. Bowing slightly with a nervous but respectful smile. The single pair of Kiki's sandals placed neatly by the door. Indonesian home entrance visible. Sweet cultural learning moment - learning to remove shoes before entering. IMPORTANT: Only ONE pair of sandals (Kiki's), no other shoes visible. No text.`
};

async function generateCover() {
  const outputPath = path.join(OUTPUT_IMAGE_DIR, 'cover.png');
  if (fs.existsSync(outputPath)) {
    console.log('  [SKIP] cover.png exists');
    return;
  }

  const coverPrompt = `Cute cartoon book cover illustration. Bright teal (#2EC4B6) background.
A cute friendly monkey character (Kiki): small monkey with big expressive happy eyes, warm brown fur, wearing a small teal backpack, waving hello enthusiastically with a big smile.
Indonesian tropical elements around: palm tree leaves, temple silhouette, small scooter, tropical fruits like banana and coconut.
Cheerful, welcoming, fun vibe like Duolingo app style.
Flat cartoon illustration, bright colors, teal (#2EC4B6) and yellow (#FFE66D) palette.
Portrait orientation (3:4 aspect ratio).
Professional children's book / language learning app quality.
The monkey is the hero, centered and prominent.
Inviting and friendly, makes you want to learn Indonesian.
No text in the image.`;

  try {
    await generateImage(coverPrompt, outputPath, true);
    console.log('  [OK] cover.png generated');
  } catch (err) {
    console.error('  [ERROR] cover.png:', err.message);
  }
}

// OG Image for social media sharing (1200x630)
async function generateOGImage() {
  const pngPath = path.join(__dirname, '../public/og-image.png');
  const jpgPath = path.join(__dirname, '../public/og-image.jpg');
  if (fs.existsSync(pngPath) || fs.existsSync(jpgPath)) {
    console.log('  [SKIP] og-image exists');
    return;
  }

  const ogPrompt = `Social media Open Graph card, 1200x630 landscape.

LAYOUT CRITICAL: Image divided into LEFT and RIGHT halves.
- LEFT HALF: Cute cartoon monkey (Kiki) - friendly monkey with big happy eyes, brown fur, teal backpack, waving. Small decorative elements: banana, palm leaf, temple silhouette.
- RIGHT HALF: COMPLETELY EMPTY solid teal (#2EC4B6) background. NO characters, NO elements on right side.

Style: Duolingo/Headspace flat vector illustration. Clean, modern.
Background: Solid teal (#2EC4B6).
NO text anywhere in image.`;

  try {
    await generateImage(ogPrompt, pngPath, true);
    console.log('  [OK] og-image.png generated');
  } catch (err) {
    console.error('  [ERROR] og-image.png:', err.message);
  }
}

// Apple Touch Icon (180x180) - just Kiki's face
async function generateAppleTouchIcon() {
  const outputPath = path.join(__dirname, '../public/apple-touch-icon.png');
  if (fs.existsSync(outputPath)) {
    console.log('  [SKIP] apple-touch-icon.png exists');
    return;
  }

  const iconPrompt = `App icon illustration, perfect square 1:1 aspect ratio.
A cute cartoon monkey face (Kiki): round face filling most of the square, big expressive happy eyes, warm brown fur, friendly wide smile, small cute ears on sides.
Solid teal (#2EC4B6) background.
Simple, clean, recognizable at small sizes.
Duolingo owl style - iconic and memorable.
Flat illustration, no gradients, high contrast for app icon visibility.
No text, no extra elements - just the monkey face as the mascot icon.`;

  try {
    await generateImage(iconPrompt, outputPath, true);
    console.log('  [OK] apple-touch-icon.png generated');
  } catch (err) {
    console.error('  [ERROR] apple-touch-icon.png:', err.message);
  }
}

// Logo for schema.org and general branding (512x512)
async function generateLogo() {
  const outputPath = path.join(__dirname, '../public/logo.png');
  if (fs.existsSync(outputPath)) {
    console.log('  [SKIP] logo.png exists');
    return;
  }

  const logoPrompt = `Brand logo illustration, square 1:1 aspect ratio.
A cute cartoon monkey character (Kiki): full body, small friendly monkey with big happy eyes, warm brown fur, wearing a small teal (#2EC4B6) backpack, standing and waving.
White or very light background (#FFFFFF or #F8F9FA).
Simple, clean, professional.
Duolingo mascot style - recognizable brand mascot.
Flat illustration, centered, the monkey is the logo itself.
No text - just the character as the visual brand mark.`;

  try {
    await generateImage(logoPrompt, outputPath, true);
    console.log('  [OK] logo.png generated');
  } catch (err) {
    console.error('  [ERROR] logo.png:', err.message);
  }
}

async function generateUnitImages() {
  console.log('\n--- Unit Illustrations ---');

  for (const [unitNum, prompt] of Object.entries(UNIT_PROMPTS)) {
    const pngPath = path.join(OUTPUT_IMAGE_DIR, `unit_${unitNum}.png`);
    const jpgPath = path.join(OUTPUT_IMAGE_DIR, `unit_${unitNum}.jpg`);

    if (fs.existsSync(pngPath) || fs.existsSync(jpgPath)) {
      console.log(`  [SKIP] unit_${unitNum} exists`);
      continue;
    }

    try {
      await generateImage(prompt, pngPath, true);
      console.log(`  [OK] unit_${unitNum}.png generated`);
      await sleep(1000);
    } catch (err) {
      console.error(`  [ERROR] unit_${unitNum}.png:`, err.message);
    }
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

  // 2. Generate Brand Assets (OG image, icons, logo)
  console.log('\n--- Brand Assets ---');
  if (API_KEY) {
    await generateOGImage();
    await sleep(1000);
    await generateAppleTouchIcon();
    await sleep(1000);
    await generateLogo();
  }

  // 3. Generate Unit Illustrations
  if (API_KEY) {
    await generateUnitImages();
  }

  // 4. Generate Audio
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
        const speaker = line.speaker.replace(/[\/\s]+/g, '_').toLowerCase();
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
