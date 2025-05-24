export default function HistoryPage({ history }) {
  return (
    <div className="container mt-5">
      <h2 className="mb-4">🕓 Historique des Calculs</h2>
      {history.length === 0 ? (
        <p>Aucun calcul effectué pour le moment.</p>
      ) : (
        history.map((entry, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                {entry.type === "Liaison Hertzienne" ? "📡 Liaison Hertzienne" : "💡 Liaison Optique"}
              </h5>

              <ul className="list-unstyled mt-3">
                {entry.type === "Liaison Hertzienne" ? (
                  <>
                    <li><strong>λ =</strong> c / f = 3×10⁸ / {entry.input.f}×10⁹</li>
                    <li><strong>L =</strong> 20·log₁₀(4π·{entry.input.d}000 / λ)</li>
                    <li><strong>P<sub>r</sub></strong> = {entry.input.pe} + {entry.input.g1} + {entry.input.g2} - L - {entry.input.pertes}</li>
                  </>
                ) : (
                  <>
                    <li><strong>Atténuation totale :</strong> {entry.input.longueur} × {entry.input.attenuation} + {entry.input.pertes} = <mark>{(parseFloat(entry.input.longueur) * parseFloat(entry.input.attenuation) + parseFloat(entry.input.pertes)).toFixed(2)} dB</mark></li>
                    <li><strong>P<sub>r</sub> =</strong> {entry.input.pe} - atténuation = <mark>{entry.output.pr.toFixed(2)} dBm</mark></li>
                  </>
                )}
                <li><strong>P<sub>r</sub>(μW) =</strong> 10<sup>{entry.output.pr.toFixed(2)}/10</sup> × 1000 ≈ <mark>{(entry.output.pr_mw * 1000).toFixed(2)} μW</mark></li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
