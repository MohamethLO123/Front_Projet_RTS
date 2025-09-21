import { useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Simulation() {
  const [form, setForm] = useState({
    pe: 40,
    g1: 45.5,
    g2: 45.5,
    f: 6,
    pertes: 10.9
  });

  const [mode, setMode] = useState("distance"); // "distance" ou "frequence"
  const [graphData, setGraphData] = useState(null);
  const chartRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSimuler = () => {
    const { pe, g1, g2, f, pertes } = form;
    const c = 3e8;

    const xAxis = [];
    const pr_values = [];

    if (mode === "distance") {
      const freq = parseFloat(f) * 1e9;
      const lambda = c / freq;

      for (let d = 1; d <= 100; d++) {
        const d_m = d * 1000;
        const L = 20 * Math.log10((4 * Math.PI * d_m) / lambda);
        const pr =
          parseFloat(pe) +
          parseFloat(g1) +
          parseFloat(g2) -
          L -
          parseFloat(pertes);
        xAxis.push(d);
        pr_values.push(pr.toFixed(2));
      }

      setGraphData({
        labels: xAxis,
        datasets: [
          {
            label: "Puissance reçue (dBm) vs Distance (km)",
            data: pr_values,
            borderColor: "rgb(75, 192, 192)",
            fill: false,
            tension: 0.1
          }
        ]
      });
    }

    if (mode === "frequence") {
      const d_m = 50000; // distance fixe à 50 km

      for (let f_ghz = 1; f_ghz <= 15; f_ghz++) {
        const freq = f_ghz * 1e9;
        const lambda = c / freq;
        const L = 20 * Math.log10((4 * Math.PI * d_m) / lambda);
        const pr =
          parseFloat(pe) +
          parseFloat(g1) +
          parseFloat(g2) -
          L -
          parseFloat(pertes);
        xAxis.push(f_ghz);
        pr_values.push(pr.toFixed(2));
      }

      setGraphData({
        labels: xAxis,
        datasets: [
          {
            label: "Puissance reçue (dBm) vs Fréquence (GHz)",
            data: pr_values,
            borderColor: "rgb(255, 99, 132)",
            fill: false,
            tension: 0.1
          }
        ]
      });
    }
  };

  const handleExport = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
    const imgWidth = imgProps.width * ratio;
    const imgHeight = imgProps.height * ratio;

    pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, 20, imgWidth, imgHeight);
    pdf.save("simulation.pdf");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📉 Simulation : Puissance reçue</h2>

      <div className="mb-4">
        <label className="form-label"><strong>Type de simulation :</strong></label>
        <select
          className="form-select w-auto"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="distance">📏 Puissance vs Distance</option>
          <option value="frequence">📡 Puissance vs Fréquence</option>
        </select>
      </div>

      <div className="row">
        {[
          { name: "pe", label: "Puissance émission (dBm)" },
          { name: "g1", label: "Gain antenne 1 (dB)" },
          { name: "g2", label: "Gain antenne 2 (dB)" },
          { name: "f", label: "Fréquence (GHz)" },
          { name: "pertes", label: "Pertes totales (dB)" }
        ].map(({ name, label }) => (
          <div className="col-md-6 mb-3" key={name}>
            <input
              type="number"
              name={name}
              className="form-control"
              placeholder={label}
              value={form[name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <button className="btn btn-primary mb-4" onClick={handleSimuler}>
        Lancer la simulation
      </button>

      <button className="btn btn-outline-secondary mb-4 ms-2" onClick={handleExport}>
        📄 Exporter en PDF
      </button>

      {graphData ? (
        <div ref={chartRef}>
          <Line data={graphData} />
        </div>
      ) : (
        <div
          style={{ height: "300px", backgroundColor: "#f8f9fa" }}
          className="d-flex align-items-center justify-content-center border rounded"
        >
          <em>Graphique non généré</em>
        </div>
      )}
    </div>
  );
}
