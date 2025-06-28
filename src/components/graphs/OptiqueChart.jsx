import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function OptiqueChart({ longueur, att, pertes }) {
  const pas = 0.5;
  const data = [];
  for (let i = 0; i <= longueur; i += pas) {
    const pr = -10 - (i * att + pertes);
    data.push({ km: i.toFixed(1), pr: pr.toFixed(2) });
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="km" label={{ value: 'Distance (km)', position: 'insideBottom', offset: -5 }} />
          <YAxis label={{ value: 'Puissance reçue (dBm)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="pr" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
