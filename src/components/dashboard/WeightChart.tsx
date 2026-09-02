type WeightChartProps = {
  data: { date: string; weight: number }[];
};

export function WeightChart({ data }: WeightChartProps) {
  if (data.length === 0) {
    return <p className="text-sm text-zinc-500">Aún no hay mediciones registradas.</p>;
  }

  const width = 600;
  const height = 200;
  const padding = 24;

  const weights = data.map((d) => d.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x =
      data.length === 1 ? width / 2 : padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.weight - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Evolución del peso">
      <path d={path} fill="none" stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#059669" />
      ))}
    </svg>
  );
}
