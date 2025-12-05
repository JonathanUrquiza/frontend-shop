/**
 * Componente NavbarGuest - Barra de navegación para usuarios no autenticados.
 * 
 * Este componente renderiza la barra de navegación para usuarios que no han
 * iniciado sesión. Solo muestra opciones públicas del sitio.
 * 
 * Características:
 * - Menú SHOP con categorías de productos
 * - Menú CONTACTOS con opciones de contacto, FAQs y About
 * - Enlace a LOGIN para iniciar sesión
 * - Acceso al carrito de compras con contador (permite ver productos sin login)
 * - Menú responsive con hamburguesa en móviles
 */

// Importar React y hooks necesarios
import React, { useState } from 'react';
// Importar Link de react-router-dom para navegación
import { Link } from 'react-router-dom';
// Importar hook useCart para acceder al carrito de compras
import { useCart } from '../../context/CartContext';

/**
 * Componente funcional NavbarGuest.
 * 
 * Renderiza la barra de navegación para usuarios no autenticados con
 * solo opciones públicas del sitio.
 * 
 * @returns {JSX.Element} Barra de navegación para usuarios invitados
 */
const NavbarGuest: React.FC = () => {
  // Obtener función para contar items del carrito
  // Los usuarios invitados también pueden tener items en el carrito
  const { getCartCount } = useCart();
  
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado para controlar si el dropdown SHOP está abierto
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  
  // Estado para controlar si el dropdown CONTACTOS está abierto
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  // Obtener el número total de items en el carrito
  // Se actualiza automáticamente cuando cambia el carrito
  const cartCount = getCartCount();

  /**
   * Cierra todos los dropdowns abiertos.
   * 
   * Esta función se usa para cerrar todos los menús desplegables cuando
   * el usuario hace clic en un enlace o navega a otra página.
   */
  const closeAllDropdowns = () => {
    setIsMenuOpen(false);  // Cerrar menú móvil
    setIsShopDropdownOpen(false);  // Cerrar dropdown SHOP
    setIsContactDropdownOpen(false);  // Cerrar dropdown CONTACTOS
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

            {/* CONTACTO Dropdown */}
            <li 
              className="nav__item dropdown with-submenu"
              onMouseEnter={() => setIsContactDropdownOpen(true)}
              onMouseLeave={() => setIsContactDropdownOpen(false)}
            >
              <Link 
                className="nav__link dropdown-toggle" 
                to="/contacto"
                onClick={closeAllDropdowns}
              >
                CONTACTOS
              </Link>
              <ul className={`submenu ${isContactDropdownOpen ? 'show' : ''}`}>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/contacto" onClick={closeAllDropdowns}>
                    CONTACTO
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/faqs" onClick={closeAllDropdowns}>
                    FAQS
                  </Link>
                </li>
                <li className="submenu__item">
                  <Link className="dropdown-item submenu__link" to="/about" onClick={closeAllDropdowns}>
                    ABOUT
                  </Link>
                </li>
              </ul>
            </li>

            {/* LOGIN */}
            <li className="nav__item">
              <Link className="nav__link" to="/login" onClick={closeAllDropdowns}>
                LOGIN
              </Link>
            </li>

            {/* CART */}
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
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavbarGuest;

