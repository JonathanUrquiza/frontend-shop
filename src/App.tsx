/**
 * Componente principal de la aplicación React.
 * 
 * Este archivo configura el enrutamiento de la aplicación y envuelve todos los
 * componentes con los providers necesarios para el manejo de estado global.
 * 
 * Estructura:
 * - Providers: AuthProvider, ProductProvider, CartProvider (contextos globales)
 * - Router: Configuración de rutas usando react-router-dom
 * - Layout: Navbar, contenido principal, Footer
 * - Rutas: Definición de todas las rutas públicas y protegidas
 */

// Importar React para crear componentes
import React from 'react';
// Importar componentes de react-router-dom para manejo de rutas
import {
  BrowserRouter as Router,  // Router principal que usa History API del navegador
  Routes,  // Contenedor de rutas
  Route  // Componente para definir una ruta individual
} from 'react-router-dom';
// Importar providers de contexto para estado global
import { AuthProvider } from './context/AuthContext';  // Contexto de autenticación
import { ProductProvider } from './context/ProductContext';  // Contexto de productos
import { CartProvider } from './context/CartContext';  // Contexto del carrito de compras
// Importar componente para proteger rutas según roles de usuario
import ProtectedRoute from './components/ProtectedRoute';
// Importar componentes de layout
import Navbar from './components/Navbar';  // Barra de navegación superior
import Footer from './components/Footer';  // Pie de página
// Importar páginas de la aplicación
import Home from './pages/Home';  // Página de inicio
import Login from './pages/Login';  // Página de login
import Register from './pages/Register';  // Página de registro
import ProductList from './pages/ProductList';  // Lista de productos (pública)
import ProductDetail from './pages/ProductDetail';  // Detalle de un producto
import ProductForm from './pages/ProductForm';  // Formulario para crear/editar productos
import ProductDelete from './pages/ProductDelete';  // Página para eliminar productos
import Cart from './pages/Cart';  // Carrito de compras
import UserList from './pages/UserList';  // Lista de usuarios (solo admin)
import UserForm from './pages/UserForm';  // Formulario para crear/editar usuarios
import CategoryForm from './pages/CategoryForm';  // Formulario para crear categorías
import LicenceForm from './pages/LicenceForm';  // Formulario para crear licencias
import AdminProductList from './pages/AdminProductList';  // Lista de productos para administración

/**
 * Componente principal App.
 * 
 * Configura toda la estructura de la aplicación incluyendo:
 * - Providers de contexto (Auth, Product, Cart)
 * - Router con todas las rutas
 * - Layout con Navbar y Footer
 * 
 * @returns {JSX.Element} Componente principal de la aplicación
 */
function App() {
  return (
    // AuthProvider: Proporciona contexto de autenticación a toda la aplicación
    <AuthProvider>
      {/* ProductProvider: Proporciona contexto de productos a toda la aplicación */}
      <ProductProvider>
        {/* CartProvider: Proporciona contexto del carrito a toda la aplicación */}
        <CartProvider>
          {/* Router: Configura el enrutamiento de la aplicación */}
          <Router>
            {/* Contenedor principal con clase de Bootstrap para layout flexbox vertical */}
            <div className="d-flex flex-column min-vh-100">
              {/* Navbar: Barra de navegación que se muestra en todas las páginas */}
              <Navbar />
              {/* Contenido principal con padding superior para compensar navbar fijo */}
              <main className="flex-grow-1" style={{ paddingTop: '110px' }}>
                {/* Routes: Contenedor de todas las rutas de la aplicación */}
                <Routes>
                  {/* Ruta pública: Página de login */}
                  <Route path="/login" element={<Login />} />
                  {/* Ruta pública: Página de registro */}
                  <Route path="/register" element={<Register />} />
                  {/* Ruta pública: Lista de productos (catálogo) */}
                  <Route path="/productos" element={<ProductList />} />
                  {/* Ruta pública: Detalle de un producto específico (/:id es parámetro dinámico) */}
                  <Route path="/productos/:id" element={<ProductDetail />} />

                  {/* Ruta del carrito - protegida (comprador y mixto) */}
                  <Route
                    path="/carrito"
                    element={
                      <ProtectedRoute requireComprador={true}>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rutas protegidas para ABM productos (vendedor y admin): */}
                  <Route
                    path="/admin/productos/list"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <AdminProductList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/productos/new"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/productos/edit/:id"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/productos/delete/:id"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <ProductDelete />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rutas protegidas para ABM usuarios (solo admin): */}
                  <Route
                    path="/admin/usuarios"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <UserList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/usuarios/new"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <UserForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/usuarios/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <UserForm />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rutas protegidas para crear categorías y licencias (vendedor y mixto): */}
                  <Route
                    path="/admin/categorias/new"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <CategoryForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/licencias/new"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'vendedor', 'mixto']}>
                        <LicenceForm />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/" element={<Home />} /> {/* Home page with hero section */}
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
