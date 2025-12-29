import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://indonesianbasics.com/audio';
const OUTPUT_DIR = path.join(__dirname, '../assets/images/generated');

async function generateQRCodes() {
  console.log('Generating QR codes for audio pages...\n');

  for (let i = 1; i <= 10; i++) {
    const unitNum = String(i).padStart(2, '0');
    const url = `${BASE_URL}#unit-${unitNum}`;
    const filename = `qr_unit_${unitNum}.png`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    await QRCode.toFile(outputPath, url, {
      width: 200,
      margin: 1,
      color: {
        dark: '#3D405B',
        light: '#FDFBF7'
      }
    });

    console.log(`  Generated: ${filename} -> ${url}`);
  }

  console.log('\nDone! QR codes saved to assets/images/generated/');
}

generateQRCodes().catch(console.error);
