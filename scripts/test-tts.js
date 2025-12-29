import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!CREDENTIALS_PATH || !fs.existsSync(CREDENTIALS_PATH)) {
  console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS not found or file missing');
  process.exit(1);
}

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
console.log('--- TTS Test with Service Account ---');
console.log(`Project: ${credentials.project_id}`);
console.log(`Service Account: ${credentials.client_email}`);

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const crypto = await import('crypto');

  const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${base64url(header)}.${base64url(payload)}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  const signature = sign.sign(credentials.private_key, 'base64url');

  const jwt = `${unsigned}.${signature}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });

  if (!tokenResponse.ok) {
    throw new Error(`Token request failed: ${await tokenResponse.text()}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function listVoices(accessToken) {
  console.log('\n[1] Listing Indonesian voices...');

  const response = await fetch('https://texttospeech.googleapis.com/v1/voices?languageCode=id-ID', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    console.error('  FAILED:', await response.text());
    return [];
  }

  const data = await response.json();
  const voices = data.voices || [];

  console.log(`  Found ${voices.length} Indonesian voices:`);
  voices.forEach(v => {
    console.log(`    - ${v.name} (${v.ssmlGender})`);
  });

  return voices;
}

async function synthesizeSpeech(accessToken, text, voiceName) {
  console.log(`\n[2] Generating audio for: "${text}"...`);

  const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'id-ID',
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 0.9,
        pitch: 0
      }
    })
  });

  if (!response.ok) {
    console.error('  FAILED:', await response.text());
    return null;
  }

  const data = await response.json();
  return data.audioContent;
}

async function main() {
  try {
    console.log('\nAuthenticating...');
    const accessToken = await getAccessToken();
    console.log('  Token obtained successfully');

    const voices = await listVoices(accessToken);

    if (voices.length === 0) {
      console.log('\nNo voices available. Check if TTS API is enabled.');
      return;
    }

    // Pick a Wavenet voice if available, otherwise Standard
    const wavenetVoice = voices.find(v => v.name.includes('Wavenet'));
    const voice = wavenetVoice || voices[0];
    console.log(`\n  Using voice: ${voice.name}`);

    // Test with a greeting
    const testText = 'Selamat pagi, apa kabar?';
    const audioContent = await synthesizeSpeech(accessToken, testText, voice.name);

    if (audioContent) {
      const outputDir = path.join(__dirname, '../assets/audio/test');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'test_greeting.mp3');
      fs.writeFileSync(outputPath, Buffer.from(audioContent, 'base64'));

      console.log(`\n  SUCCESS! Audio saved to: ${outputPath}`);
      console.log('  Play it to verify quality.');
    }

  } catch (err) {
    console.error('\nERROR:', err.message);

    if (err.message.includes('403') || err.message.includes('permission')) {
      console.log(`
PERMISSION FIX:
The service account needs the "Cloud Text-to-Speech User" role.
1. Go to: https://console.cloud.google.com/iam-admin/iam?project=calendesk-production
2. Find: indonesian-basics@calendesk-production.iam.gserviceaccount.com
3. Add role: "Cloud Text-to-Speech User"
`);
    }
  }
}

main();
