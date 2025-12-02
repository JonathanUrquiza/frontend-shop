import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts, Product } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// Interfaces para filtros
interface LicenceInfo {
  licence_id: number;
  licence_name: string;
}

interface CategoryInfo {
  category_id: number;
  category_name: string;
}

// Función auxiliar para convertir imagen a -box (para mostrar en card)
const getBoxImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/multimedia/funkos-banner.webp';
  // Si termina en -1.webp, convertir a -box.webp
  if (imagePath.endsWith('-1.webp')) {
    return imagePath.replace(/-1\.webp$/, '-box.webp');
  }
  // Si ya termina en -box.webp, mantenerlo
  if (imagePath.endsWith('-box.webp')) {
    return imagePath;
  }
  // Si no tiene ni -1 ni -box, intentar agregar -box antes de .webp
  return imagePath.replace(/\.webp$/, '-box.webp');
};

// Función auxiliar para convertir imagen a -1 (para hover)
const getHoverImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/multimedia/funkos-banner.webp';
  // Si termina en -box.webp, convertir a -1.webp
  if (imagePath.endsWith('-box.webp')) {
    return imagePath.replace(/-box\.webp$/, '-1.webp');
  }
  // Si ya termina en -1.webp, mantenerlo
  if (imagePath.endsWith('-1.webp')) {
    return imagePath;
  }
  // Si no tiene ni -1 ni -box, intentar agregar -1 antes de .webp
  return imagePath.replace(/\.webp$/, '-1.webp');
};

// Función auxiliar para obtener la imagen box (por defecto en cards)
const getImageUrl = (prod: Product) => {
  // Si tiene image_front del backend, convertir a -box para mostrar en card
  if (prod.image_front && prod.image_front.trim() !== '') {
    // Normalizar la ruta del backend
    let imagePath = prod.image_front.trim();
    
    // Si ya empieza con /multimedia/, usarla directamente
    if (imagePath.startsWith('/multimedia/')) {
      // Ya está completa
    }
    // Si empieza con / pero no con /multimedia/, quitar el / inicial y agregar /multimedia/
    else if (imagePath.startsWith('/')) {
      imagePath = `/multimedia${imagePath}`;
    }
    // Si empieza con multimedia/, agregar solo el / inicial
    else if (imagePath.startsWith('multimedia/')) {
      imagePath = `/${imagePath}`;
    }
    // Si no tiene nada, agregar /multimedia/
    else {
      imagePath = `/multimedia/${imagePath}`;
    }
    
    const boxImage = getBoxImageUrl(imagePath);
    console.log(`📦 CARD IMAGE - Producto: "${prod.product_name}"`);
    console.log(`   Backend image_front: "${prod.image_front}"`);
    console.log(`   Ruta normalizada: "${imagePath}"`);
    console.log(`   Imagen box final: "${boxImage}"`);
    console.log(`   ──────────────────────────────────────`);
    return boxImage;
  }
  
  // Último recurso: banner por defecto
  console.warn(`⚠️ Sin imagen - Producto: "${prod.product_name}", usando banner por defecto`);
  return '/multimedia/funkos-banner.webp';
};

// Función auxiliar para obtener la imagen hover (-1)
const getHoverImage = (prod: Product) => {
  if (prod.image_front && prod.image_front.trim() !== '') {
    // Normalizar la ruta del backend
    let imagePath = prod.image_front.trim();
    
    // Si ya empieza con /multimedia/, usarla directamente
    if (imagePath.startsWith('/multimedia/')) {
      // Ya está completa
    }
    // Si empieza con / pero no con /multimedia/, quitar el / inicial y agregar /multimedia/
    else if (imagePath.startsWith('/')) {
      imagePath = `/multimedia${imagePath}`;
    }
    // Si empieza con multimedia/, agregar solo el / inicial
    else if (imagePath.startsWith('multimedia/')) {
      imagePath = `/${imagePath}`;
    }
    // Si no tiene nada, agregar /multimedia/
    else {
      imagePath = `/multimedia/${imagePath}`;
    }
    
    const hoverImage = getHoverImageUrl(imagePath);
    console.log(`🖱️ HOVER IMAGE - Producto: "${prod.product_name}"`);
    console.log(`   Imagen hover final: "${hoverImage}"`);
    return hoverImage;
  }
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
  const [sortBy, setSortBy] = useState<string>('mayor-precio');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [filters, setFilters] = useState<{
    nuevos?: boolean;
    ofertas?: boolean;
    edicionEspecial?: boolean;
    favoritos?: boolean;
  }>({});

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

  // Filtrado y ordenamiento
  useEffect(() => {
    let result = [...allProducts];

    // Filtro por licencia
    if (selectedLicence) {
      result = result.filter(p =>
        p.licence === selectedLicence ||
        p.product_name.toLowerCase().includes(selectedLicence.toLowerCase())
      );
    }

    // Filtro por búsqueda
    if (searchTerm) {
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por precio
    if (minPrice > 0 || maxPrice > 0) {
      result = result.filter(p => {
        const price = p.price;
        if (minPrice > 0 && maxPrice > 0) {
          return price >= minPrice && price <= maxPrice;
        } else if (minPrice > 0) {
          return price >= minPrice;
        } else if (maxPrice > 0) {
          return price <= maxPrice;
        }
        return true;
      });
    }

    // Filtro por ofertas
    if (filters.ofertas) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    // Ordenamiento
    result.sort((a, b) => {
      switch (sortBy) {
        case 'mayor-precio':
          return b.price - a.price;
        case 'menor-precio':
          return a.price - b.price;
        case 'nombre-asc':
          return a.product_name.localeCompare(b.product_name);
        case 'nombre-desc':
          return b.product_name.localeCompare(a.product_name);
        case 'mas-nuevos':
          return b.product_id - a.product_id;
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [allProducts, selectedLicence, selectedCategory, searchTerm, sortBy, minPrice, maxPrice, filters]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedLicence('');
    setSelectedCategory('');
    setSortBy('mayor-precio');
    setMinPrice(0);
    setMaxPrice(0);
    setFilters({});
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleFiltersChange = (newFilters: {
    nuevos?: boolean;
    ofertas?: boolean;
    edicionEspecial?: boolean;
    favoritos?: boolean;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
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
        </div>
      </div>

      {/* Layout con Sidebar y Contenido */}
      <div className="row">
        {/* Sidebar */}
        <div className="col-lg-3 mb-4 mb-lg-0">
          <Sidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLicence={selectedLicence}
            setSelectedLicence={setSelectedLicence}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            licences={licences}
            categories={categories}
            onClearFilters={handleClearFilters}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Contenido Principal */}
        <div className="col-lg-9">
          {/* Resultados */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="mb-0 text-white">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-white fs-5">No se encontraron productos</p>
          <button onClick={handleClearFilters} className="btn btn-primary">
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map(prod => (
            <div key={prod.product_id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <div 
                  className="position-relative overflow-hidden product-image-container" 
                  style={{ height: '250px' }}
                  onMouseEnter={(e) => {
                    const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                    if (img) img.src = getHoverImage(prod);
                  }}
                  onMouseLeave={(e) => {
                    const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                    if (img) img.src = getImageUrl(prod);
                  }}
                >
                  <Link to={`/productos/${prod.product_id}`}>
                    <img
                      src={getImageUrl(prod)}
                      className="card-img-top w-100 h-100"
                      alt={prod.product_name}
                      style={{ objectFit: 'cover', transition: 'opacity 0.3s ease-in-out' }}
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
      </div>
    </div>
  );
};

export default ProductList;
