# ESTATIQ — Submission

## Project Structure

```
ESTATIQ_SUBMISSION/
├── smart-property-backend/     ← Express.js + MongoDB + OpenAI
└── estatiq-frontend/           ← Next.js frontend
    └── seed.js                 ← Demo data seeder (40 properties)
```

## Quick Start

```bash
# Terminal 1 — Backend
cd smart-property-backend
npm install
cp .env.example .env       # Add your OpenAI API key
npm run dev                # Runs on http://localhost:8000

# Terminal 2 — Frontend  
cd estatiq-frontend
pnpm install
pnpm dev                   # Runs on http://localhost:3000

# Optional — Seed 40 demo properties
cd estatiq-frontend
node seed.js
```

See `smart-property-backend/README.md` for full documentation.
