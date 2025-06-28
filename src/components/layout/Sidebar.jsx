import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px", position: "fixed" }}>
      <h4 className="text-center">Menu</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">📡 Liaison Hertzienne</Link>
        </li>
        {/* Pages futures : */}
        <li className="nav-item">
            <Link to="/liaison-optique" className="nav-link text-white">💡 Liaison Optique</Link>
        </li>

        <li className="nav-item">
            <Link to="/historique" className="nav-link text-white">🕓 Historique</Link>
        </li>

        <li className="nav-item">
          <Link to="/simulation" className="nav-link text-white">
            📉 Simulation
          </Link>
        </li>


      </ul>
    </div>
  );
}
