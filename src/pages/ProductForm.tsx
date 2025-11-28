import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProduct } = useProducts();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    stock: '',
    sku: '',
    image_front: '',
    description: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const product = getProduct(parseInt(id));
      if (product) {
        setFormData({
          product_name: product.product_name,
          price: product.price.toString(),
          stock: product.stock.toString(),
          sku: product.sku,
          image_front: product.image_front || '',
          description: product.description || ''
        });
      }
    }
  }, [id, isEditMode, getProduct]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.product_name.trim()) {
      newErrors.push('El nombre del producto es requerido');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.push('El precio debe ser mayor a 0');
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.push('El stock no puede ser negativo');
    }

    if (!formData.sku.trim()) {
      newErrors.push('El SKU es requerido');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const productData = {
      product_name: formData.product_name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      sku: formData.sku,
      image_front: formData.image_front || 'funkos-banner.webp',
      description: formData.description
    };

    try {
      if (isEditMode && id) {
        await updateProduct(parseInt(id), productData);
      } else {
        await addProduct(productData);
      }
      navigate('/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrors(['Error al guardar el producto. Verifica la conexión con el servidor.']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-5 mb-5 fade-in">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center" style={{ color: '#764ba2', fontWeight: '700' }}>
                {isEditMode ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
              </h2>

              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <ul className="mb-0">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    placeholder="Ej: Funko Pop! Batman"
                    disabled={loading}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                      Precio ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                      Stock *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                    SKU *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ej: FNK-BM-001"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                    Imagen (nombre del archivo)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="image_front"
                    value={formData.image_front}
                    onChange={handleChange}
                    placeholder="funkos-banner.webp"
                    disabled={loading}
                  />
                  <small className="text-muted">Dejar vacío para usar imagen por defecto</small>
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: '#333', fontWeight: '600' }}>
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción del producto..."
                    disabled={loading}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/productos')}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
