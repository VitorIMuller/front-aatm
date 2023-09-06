import Home from "./pages/Home"
import Frota from "./pages/Frota"
import "./styles/reset.css"
import "./styles/style.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Clientes from "./pages/Clientes"
import Viagens from "./pages/Viagens"
import Motoristas from "./pages/Motoristas"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/frota" element={<Frota />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/viagens" element={<Viagens />} />
                <Route path="/motoristas" element={<Motoristas />} />
            </Routes>
        </Router>
    )
}
