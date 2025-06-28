import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HertzianForm from "./components/HertzianForm";
import OptiqueForm from "./components/OptiqueForm";
import HistoryPage from "./components/HistoryPage";
import Simulation from "./components/Simulation";


function App() {
  const [history, setHistory] = useState([]);

  // 🔄 Charger l'historique depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("historique");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // 📥 Ajouter un nouvel élément et sauvegarder dans localStorage
  const addToHistory = (entry) => {
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem("historique", JSON.stringify(newHistory));
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HertzianForm addToHistory={addToHistory} />} />
          <Route path="/liaison-optique" element={<OptiqueForm addToHistory={addToHistory} />} />
          <Route
            path="/historique"
            element={<HistoryPage history={history} setHistory={setHistory} />}
          />
          <Route path="/simulation" element={<Simulation />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
