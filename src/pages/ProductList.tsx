import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts, Product } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

// Interfaces para filtros
interface LicenceInfo {
  licence_id: number;
  licence_name: string;
}

interface CategoryInfo {
  category_id: number;
  category_name: string;
}

// Función auxiliar para path de imagen
const getImageUrl = (prod: Product) => {
  if (prod.image_front) return `/multimedia/${prod.image_front}`;
  return '/multimedia/funkos-banner.webp';
};

const ProductList: React.FC = () => {
  const { products: allProducts } = useProducts();
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLicence, setSelectedLicence] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Mock de licencias y categorías
  const licences: LicenceInfo[] = [
    { licence_id: 1, licence_name: 'Star Wars' },
    { licence_id: 2, licence_name: 'Pokemon' },
    { licence_id: 3, licence_name: 'Harry Potter' },
    { licence_id: 4, licence_name: 'Naruto' }
  ];

  const categories: CategoryInfo[] = [
    { category_id: 1, category_name: 'Figuras' },
    { category_id: 2, category_name: 'Llaveros' },
    { category_id: 3, category_name: 'Remeras' }
  ];

  useEffect(() => {
    const licenceParam = searchParams.get('licencia');
    if (licenceParam) {
      setSelectedLicence(licenceParam);
    }
  }, [searchParams]);

  // Filtrado instantáneo sin delay
  useEffect(() => {
    let result = [...allProducts];

    if (selectedLicence) {
      result = result.filter(p =>
        p.licence === selectedLicence ||
        p.product_name.toLowerCase().includes(selectedLicence.toLowerCase())
      );
    }

    if (searchTerm) {
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(result);
  }, [allProducts, selectedLicence, selectedCategory, searchTerm]);

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="fw-bold mb-0 text-white">Productos</h1>
            {isAdmin && (
              <Link to="/admin/productos/new" className="btn btn-success">
                ➕ Nuevo Producto
              </Link>
            )}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="card p-3 mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="bi bi-search"></i> Buscar
                  </button>
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedLicence}
                  onChange={(e) => setSelectedLicence(e.target.value)}
                >
                  <option value="">Todas las licencias</option>
                  {licences.map(lic => (
                    <option key={lic.licence_id} value={lic.licence_name}>
                      {lic.licence_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0 text-white">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-white fs-5">No se encontraron productos</p>
          <button onClick={() => { setSearchTerm(''); setSelectedLicence(''); }} className="btn btn-primary">
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map(prod => (
            <div key={prod.product_id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
                  <Link to={`/productos/${prod.product_id}`}>
                    <img
                      src={getImageUrl(prod)}
                      className="card-img-top w-100 h-100"
                      alt={prod.product_name}
                      style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                      onError={(e: any) => e.target.src = '/multimedia/funkos-banner.webp'}
                    />
                  </Link>
                  {prod.stock === 0 && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-danger">Sin stock</span>
                    </div>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <Link to={`/productos/${prod.product_id}`} className="text-decoration-none text-dark">
                    <h6 className="card-title mb-2" style={{ minHeight: '40px', fontWeight: '700' }}>{prod.product_name}</h6>
                  </Link>
                  <span className="badge bg-secondary mb-2 align-self-start">{prod.sku.split('-')[1] || 'FUNKO'}</span>
                  <div className="mt-auto">
                    <p className="card-text mb-1">
                      <strong className="text-primary fs-5">${prod.price}</strong>
                    </p>
                    <Link
                      to={`/productos/${prod.product_id}`}
                      className="btn btn-primary w-100 mt-2"
                    >
                      <i className="bi bi-eye me-2"></i>
                      Ver Detalle
                    </Link>

                    {isAdmin && (
                      <div className="d-flex gap-2 mt-2">
                        <Link
                          to={`/admin/productos/edit/${prod.product_id}`}
                          className="btn btn-warning btn-sm flex-grow-1"
                        >
                          ✏️
                        </Link>
                        <Link
                          to={`/admin/productos/delete/${prod.product_id}`}
                          className="btn btn-danger btn-sm flex-grow-1"
                        >
                          🗑️
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
