import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, Product } from '../context/ProductContext';

// Función auxiliar para obtener el nombre de la licencia como string
const getLicenceName = (licence?: string | { licence_id: number; licence_name: string }): string => {
    if (!licence) return 'FUNKO';
    if (typeof licence === 'string') return licence;
    return licence.licence_name;
};

// Función auxiliar para convertir imagen a -box (para mostrar en card)
const getBoxImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/multimedia/funkos-banner.webp';
    if (imagePath.endsWith('-1.webp')) {
        return imagePath.replace(/-1\.webp$/, '-box.webp');
    }
    if (imagePath.endsWith('-box.webp')) {
        return imagePath;
    }
    return imagePath.replace(/\.webp$/, '-box.webp');
};

// Función auxiliar para convertir imagen a -1 (para hover)
const getHoverImageUrl = (imagePath: string): string => {
    if (!imagePath) return '/multimedia/funkos-banner.webp';
    if (imagePath.endsWith('-box.webp')) {
        return imagePath.replace(/-box\.webp$/, '-1.webp');
    }
    if (imagePath.endsWith('-1.webp')) {
        return imagePath;
    }
    return imagePath.replace(/\.webp$/, '-1.webp');
};

// Función auxiliar para obtener la imagen box (por defecto en cards)
const getImageUrl = (prod: Product) => {
    if (prod.image_front && prod.image_front.trim() !== '') {
        let imagePath = prod.image_front.trim();
        
        if (imagePath.startsWith('/multimedia/')) {
            // Ya está completa
        }
        else if (imagePath.startsWith('/')) {
            imagePath = `/multimedia${imagePath}`;
        }
        else if (imagePath.startsWith('multimedia/')) {
            imagePath = `/${imagePath}`;
        }
        else {
            imagePath = `/multimedia/${imagePath}`;
        }
        
        return getBoxImageUrl(imagePath);
    }
    return '/multimedia/funkos-banner.webp';
};

// Función auxiliar para obtener la imagen hover (-1)
const getHoverImage = (prod: Product) => {
    if (prod.image_front && prod.image_front.trim() !== '') {
        let imagePath = prod.image_front.trim();
        
        if (imagePath.startsWith('/multimedia/')) {
            // Ya está completa
        }
        else if (imagePath.startsWith('/')) {
            imagePath = `/multimedia${imagePath}`;
        }
        else if (imagePath.startsWith('multimedia/')) {
            imagePath = `/${imagePath}`;
        }
        else {
            imagePath = `/multimedia/${imagePath}`;
        }
        
        return getHoverImageUrl(imagePath);
    }
    return '/multimedia/funkos-banner.webp';
};

// Datos de colecciones
const collections = [
    {
        name: 'Pokemon',
        description: 'Atrapa todos los que puedas y disfruta de una colección llena de amigos.',
        image: '/multimedia/img/pokemon/pk-cover.webp',
        link: '/productos?licencia=Pokemon'
    },
    {
        name: 'Star Wars',
        description: 'Disfruta de una saga que sigue agregando personajes a tu colección.',
        image: '/multimedia/img/star-wars/st-cover.webp',
        link: '/productos?licencia=Star Wars'
    },
    {
        name: 'Harry Potter',
        description: 'Revive los recuerdos de una saga llena de magia y encanto.',
        image: '/multimedia/img/harry-potter/hp-cover.webp',
        link: '/productos?licencia=Harry Potter'
    },
    {
        name: 'Naruto',
        description: 'Únete a la batalla contra Madara coleccionando los funko de Naruto Shippuden.',
        image: '/multimedia/img/naruto/nt-cover.webp',
        link: '/productos?licencia=Naruto'
    }
];

