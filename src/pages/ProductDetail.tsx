import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts, Product } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const getImageUrl = (prod: Product, isBack = false) => {
  if (isBack) {
    return '/multimedia/funkos-banner.webp';
  }
  if (prod.image_front) {
    return `/multimedia/${prod.image_front}`;
  }
  return '/multimedia/funkos-banner.webp';
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const { isAuthenticated } = useAuth();
  const { addToCart: addToCartContext } = useCart();

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<'front' | 'back'>('front');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const foundProduct = getProduct(parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id, getProduct]);

  const addToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    addToCartContext(product, quantity);
    alert(`¡${quantity} producto(s) agregado(s) al carrito!`);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Producto no encontrado
        </div>
        <Link to="/productos" className="btn btn-primary">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos" className="text-decoration-none">Productos</Link></li>
          <li className="breadcrumb-item active text-white" aria-current="page">{product.product_name}</li>
        </ol>
      </nav>

      <div className="card shadow-lg border-0 overflow-hidden">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="mb-3 text-center bg-light rounded p-3">
                <img
                  src={getImageUrl(product, selectedImage === 'back')}
                  className="img-fluid"
                  alt={product.product_name}
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                  onError={(e: any) => e.target.src = '/multimedia/funkos-banner.webp'}
                />
              </div>

              <div className="d-flex justify-content-center gap-2">
                <button
                  className={`btn ${selectedImage === 'front' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedImage('front')}
                >
                  Frontal
                </button>
                <button
                  className={`btn ${selectedImage === 'back' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedImage('back')}
                >
                  Trasera
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <h1 className="fw-bold mb-2 text-dark">{product.product_name}</h1>

              <div className="mb-3">
                <span className="badge bg-primary me-2">FUNKO</span>
                <span className="badge bg-secondary">{product.sku}</span>
              </div>

              <p className="text-muted mb-4">{product.description || 'Sin descripción disponible.'}</p>

              <div className="mb-4">
                <h2 className="text-primary fw-bold mb-2 display-5">${product.price}</h2>
                <p className={product.stock > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {product.stock > 0 ? `✓ Stock disponible: ${product.stock}` : '✕ Sin stock'}
                </p>
              </div>

              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark">Cantidad:</label>
                  <div className="input-group mb-3" style={{ maxWidth: '150px' }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      min="1"
                      max={product.stock}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="d-grid gap-2">
                {product.stock > 0 ? (
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={addToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Agregar al carrito
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-lg" disabled>
                    Sin stock
                  </button>
                )}
                <Link to="/productos" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver a productos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
