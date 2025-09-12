import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo">TIGO</div>
      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/faq">Preguntas Frecuentes</Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/cuenta">Cuenta</Link>
      </nav>
    </header>
  );
}

export default Header;