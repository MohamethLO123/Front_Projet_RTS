import { useState } from "react";
import ResultCard from "./ResultCard";
import Swal from "sweetalert2";

export default function OptiqueForm({ addToHistory }) {
  const [form, setForm] = useState({
    pe: "",
    longueur: "",
    attenuation: "",
    pertes: ""
  });

  const [result, setResult] = useState(null);

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

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }

      const data = await response.json();
      setResult(data);

      Swal.fire({
        title: '✅ Calcul effectué',
        text: 'Le résultat a été enregistré avec succès !',
        icon: 'success',
        confirmButtonText: 'OK'
      });


      addToHistory({
        type: "Liaison Optique",
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
    const { pe, longueur, attenuation, pertes } = form;
    const att_totale = (parseFloat(longueur) * parseFloat(attenuation) + parseFloat(pertes)).toFixed(2);
    const pr = (parseFloat(pe) - att_totale).toFixed(2);
    const pr_mw = (10 ** (pr / 10) * 1000).toFixed(2);

    return (
      <div className="mt-4 p-3 bg-light rounded border">
        <p><strong>Formule utilisée :</strong></p>
        <p><code>Atténuation totale = longueur × atténuation + pertes = {longueur} × {attenuation} + {pertes} = <mark>{att_totale} dB</mark></code></p>
        <p><code>P<sub>r</sub> = P<sub>e</sub> - atténuation = {pe} - {att_totale} = <mark>{pr} dBm</mark></code></p>
        <p><code>P<sub>r</sub>(μW) = 10<sup>{pr}/10</sup> × 1000 ≈ <mark>{pr_mw} μW</mark></code></p>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">💡 Bilan de liaison optique</h2>
      <div className="row">
        {[
          { name: "pe", label: "Puissance émission (dBm)" },
          { name: "longueur", label: "Longueur (km)" },
          { name: "attenuation", label: "Atténuation (/km)" },
          { name: "pertes", label: "Autres pertes (dB)" }
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
