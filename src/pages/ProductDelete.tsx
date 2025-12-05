/**
 * Componente ProductDelete - Página de confirmación para eliminar productos.
 * 
 * Este componente permite a usuarios con permisos (admin, vendedor, mixto)
 * eliminar productos del sistema. Muestra una página de confirmación con
 * información del producto antes de eliminarlo.
 * 
 * Características:
 * - Muestra información del producto a eliminar
 * - Página de confirmación con advertencia
 * - Botones para confirmar o cancelar la eliminación
 * - Manejo de estados de carga y errores
 * - Redirección automática después de eliminar
 */

// Importar React y hooks necesarios
import React, { useState } from 'react';
// Importar hooks de react-router-dom para obtener parámetros de URL y navegación
import { useParams, useNavigate } from 'react-router-dom';
// Importar hook useProducts del contexto de productos
import { useProducts } from '../context/ProductContext';

/**
 * Componente funcional ProductDelete.
 * 
 * Renderiza una página de confirmación para eliminar un producto específico.
 * 
 * @returns {JSX.Element} Página de confirmación de eliminación o mensaje de error
 */
const ProductDelete: React.FC = () => {
  // Obtener el ID del producto desde los parámetros de la URL
  // Ejemplo: /admin/productos/delete/1 -> id = "1"
  const { id } = useParams<{ id: string }>();
  
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  
  // Obtener funciones del contexto de productos
  const { getProduct, deleteProduct } = useProducts();
  
  // Estado para indicar si se está procesando la eliminación
  const [loading, setLoading] = useState(false);

  // Obtener el producto a eliminar usando el ID de la URL
  // Si hay ID, convertirlo a número y buscar el producto
  // Si no hay ID o no se encuentra el producto, será undefined
  const product = id ? getProduct(parseInt(id)) : undefined;

  // Si no se encuentra el producto, mostrar mensaje de error
  if (!product) {
    return (
      <div className="container mt-5 fade-in">
        <div className="alert alert-warning">
          <h4>Producto no encontrado</h4>
          <p>El producto que intentas eliminar no existe.</p>
          {/* Botón para volver a la lista de productos */}
          <button
            className="btn btn-primary"
            onClick={() => navigate('/productos')}
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  /**
   * Maneja la eliminación del producto.
   * 
   * Esta función se ejecuta cuando el usuario confirma la eliminación.
   * Llama al backend para eliminar el producto y redirige a la lista de productos.
   */
  const handleDelete = async () => {
    // Activar estado de carga
    setLoading(true);
    
    try {
      // Verificar que hay un ID válido
      if (id) {
        // Llamar a la función deleteProduct del contexto
        // Esta función hace la petición DELETE al backend
        await deleteProduct(parseInt(id));
        
        // Si se eliminó exitosamente, redirigir a la lista de productos
        navigate('/productos');
      }
    } catch (error) {
      // Si hay error, registrar en consola y mostrar alerta al usuario
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Verifica la conexión con el servidor.');
    } finally {
      // Siempre desactivar el estado de carga, sin importar el resultado
      setLoading(false);
    }
  };

  /**
   * Maneja la cancelación de la eliminación.
   * 
   * Esta función se ejecuta cuando el usuario hace clic en "Cancelar".
   * Redirige a la lista de productos sin eliminar nada.
   */
  const handleCancel = () => {
    // Redirigir a la lista de productos sin eliminar
    navigate('/productos');
  };

  return (
    <div className="container mt-5 mb-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center" style={{ color: '#dc3545', fontWeight: '700' }}>
                🗑️ Eliminar Producto
              </h2>

              <div className="alert alert-danger">
                <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
              </div>

              <div className="mb-4">
                <h5 style={{ color: '#333' }}>¿Estás seguro de que deseas eliminar este producto?</h5>

                <div className="mt-3 p-3" style={{ background: 'rgba(220, 53, 69, 0.1)', borderRadius: '15px' }}>
                  <p className="mb-2"><strong>Nombre:</strong> {product.product_name}</p>
                  <p className="mb-2"><strong>SKU:</strong> {product.sku}</p>
                  <p className="mb-2"><strong>Precio:</strong> ${product.price}</p>
                  <p className="mb-0"><strong>Stock:</strong> {product.stock} unidades</p>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-danger flex-grow-1"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDelete;
