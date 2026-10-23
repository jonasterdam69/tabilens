// Open-Meteo daily forecast (free, no key). Shared by the server and the static GitHub Pages build.

// Forecast at the spot pin, or the destination station if the spot has no coordinates.
export function weatherPin(places) {
  return places?.find((p) => p.kind === 'spot' && p.lat != null)
    ?? places?.find((p) => p.kind === 'station' && p.lat != null)
    ?? null;
}

export function fetchForecast({ lat, lng }) {
  // Redpine tool:  redpine.callTool(config.tools.weather, { lat, lng })
  // Outside API:
  return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,precipitation_probability_max&forecast_days=16&timezone=Asia/Tokyo`)
    .then((r) => r.json());
}
