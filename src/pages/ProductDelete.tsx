import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct, deleteProduct } = useProducts();
  const [loading, setLoading] = useState(false);

  const product = id ? getProduct(parseInt(id)) : undefined;

  if (!product) {
    return (
      <div className="container mt-5 fade-in">
        <div className="alert alert-warning">
          <h4>Producto no encontrado</h4>
          <p>El producto que intentas eliminar no existe.</p>
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

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      if (id) {
        deleteProduct(parseInt(id));
        navigate('/productos');
      }
    }, 500);
  };

  const handleCancel = () => {
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
