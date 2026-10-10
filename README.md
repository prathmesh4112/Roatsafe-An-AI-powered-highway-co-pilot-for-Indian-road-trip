# 🛣️ RoadSafe — AI Highway Co-pilot

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SerpApi](https://img.shields.io/badge/Powered%20by-SerpApi-success)](https://serpapi.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-green?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **An AI-powered highway co-pilot for Indian road trips.**  
> Built for the **SerpApi Hackathon 2026**.

RoadSafe is an intelligent highway travel companion that makes long-distance driving safer, smoother, and more predictable. By aggregating data across multiple SerpApi search engines, it generates real-time safety scores, live road incident alerts, micro-climate weather clearance, and curated top-rated fuel/EV stops along any Indian highway corridor.

---

## 🚀 Live Demo & Screenshots

- **Live Demo:** Coming Soon
- **Demo Video:** Coming Soon

---

## ✨ Key Features

- **🛡️ Dynamic Safety Score (0-100):** Real-time safety calculation factoring in critical/warning incident reports and micro-climate hazards (rain, fog, ghat descent risks).
- **🗺️ Road-Snapped GPS Map:** Real road geometry (6,000+ points) snapped to actual highway curves via OSRM, complete with drive simulation and live car GPS tracking.
- **⛽ Curated Top-Rated Stops Only (≥4.2★):** Clustered stop recommendations (~2 per city node) with verified user reviews, 24/7 status, and EV fast-charging speeds.
- **🌦️ Checkpoint Weather Radar:** Micro-climate clearance at 4 highway waypoints (Departure, Midway, Mountain Ghat, Arrival) checking rain, visibility, and wind.
- **🚨 Live Incident Feed:** Real-time road accident, landslide, and closure reports parsed from SerpApi Google News.
- **🔊 AI Driver Voice Briefing:** Text-to-speech audio briefing providing safety advice, optimal departure times, and highway conditions.
- **⚡ Multiple Fuel Modes:** Dedicated radars for EV (CCS2 fast chargers), CNG (high-pressure cascades), Petrol, and Diesel.
- **🌙 Dark & Light Themes:** Crisp, high-contrast dashboard designed for high visibility during daytime and night drives.

---

## 🔍 How SerpApi Powers RoadSafe

RoadSafe utilizes **3 SerpApi search engines** via direct HTTP API calls to `https://serpapi.com/search.json`:

| Feature | SerpApi Engine | Implementation Details |
|---|---|---|
| **Live Highway Incidents** | `google_news` | Searches for recent accidents, landslides, waterlogging, or closures along the corridor (e.g. `Pune to Goa highway traffic accident OR landslide`). Results are classified into Critical, Warning, and Advisory severity tiers. |
| **Top-Rated Highway Stops** | `google_maps` | Queries curated fuel/EV/food stops along the route. Results are strictly filtered for **rating ≥ 4.2★**, operational status, and verified customer review snippets. |
| **Checkpoint Weather Clearance** | `google` | Leverages Google search answer boxes to retrieve localized temperatures, weather conditions, precipitation chances, and wind speeds at 4 corridor checkpoints. |

> **Graceful Fallback:** All API calls include curated fallback data so the application remains 100% functional even if API keys are missing or rate limits are reached.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS v4, Lucide React icons
- **Map Engine:** Leaflet.js with free Google Maps tile servers (no Google API key required)
- **Routing & Navigation:** OSRM (Open Source Routing Machine) for road geometry and turn-by-turn maneuvers
- **Geocoding:** Nominatim geocoding engine with offline fallback lookup
- **APIs:** SerpApi (Google News, Google Maps, Google Search)

---

## 📂 Project Architecture

```text
app/
├── page.tsx                  # Overview Dashboard (Safety Score, Weather Clearance)
├── map/page.tsx              # Live GPS Map with OSRM Road Routing & Simulator
├── trips/page.tsx            # Trip Itinerary Manager & Waypoints
├── alerts/page.tsx           # Highway Incident Feed with Severity Filters
├── fuel/page.tsx             # Fuel & EV Fast-Charger Radar
├── places/page.tsx           # Dhabas, Rest Stops & Emergency Trauma Centers
├── api/route-intel/route.ts  # Multi-engine SerpApi route intelligence aggregator
├── api/ai-briefing/route.ts  # AI voice driver briefing text generator
├── layout.tsx                # Shared AppShell layout
└── globals.css               # Tailwind v4 styles & theme variables

components/
├── layout/                   # AppShell, Sidebar, Topbar
├── map/                      # RouteMap (Leaflet, real road polyline, car marker)
├── route/                    # RoutePlanner, IntelStrip, RouteVisualizer
├── stops/                    # StopCard with verified reviews
├── alerts/                   # AlertCard with severity badges
├── weather/                  # WeatherClearance checkpoint grid
├── ai/                       # AiBriefingModal with SpeechSynthesis TTS
└── modals/                   # HowItWorksModal (SerpApi architecture)

lib/
├── serpapi.ts                # SerpApi client (Google News, Maps, Weather)
├── route-context.tsx         # Global React Context for route state
├── route-geometry.ts         # OSRM road-snapped geometry fetcher
└── utils.ts                  # ClassName helper utilities
```

---

## 🗺️ Application Pages

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/` | At-a-glance corridor overview, dynamic safety score, micro-climate weather radar, and quick route presets. |
| **Live Map** | `/map` | Interactive Leaflet map snapped to actual roads with turn-by-turn guidance and 1x/4x/12x driving simulator. |
| **My Trips** | `/trips` | Itinerary planning and waypoint checkpoint breakdown. |
| **Alert Feed** | `/alerts` | Incident scanner filtered by Critical, Warning, and Advisory road alerts. |
| **Fuel Radar** | `/fuel` | EV fast-charging stations and high-pressure petrol/CNG pumps with user reviews. |
| **Highway Places** | `/places` | Highway dhabas, family-friendly food malls, and 24/7 trauma centers. |

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ installed
- A SerpApi API key (get one free at [serpapi.com](https://serpapi.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/roadsafe.git
   cd roadsafe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Add your SerpApi key:
   ```env
   SERPAPI_API_KEY=your_serpapi_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Production Build

To verify and produce an optimized production build:

```bash
npm run build
npm run start
```

---

## 📜 License

This project is open-source and licensed under the [MIT License](LICENSE).
