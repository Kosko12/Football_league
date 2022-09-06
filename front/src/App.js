import './App.css';
import './css/output.css';
import { BrowserRouter as Router, Routes, Link, Route } from "react-router-dom";
import { Menu , Badge, Button} from "antd";
import Home from "./pages/Home";
import axios from "axios";


axios.defaults.baseURL = 'http://localhost:5450';

function App() {
  return (
    <Router>
      <div>
        <Menu mode="horizontal" className="bg-richwhite">
          <Menu.Item key="menuHome">
            <Link to="/" className="text-white">Tabela</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/menu">Menu</Link>
          </Menu.Item>
          <Menu.Item>
            <Badge count={1} size="small">
              <Link to="/cart" className="p-2">Rezerwacje</Link>
            </Badge>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={() => null}>Wyloguj</Button>
          </Menu.Item>
        </Menu>
        <Routes>
          <Route index element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
