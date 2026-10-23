# TabiLens (旅レンズ)

Autonomous editorial day-trip & transit copilot — Team 19, Redpine × NordicNinja × KDDI Tokyo Hackathon 2026.

Mood prompt → ADDIX magazine spot (with editorial photo) → live Tobu rail + bus timetable → route map and weather forecast for the destination.

## Quick start

Requires Node.js 22.9 or newer (the server uses `--env-file-if-exists`).

```bash
npm install
cp server/.env.example server/.env   # mock mode by default
cp web/.env.example web/.env         # add your Google Maps key here
npm run dev                          # API :8787 + web :5173
```

Open http://localhost:5173. Mock mode returns a canned Nikko itinerary so the UI and demo flow work with zero credits spent. The weather forecast and destination photo are real even in mock mode.

## Google Maps and Places

The route map and destination photo need a browser key in `web/.env` (`VITE_GOOGLE_MAPS_API_KEY`). In Google Cloud Console, on the key's project, enable:

- **Maps JavaScript API**: the route map
- **Places API (New)**: the destination photo (not the older "Places API")
- **Geocoding API**: only needed if live stops come back without coordinates

If the key has API restrictions, allow the same APIs there. Restrict it to HTTP referrers `localhost:5173/*`, `localhost:8787/*` plus your demo URL. The "Open in Google Maps" button needs no key. Newly enabled APIs can take a few minutes to start working.

**Destination photo.** When the spot has no editorial photo (always the case in mock mode), the spot card searches Google Places for the spot's name and area and shows the top photo. Google's terms require the photographer credit shown in the caption, so keep it.

## Weather

The plan includes a daily forecast (high temperature, chance of rain) for the spot, or the destination station if the spot has no coordinates. It comes from [Open-Meteo](https://open-meteo.com/), which is free and needs no key. If the call fails, the plan still returns, with `weather: null`.

## Going live

1. In `server/.env` set `TABILENS_MODE=live`, `REDPINE_MCP_URL`, `REDPINE_API_KEY`.
2. Check the connection: `curl localhost:8787/api/health` (returns your balance).
3. Confirm the real tool names for your account: `curl "localhost:8787/api/tools?q=addix"`, `?q=tobu`, `?q=chronicle`. Update the `*_TOOL` vars in `.env` if they differ.
4. Run one query, look at the raw responses, and tighten the field mapping in `server/src/normalize.js` (every spot is marked `TODO(live)`).

`MAX_AUTO_CONFIRM_USD` caps what a single search can spend without a human click — anything pricier comes back in `billing.pending`.

## Layout

```
server/src/
  index.js          Express API (/api/health, /api/plan, /api/confirm, /api/tools)
  orchestrator.js   The pipeline: editorial → transit → audio → weather
  redpine.js        MCP client: preview / confirm / call-tool + guarded auto-confirm
  intent.js         English mood → Japanese magazine query (rule-based)
  normalize.js      Raw Redpine/Tobu payloads → Unified JSON Payload
  mock.js           Demo payload in the same shape
web/src/
  App.jsx
  components/       QueryInput, SpotCard, MapView, WeatherCard, TimetableWidget
  lib/              loadGoogleMaps (script loader), placePhoto (Places photo lookup)
```

The server still runs the Chronicle audio search in live mode and returns `audio` and `trace` in the plan, but the web app no longer shows them.

## Demo build

`npm run build && npm start` serves the built frontend from the API on :8787 — one process, one URL for the live demo.

## Next steps

- Wire live tool responses into `normalize.js`
- Return-trip routing (second `rail_departures` call, reversed)
- Spacia X affiliate deep-link button
- LLM-based intent parsing instead of the rule table
- Drop the Chronicle audio step from the server, or show it again (it spends credits in live mode)
