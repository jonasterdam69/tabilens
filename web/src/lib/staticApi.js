// In-browser stand-in for the API server, used by the GitHub Pages build (VITE_STATIC=true).
// Mock mode only: it reuses the server's mock routes, weather and Wikipedia code, which need no keys.
import { mockItinerary } from '../../../server/src/mock.js';
import { weatherFrom } from '../../../server/src/normalize.js';
import { weatherPin, fetchForecast } from '../../../server/src/weather.js';
import { wikiExplore, wikiNearby, placeQueries } from '../../../server/src/wikipedia.js';

export const staticApi = {
  health: async () => ({ ok: true, mode: 'mock' }),
  plan: async (query, origin = 'Asakusa') => {
    const plan = mockItinerary({ query, origin });
    const pin = weatherPin(plan.places);
    const raw = pin ? await fetchForecast(pin).catch(() => null) : null;
    return { ...plan, weather: weatherFrom(raw) };
  },
  explore: async ({ title, name, area, lat, lng }) => {
    const near = lat != null && lng != null ? { lat, lng } : undefined;
    const node = await wikiExplore({ title, queries: placeQueries({ name, area }), near });
    if (!node) throw new Error('No Wikipedia article found');
    return node;
  },
  nearby: async (lat, lng) => ({ nearby: await wikiNearby({ lat, lng }) }),
};
