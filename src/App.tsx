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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <div className="d-flex flex-column min-vh-100">
              <Navbar />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/productos" element={<ProductList />} />
                  <Route path="/productos/:id" element={<ProductDetail />} />

                  {/* Ruta del carrito - protegida */}
                  <Route
                    path="/carrito"
                    element={
                      <ProtectedRoute requireAdmin={false}>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />

                  {/* Rutas protegidas para ABM productos (solo admin): */}
                  <Route
                    path="/admin/productos/new"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/productos/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ProductForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/productos/delete/:id"
                    element={
                      <ProtectedRoute requireAdmin={true}>
                        <ProductDelete />
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
