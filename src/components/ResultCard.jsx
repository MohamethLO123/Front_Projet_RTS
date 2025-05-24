export default function ResultCard({ result }) {
  return (
    <div className="alert alert-success mt-4">
      <h4>Résultats :</h4>
      <p><strong>Puissance reçue :</strong> {result.pr.toFixed(2)} dBm</p>
      <p><strong>Puissance en µW :</strong> {(result.pr_mw * 1000).toFixed(2)} µW</p>
    </div>
  );
}
