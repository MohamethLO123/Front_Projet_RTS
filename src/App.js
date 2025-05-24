import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HertzianForm from "./components/HertzianForm";
import OptiqueForm from "./components/OptiqueForm";
import HistoryPage from "./components/HistoryPage";

function App() {
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => {
    setHistory([...history, entry]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HertzianForm addToHistory={addToHistory} />} />
          <Route path="/liaison-optique" element={<OptiqueForm addToHistory={addToHistory} />} />
          <Route path="/historique" element={<HistoryPage history={history} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
