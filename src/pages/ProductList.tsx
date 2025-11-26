import React, { useEffect, useState } from 'react';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  stock: number;
  sku: string;
  image_front?: string;
}

// Función auxiliar para path de imagen (editar si hay lógica real en el backend)
const getImageUrl = (prod: Product) => {
  // Si el producto trae una imagen, la usa; si no, img de fallback
  if (prod.image_front) return `/multimedia/${prod.image_front}`;
  // Ejemplo: según nombre o SKU, intentar mapear a una imagen real si hace falta
  // Por ahora, fallback
  return '/multimedia/funkos-banner.webp';
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/product/list/')
      .then(res => {
        if (!res.ok) throw new Error('Error de red');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4">Cargando productos...</div>;
  if (error) return <div className="container mt-4"><span className="text-danger">Error: {error}</span></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Productos</h2>
      <div className="row">
        {products.map(prod => (
          <div key={prod.product_id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow">
              <img 
                src={getImageUrl(prod)} 
                className="card-img-top" 
                alt={prod.product_name} 
                style={{objectFit: 'cover', height: 180}}
                onError={(e: any) => e.target.src='/multimedia/funkos-banner.webp'}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{prod.product_name}</h5>
                <p className="card-text mb-1">Precio: <b>${prod.price}</b></p>
                <p className="card-text mb-1">Stock: {prod.stock}</p>
                <span className="badge bg-secondary align-self-start">SKU: {prod.sku}</span>
                {/* Botones de acción aquí si hace falta */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
