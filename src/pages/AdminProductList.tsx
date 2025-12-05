/**
 * Componente AdminProductList - Lista de productos para administración.
 * 
 * Este componente permite a usuarios con roles admin, vendedor o mixto ver,
 * buscar y gestionar productos en formato de tabla.
 * 
 * Características:
 * - Lista todos los productos en formato tabla
 * - Búsqueda por nombre, SKU, licencia o categoría
 * - Acciones para editar y eliminar productos
 * - Verificación de permisos antes de mostrar contenido
 * - Manejo de estados de carga y errores
 */

// Importar React y hooks necesarios
import React, { useState, useEffect } from 'react';
// Importar Link de react-router-dom para navegación
import { Link } from 'react-router-dom';
// Importar hook useAuth para verificar permisos del usuario
import { useAuth } from '../context/AuthContext';

// URL del backend - usa variable de entorno REACT_APP_API_URL o fallback a localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Interfaz que define la estructura de un Producto para esta vista.
 * 
 * Representa un producto con toda su información necesaria para mostrar en la tabla.
 */
interface Product {
  product_id: number;  // ID único del producto
  product_name: string;  // Nombre del producto
  product_description: string;  // Descripción del producto
  price: number;  // Precio del producto
  stock: number;  // Cantidad disponible en stock
  discount: number;  // Descuento aplicado (porcentaje)
  sku: string;  // SKU (código único) del producto
  image_front: string;  // Ruta de la imagen frontal
  image_back: string;  // Ruta de la imagen reverso
  licence?: {  // Licencia del producto (opcional, puede ser objeto o string)
    licence_id: number;
    licence_name: string;
  };
  category?: {  // Categoría del producto (opcional, puede ser objeto o string)
    category_id: number;
    category_name: string;
  };
}

/**
 * Componente funcional AdminProductList.
 * 
 * Renderiza una tabla con todos los productos y permite gestionarlos.
 * Solo visible para usuarios con roles: admin, vendedor o mixto.
 * 
 * @returns {JSX.Element} Componente de lista de productos para administración
 */
const AdminProductList: React.FC = () => {
  // Obtener permisos del usuario desde el contexto de autenticación
  const { isVendedor, isAdmin, isMixto } = useAuth();
  
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estado para indicar si se están cargando productos
  const [loading, setLoading] = useState(true);
  
  // Estado para almacenar mensajes de error
  const [error, setError] = useState('');
  
  // Estado para el término de búsqueda (filtra productos en tiempo real)
  const [searchTerm, setSearchTerm] = useState('');

  // Efecto que se ejecuta al montar el componente y cuando cambian los permisos
  useEffect(() => {
    // Verificar permisos antes de cargar productos
    // Solo admin, vendedor y mixto pueden ver esta página
    if (!isAdmin && !isVendedor && !isMixto) {
      setError('No tienes permisos para ver esta página');
      setLoading(false);
      return;  // Salir temprano si no tiene permisos
    }

    // Si tiene permisos, cargar los productos
    fetchProducts();
  }, [isAdmin, isVendedor, isMixto]);  // Se ejecuta cuando cambian los permisos

  /**
   * Función para cargar productos desde el backend.
   * 
   * Hace una petición GET al endpoint /product/list/ y actualiza el estado
   * con los productos recibidos.
   */
  const fetchProducts = async () => {
    try {
      // Hacer petición GET al backend para obtener todos los productos
      const response = await fetch(`${API_URL}/product/list/`);
      
      if (response.ok) {
        // Si la respuesta es exitosa, parsear JSON
        const data = await response.json();
        
        // Asegurar que data sea un array (por si el backend retorna formato diferente)
        setProducts(Array.isArray(data) ? data : []);
      } else {
        // Si la respuesta no es exitosa, establecer mensaje de error
        setError('Error al cargar los productos');
      }
    } catch (err) {
      // Si hay error de conexión, establecer mensaje de error
      setError('Error de conexión con el servidor');
    } finally {
      // Siempre desactivar el estado de carga, sin importar el resultado
      setLoading(false);
    }
  };

  /**
   * Función para eliminar un producto.
   * 
   * Muestra un diálogo de confirmación antes de eliminar y luego hace
   * una petición DELETE al backend.
   * 
   * @param {number} productId - ID del producto a eliminar
   * @param {string} productName - Nombre del producto (para mostrar en confirmación)
   */
  const handleDelete = async (productId: number, productName: string) => {
    // Mostrar diálogo de confirmación antes de eliminar
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el producto "${productName}"?`)) {
      return;  // Si el usuario cancela, no hacer nada
    }

    try {
      // Hacer petición DELETE al backend para eliminar el producto
      const response = await fetch(`${API_URL}/product/delete/${productId}/`, {
        method: 'DELETE',  // Método HTTP DELETE
      });

      if (response.ok) {
        // Si se eliminó exitosamente, remover el producto de la lista local
        // Esto actualiza la UI inmediatamente sin necesidad de recargar
        setProducts(products.filter(p => p.product_id !== productId));
        
        // Mostrar mensaje de éxito
        alert('Producto eliminado exitosamente');
      } else {
        // Si hubo error, parsear respuesta y mostrar mensaje de error
        const data = await response.json();
        alert(data.message || 'Error al eliminar el producto');
      }
    } catch (err) {
      // Si hay error de conexión, mostrar mensaje de error
      alert('Error de conexión con el servidor');
    }
  };

  // Filtrar productos por término de búsqueda en tiempo real
  // La búsqueda es case-insensitive y busca en nombre, SKU, licencia y categoría
  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Buscar en nombre
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Buscar en SKU
    product.licence?.licence_name.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Buscar en licencia
    product.category?.category_name.toLowerCase().includes(searchTerm.toLowerCase())  // Buscar en categoría
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

