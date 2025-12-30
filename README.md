# Indonesian Basics

Free Indonesian language course for beginners - indonesianbasics.com

## Quick Deploy

```bash
npm run deploy
```

Builds everything (frontend + PDF + audio) and deploys the worker.

**Frontend** (Cloudflare Pages):
```bash
wrangler pages deploy dist --project-name=indonesian-basics
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Local development |
| `npm run build` | Build frontend + SSR prerender |
| `npm run build:prod` | Build all (frontend + PDF + audio) |
| `npm run deploy` | Build all + deploy worker |
| `npm run deploy:worker` | Deploy worker only |

## Architecture

```
indonesianbasics.com     → dist/           → Cloudflare Pages
api.indonesianbasics.com → worker/         → Cloudflare Worker
                           └── public/downloads/
                               ├── indonesian-basics-en.pdf
                               └── indonesian-basics-audio-en.zip
```

## Development

```bash
npm install
npm run dev
```

## Full Documentation

See [AGENTS.md](AGENTS.md) for complete project documentation.