const Home: React.FC = () => {
    const { products } = useProducts();
    const [sliderIndex, setSliderIndex] = useState(0);

    // Obtener productos nuevos para el slider (últimos 9 productos, máximo 9)
    const newProducts = products.length > 0 ? products.slice(-Math.min(9, products.length)) : [];
    
    // Calcular máximo de slides (mostramos 3 a la vez)
    const maxSlides = Math.max(0, newProducts.length - 3);

    const nextSlide = () => {
        if (maxSlides > 0) {
            setSliderIndex((prev) => (prev + 1) % (maxSlides + 1));
        }
    };

    const prevSlide = () => {
        if (maxSlides > 0) {
            setSliderIndex((prev) => (prev - 1 + maxSlides + 1) % (maxSlides + 1));
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section - Nuevos Ingresos */}
            <section 
                className="hero text-center px-4 py-5"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/multimedia/funkos-banner.webp)`,
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover'
                }}
            >
                <article className="container hero__content">
                    <h3 className="hero__title">Nuevos Ingresos</h3>
                    <div className="hero__info">
                        <p className="hero__text lead">Descubrí el próximo Funko Pop de tu colección</p>
                        <Link to="/productos" className="hero__link btn">
                            SHOP
                        </Link>
                    </div>
                </article>
            </section>

            {/* Collections Section */}
            <main className="main-container">
                {collections.map((collection, index) => (
                    <section key={collection.name} className="collection container">
                        <article className="collection__content">
                            <h3 className="collection__title">{collection.name}</h3>
                            <p className="collection__text">{collection.description}</p>
                            <Link to={collection.link} className="collection__link">
                                VER COLECCIÓN
                            </Link>
                        </article>
                        <picture className="collection__cover">
                            <img src={collection.image} alt={`Colección ${collection.name}`} />
                        </picture>
                    </section>
                ))}

                {/* Slider Section */}
                {newProducts.length > 0 && (
                    <section className="slider container">
                        <div className="slider__track" style={{ position: 'relative', overflow: 'hidden' }}>
                            <ul className="slider__items" style={{ 
                                display: 'flex', 
                                gap: 'var(--spacing-20)',
                                transform: `translateX(-${sliderIndex * 33.333}%)`,
                                transition: 'transform 0.5s ease-in-out',
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {newProducts.map((prod) => {
                                    const boxImage = getImageUrl(prod);
                                    const hoverImage = getHoverImage(prod);
                                    
                                    return (
                                        <li key={prod.product_id} className="slider__item" style={{ minWidth: '33.333%', flexShrink: 0 }}>
                                            <article className="card-item">
                                                <Link to={`/productos/${prod.product_id}`} className="card-item__link"></Link>
                                                <picture className="card-item__cover">
                                                    <span className="card-item__tag">NUEVO</span>
                                                    <img 
                                                        className="card-item__img--front" 
                                                        src={boxImage}
                                                        alt={prod.product_name}
                                                        onError={(e: any) => e.target.src = '/multimedia/funkos-banner.webp'}
                                                    />
                                                    <img 
                                                        className="card-item__img--back" 
                                                        src={hoverImage}
                                                        alt={`${prod.product_name} en caja`}
                                                        onError={(e: any) => e.target.src = '/multimedia/funkos-banner.webp'}
                                                    />
                                                </picture>
                                                <div className="card-item__content">
                                                    <p className="card-item__licence">{getLicenceName(prod.licence)}</p>
                                                    <h4 className="card-item__name">{prod.product_name}</h4>
                                                    <p className="card-item__price">${prod.price.toFixed(2).replace('.', ',')}</p>
                                                    <p className="card-item__promo">3 CUOTAS SIN INTERÉS</p>
                                                </div>
                                            </article>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        {newProducts.length > 3 && (
                            <div className="slider__arrows" style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: 'var(--spacing-20)',
                                marginTop: 'var(--spacing-36)'
                            }}>
                                <button 
                                    className="slider__arrow slider__arrow--left" 
                                    onClick={prevSlide}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 'var(--font-large)',
                                        color: 'var(--dark-bg-solid)',
                                        fontWeight: '700'
                                    }}
                                >
                                    ←
                                </button>
                                <button 
                                    className="slider__arrow slider__arrow--right" 
                                    onClick={nextSlide}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: 'var(--font-large)',
                                        color: 'var(--dark-bg-solid)',
                                        fontWeight: '700'
                                    }}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;
