import { useState } from "react";
import ResultCard from "./ResultCard";

export default function OptiqueForm() {
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

  const handleSubmit = () => {
    const { pe, longueur, attenuation, pertes } = form;
    const att_totale = parseFloat(longueur) * parseFloat(attenuation) + parseFloat(pertes);
    const pr = parseFloat(pe) - att_totale;
    const pr_mw = 10 ** (pr / 10);
    setResult({ pr, pr_mw });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">💡 Bilan de liaison optique</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <input type="number" name="pe" className="form-control" placeholder="Puissance émission (dBm)" value={form.pe} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <input type="number" name="longueur" className="form-control" placeholder="Longueur (km)" value={form.longueur} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <input type="number" name="attenuation" className="form-control" placeholder="Atténuation (/km)" value={form.attenuation} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <input type="number" name="pertes" className="form-control" placeholder="Autres pertes (dB)" value={form.pertes} onChange={handleChange} />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>Calculer</button>

      {result && <ResultCard result={result} />}
    </div>
  );
}
