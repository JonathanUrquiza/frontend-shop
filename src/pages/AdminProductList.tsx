import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  price: number;
  stock: number;
  discount: number;
  sku: string;
  image_front: string;
  image_back: string;
  licence?: {
    licence_id: number;
    licence_name: string;
  };
  category?: {
    category_id: number;
    category_name: string;
  };
}

const AdminProductList: React.FC = () => {
  const { isVendedor, isAdmin, isMixto } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Verificar permisos
    if (!isAdmin && !isVendedor && !isMixto) {
      setError('No tienes permisos para ver esta página');
      setLoading(false);
      return;
    }

    fetchProducts();
  }, [isAdmin, isVendedor, isMixto]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/product/list/`);
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        setError('Error al cargar los productos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/product/delete/${productId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.product_id !== productId));
        alert('Producto eliminado exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar el producto');
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
    }
  };

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.licence?.licence_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mt-5 mb-5" style={{ paddingTop: '120px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-white">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error && !products.length) {
    return (
      <div className="container mt-5 mb-5" style={{ paddingTop: '120px' }}>
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5" style={{ paddingTop: '120px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-white">Gestión de Productos</h1>
        <Link to="/admin/productos/new" className="btn btn-success">
          + Crear Producto
        </Link>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, SKU, licencia o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: '500px' }}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No hay productos registrados.'}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Licencia</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descuento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    {product.image_front ? (
                      <img
                        src={`/multimedia${product.image_front}`}
                        alt={product.product_name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/multimedia/funkos-banner.webp';
                        }}
                      />
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </td>
                  <td>
                    <strong>{product.product_name}</strong>
                    {product.product_description && (
                      <>
                        <br />
                        <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {product.product_description.length > 50
                            ? `${product.product_description.substring(0, 50)}...`
                            : product.product_description}
                        </small>
                      </>
                    )}
                  </td>
                  <td>
                    <code>{product.sku}</code>
                  </td>
                  <td>{product.licence?.licence_name || 'N/A'}</td>
                  <td>{product.category?.category_name || 'N/A'}</td>
                  <td>
                    <strong className="text-success">${product.price.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    {product.discount > 0 ? (
                      <span className="badge bg-warning text-dark">{product.discount}%</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/productos/edit/${product.product_id}`}
                        className="btn btn-warning btn-sm"
                        title="Editar producto"
                      >
                        ✏️ Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product.product_id, product.product_name)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar producto"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-white">
        <small>
          Mostrando {filteredProducts.length} de {products.length} productos
          {searchTerm && ` (filtrados por "${searchTerm}")`}
        </small>
      </div>
    </div>
  );
};

export default AdminProductList;

