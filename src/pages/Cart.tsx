import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Función auxiliar para obtener el nombre de la licencia como string
const getLicenceName = (licence?: string | { licence_id: number; licence_name: string }): string | undefined => {
    if (!licence) return undefined;
    if (typeof licence === 'string') return licence;
    return licence.licence_name;
};

const getImageUrl = (imageFront?: string, licence?: string | { licence_id: number; licence_name: string }, productName?: string) => {
    // Si tiene image_front, normalizar la ruta
    if (imageFront && imageFront.trim() !== '') {
        let imagePath = imageFront.trim();
        
        // Si ya empieza con /multimedia/, usarla directamente
        if (imagePath.startsWith('/multimedia/')) {
            return imagePath;
        }
        // Si empieza con / pero no con /multimedia/, quitar el / inicial y agregar /multimedia/
        else if (imagePath.startsWith('/')) {
            return `/multimedia${imagePath}`;
        }
        // Si empieza con multimedia/, agregar solo el / inicial
        else if (imagePath.startsWith('multimedia/')) {
            return `/${imagePath}`;
        }
        // Si no tiene nada, agregar /multimedia/
        else {
            return `/multimedia/${imagePath}`;
        }
    }
    
    // Si no tiene image_front pero tiene licencia, intentar construir la ruta
    const licenceName = getLicenceName(licence);
    if (licenceName && productName) {
        // Normalizar el nombre de la licencia para que coincida con las carpetas
        const licenceFolder = licenceName.toLowerCase().replace(/\s+/g, '-');
        // Intentar construir una ruta basada en el nombre del producto y la licencia
        const productSlug = productName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        // Retornar la ruta construida (el onError manejará si no existe)
        return `/multimedia/${licenceFolder}/${productSlug}-1.webp`;
    }
    
    // Último recurso: banner por defecto
    return '/multimedia/funkos-banner.webp';
};

const Cart: React.FC = () => {
    const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (items.length === 0) return;

        alert('¡Gracias por tu compra! Esta es una simulación. En producción, aquí se procesaría el pago.');
        clearCart();
        navigate('/productos');
    };

    if (items.length === 0) {
        return (
            <div className="container mt-5 mb-5">
                <div className="text-center py-5">
                    <div className="card shadow-lg border-0 p-5">
                        <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                        <h2 className="text-dark mb-3">Tu carrito está vacío</h2>
                        <p className="text-muted mb-4">¡Agrega algunos productos increíbles a tu carrito!</p>
                        <Link to="/productos" className="btn btn-primary btn-lg">
                            <i className="bi bi-shop me-2"></i>
                            Ir a la tienda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            <h1 className="fw-bold mb-4 text-white">
                <i className="bi bi-cart3 me-2"></i>
                Mi Carrito ({getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'})
            </h1>

            <div className="row">
                {/* Lista de productos */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            {items.map((item) => (
                                <div key={item.product_id} className="border-bottom p-3">
                                    <div className="row align-items-center">
                                        {/* Imagen */}
                                        <div className="col-md-2 col-3 mb-3 mb-md-0">
                                            <img
                                                src={getImageUrl(item.image_front, item.licence, item.product_name)}
                                                alt={item.product_name}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '100px', objectFit: 'cover' }}
                                                onError={(e: any) => e.target.src = '/multimedia/funkos-banner.webp'}
                                            />
                                        </div>

                                        {/* Info del producto */}
                                        <div className="col-md-4 col-9 mb-3 mb-md-0">
                                            <h6 className="mb-1 fw-bold text-dark">{item.product_name}</h6>
                                            <p className="mb-0 small text-muted">SKU: {item.sku}</p>
                                            <p className="mb-0 text-primary fw-bold">${item.price}</p>
                                        </div>

                                        {/* Controles de cantidad */}
                                        <div className="col-md-3 col-6 mb-3 mb-md-0">
                                            <div className="input-group" style={{ maxWidth: '130px' }}>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value) || 1;
                                                        updateQuantity(item.product_id, value);
                                                    }}
                                                    min="1"
                                                    max={item.stock}
                                                />
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <small className="text-muted">Stock: {item.stock}</small>
                                        </div>

                                        {/* Subtotal y eliminar */}
                                        <div className="col-md-3 col-6 text-md-end">
                                            <p className="mb-2 fw-bold text-dark">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFromCart(item.product_id)}
                                            >
                                                <i className="bi bi-trash"></i> Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botón para vaciar carrito */}
                    <div className="mt-3">
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                                if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                                    clearCart();
                                }
                            }}
                        >
                            <i className="bi bi-trash me-2"></i>
                            Vaciar carrito
                        </button>
                    </div>
                </div>

                {/* Resumen del pedido */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
                        <div className="card-body">
                            <h5 className="card-title fw-bold mb-4 text-dark">Resumen del Pedido</h5>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal:</span>
                                <span className="fw-semibold text-dark">${getCartTotal().toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Envío:</span>
                                <span className="text-success fw-semibold">Gratis</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold text-dark">Total:</span>
                                <span className="fw-bold text-primary fs-4">${getCartTotal().toFixed(2)}</span>
                            </div>

                            <button
                                className="btn btn-primary w-100 btn-lg mb-2"
                                onClick={handleCheckout}
                            >
                                <i className="bi bi-credit-card me-2"></i>
                                Proceder al Pago
                            </button>

                            <Link to="/productos" className="btn btn-outline-secondary w-100">
                                <i className="bi bi-arrow-left me-2"></i>
                                Seguir Comprando
                            </Link>

                            <div className="mt-4 p-3 bg-light rounded">
                                <p className="small mb-2 text-dark">
                                    <i className="bi bi-shield-check text-success me-2"></i>
                                    Compra 100% segura
                                </p>
                                <p className="small mb-0 text-dark">
                                    <i className="bi bi-truck text-primary me-2"></i>
                                    Envío gratis en compras mayores a $50
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
