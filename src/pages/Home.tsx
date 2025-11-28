import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product } from '../context/ProductContext';

// Función auxiliar para path de imagen
const getImageUrl = (prod: Product) => {
    if (prod.image_front) return `/multimedia/${prod.image_front}`;
    return '/multimedia/funkos-banner.webp';
};

const Home: React.FC = () => {
    const { products } = useProducts();

    // Obtener los primeros 8 productos para la sección destacados
    const featuredProducts = products.slice(0, 8);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section
                className="hero-section"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/multimedia/funkos-hero-banner.webp)`
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="hero-title">Tienda de Funkos</h1>
                    <p className="hero-subtitle">Encontrá tus figuras favoritas</p>
                    <Link to="/productos" className="btn btn-primary btn-lg">
                        Ver Productos
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4">
                                <div className="feature-icon mb-3">
                                    <i className="bi bi-truck fs-1 text-primary"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-2">Envío Gratis</h3>
                                <p className="text-muted mb-0">En compras mayores a $50,000</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4">
                                <div className="feature-icon mb-3">
                                    <i className="bi bi-credit-card fs-1 text-primary"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-2">Paga como quieras</h3>
                                <p className="text-muted mb-0">Tarjeta, crédito, débito o efectivo</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card text-center p-4">
                                <div className="feature-icon mb-3">
                                    <i className="bi bi-shield-check fs-1 text-primary"></i>
                                </div>
                                <h3 className="h5 fw-bold mb-2">Comprá con seguridad</h3>
                                <p className="text-muted mb-0">Tus productos protegidos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-products-section py-5">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-white mb-0">Productos Destacados</h2>
                        <Link to="/productos" className="btn btn-outline-light">
                            Ver todos
                        </Link>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-white fs-5">No hay productos disponibles</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {featuredProducts.map(prod => (
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
                                                <h6 className="card-title mb-2" style={{ minHeight: '40px', fontWeight: '700' }}>
                                                    {prod.product_name}
                                                </h6>
                                            </Link>
                                            <span className="badge bg-secondary mb-2 align-self-start">
                                                {prod.sku.split('-')[1] || 'FUNKO'}
                                            </span>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
