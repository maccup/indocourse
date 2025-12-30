import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../assets/images/cover_variations');
const API_KEY = process.env.GOOGLE_API_KEY;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const MASCOT_BASE = `A cute cartoon monkey character named Kiki: small friendly monkey with big expressive happy eyes, warm brown fur, wearing a small teal (#2EC4B6) backpack. Round face, always emotive. Duolingo/Headspace style flat illustration. Professional children's book / language learning app quality.`;

const COVER_VARIATIONS = [
  {
    id: 'v1_scooter_rice_fields',
    name: 'Scooter Through Rice Fields',
    prompt: `${MASCOT_BASE}
Scene: Kiki riding a teal scooter along a winding path through lush green rice paddies (sawah). Excited expression, one hand waving, wind in fur.
Background: Vibrant green terraced rice fields, distant volcano silhouette, golden hour yellow (#FFE66D) sky.
Elements: Traditional Balinese farmer with conical hat waving in distance, white egret birds, palm trees lining the road.
Mood: Freedom, adventure, discovering rural Indonesia.
Composition: Kiki on scooter in foreground moving right, scenic rice terraces stretching into background.
Portrait orientation (3:4 aspect ratio). Flat vector illustration. No text.`
  },
  {
    id: 'v2_backpacker_trail',
    name: 'Backpacker Trail',
    prompt: `${MASCOT_BASE}
Scene: Kiki hiking up a jungle trail, looking back at viewer with encouraging expression, pointing ahead to the destination.
Background: Teal (#2EC4B6) tropical jungle with large monstera and banana leaves, misty mountains ahead.
Elements: Wooden trail signpost pointing to "Gunung" (mountain), stepping stones, colorful tropical birds (hornbill), waterfall glimpse in distance.
Mood: Encouraging, "come along on this journey", exploration spirit.
Composition: Kiki mid-trail looking back, path leading eye up toward misty peak.
Portrait orientation (3:4 aspect ratio). Flat vector illustration. No text.`
  },
  {
    id: 'v3_arriving_destination',
    name: 'Arriving at Destination',
    prompt: `${MASCOT_BASE}
Scene: Kiki just arrived, standing triumphantly at a scenic viewpoint, arms raised in victory pose, huge smile.
Background: Panoramic Indonesian vista - teal ocean, yellow (#FFE66D) sunset, scattered islands on horizon.
Elements: Kiki's scooter parked behind, small Indonesian flag planted, "You made it!" achievement feeling, birds soaring.
Mood: Accomplishment, arrival, the reward of the journey.
Composition: Kiki silhouetted against epic sunset view, triumphant pose center-frame.
Portrait orientation (3:4 aspect ratio). Flat vector illustration. No text.`
  },
  {
    id: 'v4_map_navigator',
    name: 'The Navigator',
    prompt: `${MASCOT_BASE}
IMPORTANT: Kiki has exactly TWO hands/arms like a normal monkey - no extra limbs.
Scene: Kiki holding a colorful illustrated map of Indonesia with both hands, looking at the map with curious excited expression.
Background: Soft teal (#2EC4B6) with subtle compass rose pattern.
Elements: Map shows iconic Indonesian landmarks (Borobudur temple, Bali temple gate, gecko/lizard, palm trees), the shape of Indonesia archipelago visible.
Mood: Planning, curiosity, the excitement before adventure.
Composition: Kiki centered, holding map open with both hands in front of chest, face visible above the map with big happy eyes looking at viewer.
Portrait orientation (3:4 aspect ratio). Flat vector illustration. Anatomically correct - TWO arms only. No text.`
  },
  {
    id: 'v5_coastal_road_trip',
    name: 'Coastal Road Trip',
    prompt: `${MASCOT_BASE}
Scene: Kiki cruising on scooter along a coastal cliff road, ocean sparkling below, wind blowing, pure joy expression.
Background: Dramatic cliffs, turquoise teal (#2EC4B6) ocean with white waves, clear yellow (#FFE66D) sunny sky.
Elements: Traditional jukung boats in the bay below, coconut palms leaning, small beach visible, seagulls flying alongside.
Mood: Freedom, scenic beauty, the joy of Indonesian road trips.
Composition: Side view of Kiki on scooter, sweeping coastal panorama behind, dynamic movement left to right.
Portrait orientation (3:4 aspect ratio). Flat vector illustration. No text.`
  }
];

async function generateImage(prompt, outputPath) {
  const pngPath = outputPath.replace(/\.\w+$/, '.png');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${API_KEY}`;

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== COVER VARIATIONS GENERATOR ===\n');

  if (!API_KEY) {
    console.error('ERROR: GOOGLE_API_KEY not found in environment');
    process.exit(1);
  }

  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const forceRegenerate = process.argv.includes('--force');
  if (forceRegenerate) {
    console.log('Force mode: regenerating all images\n');
  }

  for (const variation of COVER_VARIATIONS) {
    const outputPath = path.join(OUTPUT_DIR, `${variation.id}.png`);

    if (fs.existsSync(outputPath) && !forceRegenerate) {
      console.log(`[SKIP] ${variation.name} (${variation.id}.png) - already exists`);
      continue;
    }

    console.log(`[GEN] ${variation.name}...`);

    try {
      await generateImage(variation.prompt, outputPath);
      console.log(`  ✓ Saved: ${variation.id}.png`);
      await sleep(2000);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  console.log('\n=== DONE ===');
  console.log(`\nGenerated covers are in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
