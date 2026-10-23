export default function WeatherCard({ weather }) {
  if (!weather?.days?.length) return null;
  const days = weather.days.slice(0, 4);
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold text-moss-dark">Weather at the spot</h2>
        <span className="text-xs text-ink/50">{weather.source}</span>
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-2 text-center">
        {days.map((d) => (
          <li key={d.date} className="rounded-lg bg-paper px-2 py-2">
            <p className="text-xs text-ink/50">{dayLabel(d.date)}</p>
            <p className="mt-1 text-lg">{d.rainPct >= 50 ? '🌧' : d.rainPct >= 20 ? '⛅' : '☀️'}</p>
            <p className="font-medium">{d.maxC != null ? `${Math.round(d.maxC)}°` : '–'}</p>
            <p className={`text-xs ${d.rainPct >= 50 ? 'text-rail' : 'text-ink/50'}`}>
              {d.rainPct != null ? `${d.rainPct}% rain` : ''}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function dayLabel(iso) {
  const d = new Date(`${iso}T00:00:00+09:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' });
}
