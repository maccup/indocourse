const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

// Parse Args
const args = process.argv.slice(2);
const lang = args[0] || 'en';

const CHAPTERS_DIR = path.join(__dirname, `../ebook/chapters/${lang}`);
const OUTPUT_FILE = path.join(__dirname, `../audio_production_script_${lang.toUpperCase()}.json`);
const TXT_OUTPUT = path.join(__dirname, `../audio_production_script_${lang.toUpperCase()}.txt`);

function extractAudioScript() {
  console.log(`Starting Audio Script Extraction for: ${lang.toUpperCase()}`);
  console.log(`Source: ${CHAPTERS_DIR}`);

  if (!fs.existsSync(CHAPTERS_DIR)) {
      console.error(`Error: Directory not found: ${CHAPTERS_DIR}`);
      process.exit(1);
  }

  const files = fs.readdirSync(CHAPTERS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();

  const fullScript = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf-8');
    const unitTitleMatch = content.match(/# (Unit \d+: .+)/);
    const unitTitle = unitTitleMatch ? unitTitleMatch[1] : file;
    
    const unitData = {
      unit: unitTitle,
      vocabulary: [],
      dialogue: []
    };

    // 1. Extract Vocabulary
    // Look for the table. It usually starts after ## 2. Vocabulary
    const vocabSection = content.split('## 2. Vocabulary')[1]?.split('##')[0];
    if (vocabSection) {
      const lines = vocabSection.split('\n');
      for (const line of lines) {
        // Match table rows: | **Word** | Meaning | Notes |
        const match = line.match(/\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|/);
        if (match) {
          unitData.vocabulary.push({
            indonesian: match[1].trim(),
            english: match[2].trim()
          });
        }
      }
    }

    // 2. Extract Dialogue
    // Look for ## 4. Dialogue
    const dialogueSection = content.split('## 4. Dialogue')[1]?.split('##')[0];
    if (dialogueSection) {
      // Remove the "Context:" line
      const cleanDialogue = dialogueSection.replace(/\*\*Context:\*\*.+?\n/, '');
      
      const lines = cleanDialogue.split('\n');
      for (const line of lines) {
        // Match lines like: **Budi:** Hello.
        const match = line.match(/^\*\*(.+?):\*\*\s*(.+)/);
        if (match) {
          unitData.dialogue.push({
            speaker: match[1].trim(),
            text: match[2].trim()
          });
        }
      }
    }

    fullScript.push(unitData);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fullScript, null, 2));
  console.log(`Audio script extracted to: ${OUTPUT_FILE}`);
  
  // Also create a readable TXT version for humans
  let txtContent = "# INDOCOURSE AUDIO PRODUCTION SCRIPT\n\n";
  
  fullScript.forEach(unit => {
    txtContent += `=== ${unit.unit} ===\n\n`;
    
    txtContent += "--- VOCABULARY ---\\n";
    unit.vocabulary.forEach(v => {
      txtContent += `[IND] ${v.indonesian}\n`;
    });
    txtContent += "\n";
    
    txtContent += "--- DIALOGUE ---\\n";
    unit.dialogue.forEach(d => {
      txtContent += `${d.speaker}: ${d.text}\n`;
    });
    txtContent += "\n\n";
  });
  
  fs.writeFileSync(TXT_OUTPUT, txtContent);
  console.log(`Human readable script at: ${TXT_OUTPUT}`);
}

extractAudioScript();
