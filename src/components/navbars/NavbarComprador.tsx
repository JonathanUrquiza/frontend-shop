/**
 * Componente NavbarComprador - Barra de navegación para compradores.
 * 
 * Este componente renderiza la barra de navegación específica para usuarios
 * con rol de comprador. Incluye acceso a ver productos y gestionar el carrito.
 * 
 * Características:
 * - Menú SHOP con categorías de productos
 * - Enlace a CONTACTO
 * - Acceso al carrito de compras con contador
 * - Botón de logout
 * - Menú responsive con hamburguesa en móviles
 */

// Importar React y hooks necesarios
import React, { useState } from 'react';
// Importar componentes de react-router-dom para navegación
import { Link, useNavigate } from 'react-router-dom';
// Importar hook useAuth para acceder al estado de autenticación
import { useAuth } from '../../context/AuthContext';
// Importar hook useCart para acceder al carrito de compras
import { useCart } from '../../context/CartContext';

/**
 * Componente funcional NavbarComprador.
 * 
 * Renderiza la barra de navegación para compradores con opciones de
 * visualización de productos y gestión del carrito.
 * 
 * @returns {JSX.Element} Barra de navegación para compradores
 */
const NavbarComprador: React.FC = () => {
  // Obtener usuario y función logout del contexto de autenticación
  const { user, logout } = useAuth();
  
  // Obtener función para contar items del carrito
  const { getCartCount } = useCart();
  
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Estado para controlar si el dropdown SHOP está abierto
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  // Obtener el número total de items en el carrito
  // Se actualiza automáticamente cuando cambia el carrito
  const cartCount = getCartCount();

  /**
   * Maneja el cierre de sesión del usuario.
   * 
   * Esta función se ejecuta cuando el usuario hace clic en el botón de logout.
   * Cierra la sesión, cierra el menú móvil y redirige a la página de login.
   * 
   * @param {React.MouseEvent} e - Evento del click (para prevenir comportamiento por defecto)
   */
  const handleLogout = async (e: React.MouseEvent) => {
    // Prevenir comportamiento por defecto del enlace
    e.preventDefault();
    
    // Cerrar sesión del usuario (limpia el estado y localStorage)
    logout();
    
    // Cerrar el menú móvil si está abierto
    setIsMenuOpen(false);
    
    // Redirigir a la página de login
    navigate('/login');
  };

  /**
   * Cierra todos los dropdowns abiertos.
   * 
   * Esta función se usa para cerrar todos los menús desplegables cuando
   * el usuario hace clic en un enlace o navega a otra página.
   */
  const closeAllDropdowns = () => {
    setIsMenuOpen(false);  // Cerrar menú móvil
    setIsShopDropdownOpen(false);  // Cerrar dropdown SHOP
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

export default NavbarComprador;

