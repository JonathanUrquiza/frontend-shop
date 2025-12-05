import React from 'react';
import { useAuth } from '../context/AuthContext';
import NavbarAdmin from './navbars/NavbarAdmin';
import NavbarVendedor from './navbars/NavbarVendedor';
import NavbarComprador from './navbars/NavbarComprador';
import NavbarMixto from './navbars/NavbarMixto';
import NavbarGuest from './navbars/NavbarGuest';

const Navbar: React.FC = () => {
  const { user, role } = useAuth();

  // Renderizar navbar según el rol del usuario
  if (!user) {
    return <NavbarGuest />;
  }

  switch (role) {
    case 'admin':
      return <NavbarAdmin />;
    case 'vendedor':
      return <NavbarVendedor />;
    case 'comprador':
      return <NavbarComprador />;
    case 'mixto':
      return <NavbarMixto />;
    default:
      return <NavbarGuest />;
  }
};

export default Navbar;
