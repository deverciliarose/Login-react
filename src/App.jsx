import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Cadastro from './Login/Cadastro';
import './App.css'
import Inicio from "./Login/Inicio";
import RotaProtegida from "./Login/RotaProtegida";


function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/cadastro" element={<Cadastro/>} />
          <Route element={<RotaProtegida />}>
            <Route path="/inicio" element={<Inicio />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
