# GeoScope

An interactive 3D globe that lets you click any country and get an AI-generated geopolitical briefing updated daily.

![GeoScope](https://raw.githubusercontent.com/kovvurisupraj/Geoscope/master/preview.png)

## Features

- 3D interactive Earth globe with country highlighting
- Click any country to get a real-time geopolitical briefing
- Covers: Political Situation, International Relations, Active Conflicts, Economic Outlook
- Powered by Claude AI + live news from NewsAPI
- Daily cache — results refresh every 24 hours
- Rate limited to prevent API abuse

## Tech Stack

- **Frontend:** React + Vite, react-globe.gl
- **Backend:** Node.js + Express
- **AI:** Claude Haiku (Anthropic)
- **News:** NewsAPI
- **Infrastructure:** Docker + Docker Compose

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed
- [Anthropic API key](https://console.anthropic.com)
- [NewsAPI key](https://newsapi.org/register) (free)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/kovvurisupraj/Geoscope.git
   cd Geoscope
   ```

2. Create the environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Fill in your API keys in `backend/.env`:
   ```
   ANTHROPIC_API_KEY=your_key_here
   NEWS_API_KEY=your_key_here
   ```

4. Start the project:
   ```bash
   docker-compose up --build
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## Usage

- **Hover** a country to see its name
- **Click** a country to open the geopolitical briefing panel
- **Click X** to close the panel and resume globe rotation
- Briefings are cached per country per day — repeated clicks on the same country are instant
