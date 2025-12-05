import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NavbarMixto: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isProductosDropdownOpen, setIsProductosDropdownOpen] = useState(false);

  const cartCount = getCartCount();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeAllDropdowns = () => {
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
    setIsProductosDropdownOpen(false);
  };

  return (
    <header className="page-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1030 }}>
      <nav className="navbar navbar-expand-lg navbar-dark" aria-label="Fourth navbar example">
        <picture className="navbar__logo">
          <Link to="/" onClick={closeAllDropdowns}>
            <img 
              src="/multimedia/branding/logo_light_horizontal.svg" 
              alt="Logo del ecommerce funkoshop"
              style={{ maxWidth: '300px', height: 'auto' }}
            />
          </Link>
        </picture>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarsExample04" 
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse d-lg-flex justify-content-lg-end ${isMenuOpen ? 'show' : ''}`} id="navbarsExample04">
          <ul className="navbar-nav navbar__menu">
            {/* SHOP Dropdown */}
            <li 
              className="nav__item dropdown with-submenu"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <Link 
                className="nav__link dropdown-toggle" 
                to="/productos"
                onClick={closeAllDropdowns}
              >
                SHOP
              </Link>
              <ul className={`submenu ${isShopDropdownOpen ? 'show' : ''}`}>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/productos" onClick={closeAllDropdowns}>
                    Funkos
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/productos" onClick={closeAllDropdowns}>
                    Remeras
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/productos" onClick={closeAllDropdowns}>
                    Llaveros
                  </Link>
                </li>
              </ul>
            </li>

            {/* CONTACTO */}
            <li className="nav-item">
              <Link className="nav__link" to="/contacto" onClick={closeAllDropdowns}>
                CONTACTO
              </Link>
            </li>

            {/* PRODUCTOS Dropdown - CRUD de Productos (Vendedor) */}
            <li 
              className="nav__item dropdown with-submenu"
              onMouseEnter={() => setIsProductosDropdownOpen(true)}
              onMouseLeave={() => setIsProductosDropdownOpen(false)}
            >
              <Link 
                className="nav__link dropdown-toggle" 
                to="/admin/productos"
                onClick={closeAllDropdowns}
              >
                PRODUCTOS
              </Link>
              <ul className={`submenu ${isProductosDropdownOpen ? 'show' : ''}`}>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/productos" onClick={closeAllDropdowns}>
                    Ver Productos
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/admin/productos/list" onClick={closeAllDropdowns}>
                    Editar Productos
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/admin/productos/new" onClick={closeAllDropdowns}>
                    Crear Producto
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/admin/categorias/new" onClick={closeAllDropdowns}>
                    Crear Categoría
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/admin/licencias/new" onClick={closeAllDropdowns}>
                    Crear Licencia
                  </Link>
                </li>
              </ul>
            </li>

            {/* CART - Comprador */}
            <li className="nav__item">
              <Link className="nav__link" to="/carrito" onClick={closeAllDropdowns}>
                CART
              </Link>
            </li>

            {/* Cart Icon */}
            <li className="nav__item">
              <Link className="nav__link" to="/carrito" onClick={closeAllDropdowns} style={{ position: 'relative' }}>
                <img src="/multimedia/icons/cart-icon.svg" alt="Carrito" style={{ width: '24px', height: '24px' }} />
                {cartCount > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      backgroundColor: '#ff3333',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>

            {/* LOGOUT */}
            <li className="nav__item">
              <Link className="nav__link" to="/login" onClick={handleLogout}>
                LOGOUT
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavbarMixto;

