import 'dotenv/config';

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GOOGLE_API_KEY not found in .env');
  process.exit(1);
}

console.log('--- Google API Test ---');
console.log(`API Key: ${API_KEY.slice(0, 10)}...${API_KEY.slice(-4)}`);

// Test 1: Gemini API (should work with API key)
async function testGemini() {
  console.log('\n[TEST 1] Gemini API...');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say "Selamat pagi" and explain what it means in one sentence.' }]
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('  FAILED:', error.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('  SUCCESS:', text?.slice(0, 100) + '...');
    return true;
  } catch (err) {
    console.error('  ERROR:', err.message);
    return false;
  }
}

// Test 2: Cloud TTS API (likely needs Service Account, but let's try)
async function testCloudTTS() {
  console.log('\n[TEST 2] Cloud Text-to-Speech API...');

  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: 'Selamat pagi' },
        voice: { languageCode: 'id-ID', name: 'id-ID-Wavenet-A' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('  FAILED:', error.error?.message || response.statusText);
      console.log('  NOTE: Cloud TTS usually requires Service Account auth, not API key.');
      return false;
    }

    const data = await response.json();
    if (data.audioContent) {
      console.log('  SUCCESS: Audio generated! Base64 length:', data.audioContent.length);
      return true;
    }
    return false;
  } catch (err) {
    console.error('  ERROR:', err.message);
    return false;
  }
}

// Test 3: List available TTS voices
async function listVoices() {
  console.log('\n[TEST 3] List Indonesian TTS voices...');

  const url = `https://texttospeech.googleapis.com/v1/voices?languageCode=id-ID&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      console.error('  FAILED:', error.error?.message || response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('  Available Indonesian voices:');
    data.voices?.forEach(v => {
      console.log(`    - ${v.name} (${v.ssmlGender})`);
    });
    return true;
  } catch (err) {
    console.error('  ERROR:', err.message);
    return false;
  }
}

async function main() {
  const geminiOk = await testGemini();
  const ttsOk = await testCloudTTS();

  if (!ttsOk) {
    await listVoices();
  }

  console.log('\n--- Summary ---');
  console.log(`Gemini API: ${geminiOk ? 'WORKING' : 'FAILED'}`);
  console.log(`Cloud TTS:  ${ttsOk ? 'WORKING' : 'FAILED (needs Service Account)'}`);

  if (!ttsOk) {
    console.log(`
NEXT STEPS for TTS:
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Create a Service Account for project "calendesk-production"
3. Grant role: "Cloud Text-to-Speech User"
4. Create JSON key and save as: ./service-account.json
5. Set in .env: GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
`);
  }
}

main();
