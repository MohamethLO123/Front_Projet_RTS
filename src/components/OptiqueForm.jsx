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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function OptiqueForm({ addToHistory }) {
  const [form, setForm] = useState({
    pe: "",
    longueur: "",
    attenuation: "",
    pertes: ""
  });

  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const chartRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/optique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Erreur réseau");

      const data = await response.json();
      setResult(data);
      addToHistory({
        type: "Liaison Optique",
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
    const { pe, attenuation, pertes } = form;

    const longueurs = [];
    const pr_values = [];

    for (let l = 1; l <= 100; l++) {
      const att = l * parseFloat(attenuation) + parseFloat(pertes);
      const pr = parseFloat(pe) - att;
      longueurs.push(l);
      pr_values.push(pr.toFixed(2));
    }

    setGraphData({
      labels: longueurs,
      datasets: [
        {
          label: "Puissance reçue (dBm) vs Longueur (km)",
          data: pr_values,
          borderColor: "rgb(153, 102, 255)",
          fill: false,
          tension: 0.1
        }
      ]
    });
  };

  const getFormulaText = () => {
    const { pe, longueur, attenuation, pertes } = form;
    const att_total = (parseFloat(longueur) * parseFloat(attenuation) + parseFloat(pertes)).toFixed(2);
    const pr = (parseFloat(pe) - att_total).toFixed(2);
    const pr_mw = (10 ** (pr / 10) * 1000).toFixed(2);

    return (
      <div className="mt-4 p-3 bg-light rounded border">
        <h5>🧮 Étapes du calcul :</h5>
        <p><strong>Formule :</strong> P<sub>r</sub> = P<sub>e</sub> - (α × L + pertes)</p>
        <p><strong>Atténuation totale :</strong> {longueur} × {attenuation} + {pertes} = <mark>{att_total} dB</mark></p>
        <p><strong>Substitution :</strong> {pe} - {att_total} = <mark>{pr} dBm</mark></p>
        <p><strong>Conversion :</strong> P<sub>r</sub>(μW) = 10<sup>{pr}/10</sup> × 1000 ≈ <mark>{pr_mw} μW</mark></p>
      </div>
    );
  };

  const getIllustration = () => {
    const l = parseFloat(form.longueur);
    if (isNaN(l)) return null;
    if (l <= 10) return "/illustrations/optique_courte.png";
    if (l <= 50) return "/illustrations/optique_moyenne.png";
    return "/illustrations/optique_longue.png";
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">💡 Bilan de liaison optique</h2>

      <div className="row">
        {[
          { name: "pe", label: "Puissance émission (dBm)" },
          { name: "longueur", label: "Longueur de fibre (km)" },
          { name: "attenuation", label: "Atténuation (dB/km)" },
          { name: "pertes", label: "Pertes supplémentaires (dB)" }
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
        <button className="btn btn-primary" onClick={handleSimuler}>📉 Simuler</button>
      </div>

      {result && <ResultCard result={result} />}
      {result && getFormulaText()}

      {result && (
        <div className="mt-4 text-center">
          <h5>🖼️ Illustration de la liaison optique</h5>
          <img
            src={getIllustration()}
            alt="Illustration optique"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}

      {graphData && (
        <div className="mt-5">
          <Line data={graphData} />
        </div>
      )}
    </div>
  );
}
