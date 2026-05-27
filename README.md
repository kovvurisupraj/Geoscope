# GeoScope

An interactive 3D globe where you click any country and instantly get an AI-generated geopolitical briefing — political situation, international relations, active conflicts, and economic outlook — updated daily using live news.

![GeoScope](https://raw.githubusercontent.com/kovvurisupraj/Geoscope/master/preview.png)

## How it works

```
Click country → backend checks daily cache
                    ├─ Cache hit  → return stored briefing instantly
                    └─ Cache miss → fetch live news (NewsAPI)
                                  → send news + prompt to Claude
                                  → cache result for 24 hours
                                  → return briefing to frontend
```

Briefings are cached per country per day, so repeated clicks and high-traffic countries are served instantly without burning API quota.

## Features

- Interactive 3D Earth — hover to highlight, click to open briefing panel
- AI briefings covering: Political Situation · International Relations · Active Conflicts · Economic Outlook
- Grounded in live news — Claude receives real headlines before generating the analysis
- Daily cache with automatic cleanup of entries older than 2 days
- Rate limited (20 requests per 15 minutes) to prevent API abuse

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, react-globe.gl |
| Backend | Node.js + Express |
| AI | Claude Haiku (Anthropic) |
| News | NewsAPI |
| Infrastructure | Docker + Docker Compose |

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Anthropic API key](https://console.anthropic.com)
- [NewsAPI key](https://newsapi.org/register) (free tier works)

### Setup

```bash
git clone https://github.com/kovvurisupraj/Geoscope.git
cd Geoscope
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in:

```
ANTHROPIC_API_KEY=your_key_here
NEWS_API_KEY=your_key_here
```

```bash
docker-compose up --build
```

Open [http://localhost:5173](http://localhost:5173)

## Usage

| Action | Result |
|---|---|
| Hover a country | Highlights the country and shows its name |
| Click a country | Opens the geopolitical briefing panel |
| Click X | Closes the panel and resumes globe rotation |

Repeated clicks on the same country on the same day return the cached briefing instantly.

## Project Structure

```
geoscope/
├── docker-compose.yml
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Globe.jsx              # react-globe.gl wrapper with click/hover handlers
│       │   └── GeopoliticsPanel.jsx   # briefing display panel
│       └── App.jsx
└── backend/
    ├── server.js                      # Express server with CORS and rate limiting
    ├── routes/
    │   └── geopolitics.js             # /api/geopolitics/:countryCode — cache + Claude call
    └── cache/                         # daily JSON cache files (auto-cleaned)
```
