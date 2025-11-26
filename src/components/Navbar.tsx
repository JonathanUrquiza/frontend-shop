import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  // TODO: Integrar lógica de usuario autenticado y roles
  const isAdmin = false; // Placeholder (proteger luego)
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Shop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/productos">ABM Productos</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
