import Swal from "sweetalert2";

export default function HistoryPage({ history, setHistory }) {
  const clearHistory = () => {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action supprimera tout l'historique.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("historique");
      setHistory([]);
      Swal.fire('Supprimé !', 'L’historique a été supprimé.', 'success');
    }
  });
};


  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>🕓 Historique des Calculs</h2>
        <button className="btn btn-danger" onClick={clearHistory}>
          🗑️ Vider l’historique
        </button>
      </div>

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
                    <li><strong>Atténuation totale :</strong> {entry.input.longueur} × {entry.input.attenuation} + {entry.input.pertes}</li>
                    <li><strong>P<sub>r</sub> =</strong> {entry.input.pe} - atténuation</li>
                  </>
                )}
                <li><strong>P<sub>r</sub> ≈</strong> {entry.output.pr.toFixed(2)} dBm / {(entry.output.pr_mw * 1000).toFixed(2)} μW</li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
