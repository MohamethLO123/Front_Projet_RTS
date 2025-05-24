import { useState } from "react";
import ResultCard from "./ResultCard";

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

      // Ajouter à l'historique
      addToHistory({
        type: "Liaison Hertzienne",
        input: { ...form },
        output: data
      });

    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur s'est produite lors du calcul.");
    }
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

      {result && <ResultCard result={result} />}
    </div>
  );
}
