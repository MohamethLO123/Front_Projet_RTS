import { useState, useRef } from "react";
import ResultCard from "./ResultCard";
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
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function HertzianForm({ addToHistory }) {
  const [form, setForm] = useState({
    pe: "",
    g1: "",
    g2: "",
    d: "",
    f: "",
    pertes: ""
  });

  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const chartRef = useRef();
  const reportRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hertzien", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const data = await response.json();
      setResult(data);
      addToHistory({
        type: "Liaison Hertzienne",
        input: { ...form },
        output: data
      });

      Swal.fire({
        title: "✅ Calcul effectué",
        text: "Le résultat a été enregistré avec succès !",
        icon: "success",
        confirmButtonText: "OK"
      });

    } catch (error) {
      Swal.fire({
        title: "❌ Erreur réseau",
        text: "Impossible de communiquer avec le serveur.",
        icon: "error",
        confirmButtonText: "Fermer"
      });
    }
  };

  const handleSimuler = () => {
    const { pe, g1, g2, f, pertes } = form;
    const c = 3e8;
    const freq = parseFloat(f) * 1e9;
    const lambda = c / freq;
    const distances = [];
    const pr_values = [];

    for (let d = 1; d <= 100; d++) {
      const d_m = d * 1000;
      const L = 20 * Math.log10((4 * Math.PI * d_m) / lambda);
      const pr =
        parseFloat(pe) +
        parseFloat(g1) +
        parseFloat(g2) -
        L -
        parseFloat(pertes);
      distances.push(d);
      pr_values.push(pr.toFixed(2));
    }

    setGraphData({
      labels: distances,
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
  };

  const getFormulaText = () => {
    const { pe, g1, g2, d, f, pertes } = form;
    const c = 3e8;
    const freq = parseFloat(f) * 1e9;
    const lambda = c / freq;
    const d_m = parseFloat(d) * 1000;
    const L = 20 * Math.log10((4 * Math.PI * d_m) / lambda).toFixed(2);
    const pr = (
      parseFloat(pe) +
      parseFloat(g1) +
      parseFloat(g2) -
      parseFloat(L) -
      parseFloat(pertes)
    ).toFixed(2);
    const pr_mw = (10 ** (pr / 10) * 1000).toFixed(2);

    return (
      <div className="mt-4 p-3 bg-light rounded border">
        <h5>🧮 Étapes du calcul :</h5>
        <p><strong>Formule :</strong> Pr = Pe + G1 + G2 - L - pertes</p>
        <p>λ = c / f = 3×10⁸ / {f}×10⁹ = {lambda.toFixed(4)} m</p>
        <p>L = 20·log₁₀(4π·{d_m} / {lambda.toFixed(4)}) = {L} dB</p>
        <p>{pe} + {g1} + {g2} - {L} - {pertes} = <mark>{pr} dBm</mark></p>
        <p>Conversion : 10<sup>{pr}/10</sup> × 1000 ≈ <mark>{pr_mw} μW</mark></p>
      </div>
    );
  };

  const getIllustration = () => {
    const d = parseFloat(form.d);
    if (isNaN(d)) return null;
    if (d <= 10) return "/illustrations/distance_courte.png";
    if (d <= 50) return "/illustrations/distance_moyenne.png";
    return "/illustrations/distance_longue.png";
  };

  const handleExportPDF = async () => {
    const input = reportRef.current;
    const canvasReport = await html2canvas(input, { scale: 2 });
    const imgData = canvasReport.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFontSize(16);
    pdf.text("📡 Rapport de dimensionnement – Liaison Hertzienne", 10, 15);

    const height = (canvasReport.height * pageWidth) / canvasReport.width;
    pdf.addImage(imgData, "PNG", 0, 20, pageWidth, height);

    const canvasGraph = chartRef.current?.querySelector("canvas");
    if (canvasGraph) {
      const graphImg = canvasGraph.toDataURL("image/png");
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text("📈 Graphique de simulation :", 10, 20);
      pdf.addImage(graphImg, "PNG", 10, 30, pageWidth - 20, 80);
    }

    pdf.save("rapport_liaison_hertzienne.pdf");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">📡 Bilan de liaison hertzienne</h2>

      <div className="row">
        {[
          { name: "pe", label: "Puissance émission (dBm)" },
          { name: "g1", label: "Gain antenne 1 (dB)" },
          { name: "g2", label: "Gain antenne 2 (dB)" },
          { name: "d", label: "Distance (km)" },
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

      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={handleSubmit}>🧮 Calculer</button>
        <button className="btn btn-primary me-2" onClick={handleSimuler}>📉 Simuler</button>
        {result && (
          <button className="btn btn-outline-dark" onClick={handleExportPDF}>📄 Générer le rapport PDF</button>
        )}
      </div>

      <div ref={reportRef} className="p-4 bg-white">
        <h4 className="mb-3">📌 Paramètres saisis :</h4>
        <ul>
          <li><strong>Puissance émission :</strong> {form.pe} dBm</li>
          <li><strong>Gain antenne 1 :</strong> {form.g1} dB</li>
          <li><strong>Gain antenne 2 :</strong> {form.g2} dB</li>
          <li><strong>Distance :</strong> {form.d} km</li>
          <li><strong>Fréquence :</strong> {form.f} GHz</li>
          <li><strong>Pertes :</strong> {form.pertes} dB</li>
        </ul>

        {result && (
          <>
            <h4 className="mt-4 mb-2">📊 Résultat :</h4>
            <ResultCard result={result} />
          </>
        )}

        <h4 className="mt-4 mb-2">🧠 Explication des étapes du calcul :</h4>
        {getFormulaText()}

        {result && (
          <div className="mt-4">
            <h4 className="mb-2">🖼️ Illustration associée :</h4>
            <img
              src={getIllustration()}
              alt="Illustration dynamique"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>

      {graphData && (
        <div className="mt-5" ref={chartRef}>
          <h4 className="mb-2">📈 Graphique de simulation :</h4>
          <Line data={graphData} />
        </div>
      )}
    </div>
  );
}
