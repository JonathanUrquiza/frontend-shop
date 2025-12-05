/**
 * Componente Navbar - Barra de navegación dinámica basada en roles.
 * 
 * Este componente renderiza diferentes barras de navegación según el rol del usuario.
 * Cada rol tiene su propio navbar con opciones y permisos específicos.
 * 
 * Roles y sus navbars:
 * - admin: NavbarAdmin (acceso completo)
 * - vendedor: NavbarVendedor (gestión de productos)
 * - comprador: NavbarComprador (ver productos y comprar)
 * - mixto: NavbarMixto (funciones de vendedor y comprador)
 * - Sin usuario: NavbarGuest (solo ver productos y login/registro)
 * 
 * El componente usa el contexto de autenticación para determinar qué navbar mostrar.
 */

// Importar React para crear componentes
import React from 'react';
// Importar hook useAuth para acceder al estado de autenticación
import { useAuth } from '../context/AuthContext';
// Importar todos los componentes de navbar específicos por rol
import NavbarAdmin from './navbars/NavbarAdmin';  // Navbar para administradores
import NavbarVendedor from './navbars/NavbarVendedor';  // Navbar para vendedores
import NavbarComprador from './navbars/NavbarComprador';  // Navbar para compradores
import NavbarMixto from './navbars/NavbarMixto';  // Navbar para usuarios mixtos
import NavbarGuest from './navbars/NavbarGuest';  // Navbar para usuarios no autenticados

/**
 * Componente funcional Navbar.
 * 
 * Este componente actúa como un router de navbars, seleccionando el navbar
 * apropiado según el rol del usuario autenticado.
 * 
 * Lógica de selección:
 * 1. Si no hay usuario autenticado -> NavbarGuest
 * 2. Si hay usuario -> Seleccionar navbar según su rol
 * 3. Si el rol no coincide con ninguno conocido -> NavbarGuest (fallback)
 * 
 * @returns {JSX.Element} Componente de navbar apropiado para el rol del usuario
 */
const Navbar: React.FC = () => {
  // Obtener usuario y rol del contexto de autenticación
  const { user, role } = useAuth();

  // Si no hay usuario autenticado, mostrar navbar de invitado
  // El navbar de invitado solo muestra opciones públicas (productos, login, registro)
  if (!user) {
    return <NavbarGuest />;
  }

  // Seleccionar navbar según el rol del usuario usando switch
  // Cada caso retorna el componente navbar específico para ese rol
  switch (role) {
    case 'admin':
      // Navbar para administradores con acceso completo al sistema
      return <NavbarAdmin />;
    case 'vendedor':
      // Navbar para vendedores con opciones de gestión de productos
      return <NavbarVendedor />;
    case 'comprador':
      // Navbar para compradores con opciones de ver productos y carrito
      return <NavbarComprador />;
    case 'mixto':
      // Navbar para usuarios mixtos (pueden hacer funciones de vendedor y comprador)
      return <NavbarMixto />;
    default:
      // Fallback: si el rol no coincide con ninguno conocido, mostrar navbar de invitado
      // Esto previene errores si hay un rol desconocido
      return <NavbarGuest />;
  }
};

export default Navbar;
