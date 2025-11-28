import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface Licence {
  licence_id: number;
  licence_name: string;
}

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [licences] = useState<Licence[]>([
    { licence_id: 1, licence_name: 'Star Wars' },
    { licence_id: 2, licence_name: 'Pokemon' },
    { licence_id: 3, licence_name: 'Harry Potter' },
    { licence_id: 4, licence_name: 'Naruto' }
  ]);

  const cartCount = getCartCount();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    navigate('/login');
  };

  const closeAllDropdowns = () => {
    setIsMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={closeAllDropdowns}>
          <i className="bi bi-box-seam me-2"></i>
          Tienda Funkos
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeAllDropdowns}>Inicio</Link>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsProductsDropdownOpen(!isProductsDropdownOpen);
                  setIsUserDropdownOpen(false);
                }}
                aria-expanded={isProductsDropdownOpen}
              >
                Productos
              </a>
              <ul className={`dropdown-menu ${isProductsDropdownOpen ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to="/productos" onClick={closeAllDropdowns}>Ver todos los productos</Link></li>
                <li><hr className="dropdown-divider" /></li>
                {licences.map(licence => (
                  <li key={licence.licence_id}>
                    <Link
                      className="dropdown-item"
                      to={`/productos?licencia=${encodeURIComponent(licence.licence_name)}`}
                      onClick={closeAllDropdowns}
                    >
                      {licence.licence_name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contacto" onClick={closeAllDropdowns}>Contacto</Link>
            </li>
          </ul>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/carrito" onClick={closeAllDropdowns}>
                <i className="bi bi-cart3 fs-5"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/productos/new" onClick={closeAllDropdowns}>
                  <i className="bi bi-speedometer2 me-1"></i>
                  Admin
                </Link>
              </li>
            )}

            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                    setIsProductsDropdownOpen(false);
                  }}
                  aria-expanded={isUserDropdownOpen}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.username || user.email}
                </a>
                <ul className={`dropdown-menu dropdown-menu-end ${isUserDropdownOpen ? 'show' : ''}`}>
                  <li><Link className="dropdown-item" to="/perfil" onClick={closeAllDropdowns}>Mi Perfil</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                      Cerrar Sesión
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={closeAllDropdowns}>
                  <i className="bi bi-person-circle me-1"></i>
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
