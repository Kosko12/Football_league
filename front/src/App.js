import "./App.css";
import "./css/output.css";
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { Menu, Badge, Button } from "antd";
import Home from "./pages/Home";
import axios from "axios";
import Locations from "./pages/Locations";
import Players from './pages/Players';

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
            <Button onClick={() => null}>Wyloguj</Button>
          </Menu.Item>
        </Menu>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/players" element={<Players />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
