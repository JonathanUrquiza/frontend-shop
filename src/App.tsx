import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import ProductDelete from './pages/ProductDelete';
import Cart from './pages/Cart';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import CategoryForm from './pages/CategoryForm';
import LicenceForm from './pages/LicenceForm';
import AdminProductList from './pages/AdminProductList';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1" style={{ paddingTop: '110px' }}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/productos" element={<ProductList />} />
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
