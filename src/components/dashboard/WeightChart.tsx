type WeightChartProps = {
  data: { date: string; weight: number }[];
};

const WIDTH = 640;
const HEIGHT = 240;
const PADDING_LEFT = 48;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-zinc-500">Aún no hay mediciones registradas.</p>;
  }

  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const hasRange = max > min;
  const range = hasRange ? max - min : 1;

  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const points = data.map((d, i) => {
    const x = data.length === 1 ? PADDING_LEFT + plotWidth / 2 : PADDING_LEFT + (i / (data.length - 1)) * plotWidth;
    const y = PADDING_TOP + plotHeight - ((d.weight - min) / range) * plotHeight;
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const yTicks = hasRange ? [max, min + range / 2, min] : [max];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      role="img"
      aria-label="Evolución del peso"
    >
      {yTicks.map((tick, i) => {
        const y = PADDING_TOP + plotHeight - ((tick - min) / range) * plotHeight;
        return (
          <g key={i}>
            <line
              x1={PADDING_LEFT}
              y1={y}
              x2={WIDTH - PADDING_RIGHT}
              y2={y}
              stroke="#e4e4e7"
              strokeWidth={1}
            />
            <text x={PADDING_LEFT - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize={11} fill="#71717a">
              {tick.toFixed(1)}
            </text>
          </g>
        );
      })}

      <text x={PADDING_LEFT} y={HEIGHT - 6} textAnchor="start" fontSize={11} fill="#71717a">
        {formatDate(data[0].date)}
      </text>
      <text x={WIDTH - PADDING_RIGHT} y={HEIGHT - 6} textAnchor="end" fontSize={11} fill="#71717a">
        {formatDate(data[data.length - 1].date)}
      </text>

      <path d={path} fill="none" stroke="#0d9488" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#0d9488" />
      ))}
    </svg>
  );
}
