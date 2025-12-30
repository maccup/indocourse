import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { createServer } from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')

const routes = [
  {
    path: '/',
    title: 'Learn Indonesian with Kiki - Free Fun Course for Beginners',
    description: 'Join Kiki the Monkey on hilarious adventures learning Indonesian! Free PDF + audio. No boring textbooks - just real phrases locals use in Bali. Start your fun language journey today!',
    canonical: 'https://indonesianbasics.com/'
  },
  {
    path: '/audio',
    title: 'Audio Companion - 234 Indonesian Pronunciation Files | Indonesian Basics',
    description: 'Listen to native Indonesian pronunciation for all 10 units. Free MP3 audio files covering vocabulary and dialogues from greetings to polite requests.',
    canonical: 'https://indonesianbasics.com/audio'
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Indonesian Basics',
    description: 'Privacy policy for Indonesian Basics. Learn how we collect, use, and protect your personal data when you download our free Indonesian language course.',
    canonical: 'https://indonesianbasics.com/privacy-policy'
  },
  {
    path: '/terms',
    title: 'Terms of Service | Indonesian Basics',
    description: 'Terms of service for Indonesian Basics. Read about the permitted use of our free Indonesian language learning materials.',
    canonical: 'https://indonesianbasics.com/terms'
  }
]

function injectMeta(html, route) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
    .replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${route.title}"`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${route.description}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${route.canonical}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${route.title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${route.description}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${route.canonical}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${route.title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${route.description}"`)
    .replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${route.canonical}"`)
}

async function startServer() {
  const handler = async (req, res) => {
    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url)

    if (!path.extname(filePath)) {
      filePath = path.join(distDir, 'index.html')
    }

    try {
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath)
        const contentTypes = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.mp3': 'audio/mpeg'
        }
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' })
        fs.createReadStream(filePath).pipe(res)
      } else {
        const indexPath = path.join(distDir, 'index.html')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.createReadStream(indexPath).pipe(res)
      }
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  }

  const server = createServer(handler)
  await new Promise(resolve => server.listen(3456, resolve))
  return server
}

async function prerender() {
  console.log('Starting prerender...')

  const server = await startServer()
  console.log('Dev server started on port 3456')

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  for (const route of routes) {
    console.log(`Rendering ${route.path}...`)

    await page.goto(`http://localhost:3456${route.path}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    })

    // Wait for React to render
    await page.waitForSelector('#root > *', { timeout: 10000 })

    // Small delay for animations to settle
    await new Promise(r => setTimeout(r, 500))

    let html = await page.content()

    // Inject correct meta tags
    html = injectMeta(html, route)

    // Clean up Puppeteer artifacts
    html = html.replace(/<script[^>]*puppeteer[^>]*>.*?<\/script>/gi, '')

    // Determine output path
    let outputPath
    if (route.path === '/') {
      outputPath = path.join(distDir, 'index.html')
    } else {
      const routeDir = path.join(distDir, route.path.slice(1))
      fs.mkdirSync(routeDir, { recursive: true })
      outputPath = path.join(routeDir, 'index.html')
    }

    fs.writeFileSync(outputPath, html)
    console.log(`  ✓ ${outputPath}`)
  }

  await browser.close()
  server.close()

  console.log('\nPrerender complete!')
}

prerender().catch(err => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
