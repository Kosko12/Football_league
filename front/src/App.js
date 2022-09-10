import "./App.css";
import "./css/output.css";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { Menu, Badge, Button } from "antd";
import Home from "./pages/Home";
import axios from "axios";
import Locations from "./pages/Locations";
import Players from './pages/Players';
import Matches from './pages/Matches'
import Referees from './pages/Referees'
import Sponsors from './pages/Sponsors'

axios.defaults.baseURL = "http://localhost:5450";

function App() {
  return (
    <Router>
      <div>
        <Menu mode="horizontal" className="bg-richwhite">
          <Menu.Item key="menuHome">
            <Link to="/" className="text-white">
              Tabela
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/locations" className="p-2">
              Lokalizacje
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/players" className="p-2">
              Zawodnicy
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/referees" className="p-2">
              Sędziowie
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/sponsors" className="p-2">
              Sponsorzy
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/matches" className="p-2">
              Mecze
            </Link>
          </Menu.Item>
        </Menu>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/players" element={<Players />} />
          <Route path="/referees" element={<Referees />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/sponsors" element={<Sponsors />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
