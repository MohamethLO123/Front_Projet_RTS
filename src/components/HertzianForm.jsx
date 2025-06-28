import { useState } from "react";
import ResultCard from "./ResultCard";
import Swal from "sweetalert2";

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

      if (!response.ok) {
        throw new Error("Erreur réseau lors de la requête");
      }

      const data = await response.json();
      setResult(data);

      Swal.fire({
        title: '✅ Calcul effectué',
        text: 'Le résultat a été enregistré avec succès !',
        icon: 'success',
        confirmButtonText: 'OK'
      });


      // Ajout à l'historique
      addToHistory({
        type: "Liaison Hertzienne",
        input: { ...form },
        output: data
      });
    } catch (error) {
        console.error("Erreur :", error);
        Swal.fire({
          title: "❌ Erreur réseau",
          text: "Impossible de communiquer avec le serveur. Vérifie qu’il est bien lancé.",
          icon: "error",
          confirmButtonText: "Fermer"
        });
      }

  };

  const getFormulaText = () => {
    const { pe, g1, g2, d, f, pertes } = form;
    const c = 3e8;
    const lambda = c / (f * 1e9);
    const distance = d * 1000;
    const L = (20 * Math.log10((4 * Math.PI * distance) / lambda)).toFixed(2);
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
        <p><strong>Formule utilisée :</strong></p>
        <p><code>P<sub>r</sub> = P<sub>e</sub> + G<sub>1</sub> + G<sub>2</sub> - L - α</code></p>
        <p><code>P<sub>r</sub> = {pe} + {g1} + {g2} - {L} - {pertes} = <mark>{pr} dBm</mark></code></p>
        <p><code>P<sub>r</sub>(μW) = 10<sup>{pr}/10</sup> × 1000 ≈ <mark>{pr_mw} μW</mark></code></p>
      </div>
    );
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

      <button className="btn btn-primary" onClick={handleSubmit}>Calculer</button>

      {result && (
        <>
          <ResultCard result={result} />
          {getFormulaText()}
        </>
      )}
    </div>
  );
}
