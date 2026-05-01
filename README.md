# ESTATIQ Frontend

> Premium real estate frontend built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Features a luxury dark-themed UI with AI-powered property insights, real-time analysis polling, and a full property management flow.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui, Lucide React |
| Fonts | Playfair Display, Inter (Google Fonts) |
| Images | Next.js Image (unoptimized for local dev) |

---

## Project Structure

```
estatiq-frontend/
├── app/
│   ├── globals.css               ← Global styles + color palette
│   ├── layout.tsx                ← Root layout + metadata
│   ├── page.tsx                  ← Property listing page (/)
│   └── properties/
│       ├── [id]/
│       │   └── page.tsx          ← Property detail page (/properties/:id)
│       └── add/
│           └── page.tsx          ← Add property page (/properties/add)
├── components/
│   ├── navbar.tsx                ← Sticky navigation bar
│   ├── hero.tsx                  ← Hero section with CTA
│   ├── filter-bar.tsx            ← Search + filters (location, price, tags)
│   ├── property-grid.tsx         ← Responsive property grid
│   ├── property-card.tsx         ← Individual property card
│   ├── property-skeleton.tsx     ← Loading skeleton card
│   ├── empty-state.tsx           ← No results state
│   └── pagination.tsx            ← Page navigation
├── next.config.mjs               ← Next.js config (image handling)
├── seed.js                       ← Demo data seeder (40 properties)
└── README.md
```

---

## Pages

### 1. Property Listing Page `/`
- Hero section with CTAs
- Search bar + location dropdown + price range + tag filters
- 3-column responsive property grid (3 cols desktop → 2 tablet → 1 mobile)
- Shimmer skeleton loading cards
- Empty state with link to add property
- Pagination
- About section and Contact form
- Smooth scroll to About/Contact from navbar

### 2. Property Detail Page `/properties/[id]`
- Full-width cover image with gradient overlay
- Two-column layout (65% content / 35% insights sidebar)
- AI-generated luxury description
- Image gallery with click-to-open lightbox
- Property Insights card:
  - Room type with emoji icon (🛏️ bedroom, 🍳 kitchen, 🏠 exterior etc.)
  - Quality score bar (Excellent / Good / Average / Fair)
  - Feature chips per image
  - Cover image badge
- Suggested Improvements section
- Contact Agent CTA
- **Real-time polling** — if AI is still processing, polls every 4 seconds and updates UI automatically

### 3. Add Property Page `/properties/add`
- Two-step form flow with step indicator
- **Step 1**: Property details (title, price, location) with inline validation
- **Step 2**: Drag & drop image upload (up to 5 images, JPEG/PNG/WebP, max 10MB each)
- Image preview grid with remove button
- Upload progress bar
- Success state with links to view property or add another

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- pnpm (or npm)
- Backend running on `http://localhost:8000`

### Installation

```bash
cd estatiq-frontend
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Frontend runs at: **http://localhost:3000**

> ⚠️ Make sure the backend is running on port 8000 before starting the frontend.

---

## API Integration

All API calls point to `http://localhost:8000`. The base URL is defined at the top of each page file — change it there if your backend runs on a different port.

### Endpoints Used

| Page | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| Listing | `GET` | `/api/properties` | Fetch properties with filters + pagination |
| Detail | `GET` | `/api/properties/:id` | Fetch property + images |
| Detail | `GET` | `/api/properties/:id` | Poll for AI completion (every 4s) |
| Add Property | `POST` | `/api/properties` | Create new property |
| Add Property | `POST` | `/api/properties/:id/images` | Upload images |

### Expected Response Format

```json
// GET /api/properties
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "price": 4500000,
      "location": "Goa, India",
      "tags": ["luxury", "pool"],
      "status": "processing | ready",
      "coverImage": {
        "url": "/uploads/filename.jpg",
        "roomType": "exterior",
        "features": ["pool", "sea_view"],
        "score": 85,
        "isCover": true
      }
    }
  ],
  "pagination": {
    "total": 40,
    "page": 1,
    "limit": 9,
    "totalPages": 5
  }
}
```

### Image URL Construction

Images from the backend come as relative paths (e.g. `/uploads/abc.jpg`).
The frontend prepends the base URL:

```ts
const imageUrl = `http://localhost:8000${coverImage.url}`
```

---

## Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0A0E1A` | Page background |
| Card | `#1A2035` | Card backgrounds |
| Gold Accent | `#C9A84C` | CTAs, highlights, logo |
| Cream Text | `#F5F0E8` | Primary text |

### Typography

- **Headings**: Playfair Display (serif) — luxury feel
- **Body**: Inter (sans-serif) — clean readability

### States Handled

| State | Implementation |
|-------|---------------|
| Loading | Shimmer skeleton cards |
| Empty | Illustrated empty state + CTA |
| Error | Error banner with message |
| AI Processing | Pulsing gold badge + polling |
| AI Complete | Smooth content fade-in |
| No image | Dark gradient placeholder |

---

## Seeding Demo Data

A seed script is included to populate the database with 40 realistic luxury property listings and real property images downloaded from Unsplash.

```bash
# Make sure backend is running first
node seed.js
```

The script will:
- Create 40 properties across 15+ Indian cities
- Download 5 real property photos per listing
- Upload images to the backend
- Trigger AI analysis on each (takes ~2 min to complete in background)

**To clear existing data first:**
Open MongoDB Compass → `smart_property_db` → Drop `properties` and `images` collections → then run `node seed.js`

---

## Key Design Decisions

| Decision | Reason |
|----------|--------|
| `images: { unoptimized: true }` in next.config | Next.js blocks localhost image optimization by default — this bypasses the private IP restriction in development |
| Polling instead of WebSockets | Simpler to implement; acceptable UX for 30–60 second AI processing time |
| Self-contained pages (no shared sub-components) | Avoids broken import errors from V0-generated split components |
| Locations fetched separately on mount | Ensures dropdown is populated even before user applies any filters |
| Empty minPrice/maxPrice defaults | Prevents sending `minPrice=0` to API which would filter out all properties |

---

## Screenshots

| Page | Description |
|------|-------------|
| `/` | Listing grid with filters, skeleton loading, empty state |
| `/properties/:id` | Detail page with AI insights, gallery lightbox, polling |
| `/properties/add` | Two-step form with drag & drop upload |
