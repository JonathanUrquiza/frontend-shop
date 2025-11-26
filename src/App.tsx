import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import ProductDelete from './pages/ProductDelete';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        {/* Rutas protegidas para ABM productos (solo admin): */}
        <Route path="/admin/productos/new" element={<ProductForm />} />
        <Route path="/admin/productos/edit/:id" element={<ProductForm />} />
        <Route path="/admin/productos/delete/:id" element={<ProductDelete />} />
        <Route path="/" element={<ProductList />} /> {/* Home muestra listado */}
      </Routes>
    </Router>
  );
}

export default App;
