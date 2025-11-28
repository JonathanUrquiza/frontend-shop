import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    sku: string;
    image_front?: string;
    description?: string;
    licence?: string;
}

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'product_id'>) => void;
    updateProduct: (id: number, product: Omit<Product, 'product_id'>) => void;
    deleteProduct: (id: number) => void;
    getProduct: (id: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

interface ProductProviderProps {
    children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const mockProducts: Product[] = [
                // ========== STAR WARS ==========
                {
                    product_id: 1,
                    product_name: "Baby Yoda",
                    price: 15000,
                    stock: 5,
                    sku: "FNK-SW-01",
                    image_front: "star-wars/baby-yoda-1.webp",
                    description: "Figura coleccionable de Baby Yoda (The Mandalorian)",
                    licence: "Star Wars"
                },
                {
                    product_id: 2,
                    product_name: "Boba Fett",
                    price: 15000,
                    stock: 3,
                    sku: "FNK-SW-02",
                    image_front: "star-wars/bobbafeth-1.webp",
                    description: "Figura coleccionable de Boba Fett",
                    licence: "Star Wars"
                },
                {
                    product_id: 3,
                    product_name: "Luke Skywalker",
                    price: 15000,
                    stock: 4,
                    sku: "FNK-SW-03",
                    image_front: "star-wars/luke-1.webp",
                    description: "Figura coleccionable de Luke Skywalker",
                    licence: "Star Wars"
                },
                {
                    product_id: 4,
                    product_name: "Stormtrooper",
                    price: 15000,
                    stock: 6,
                    sku: "FNK-SW-04",
                    image_front: "star-wars/trooper-1.webp",
                    description: "Figura coleccionable de Stormtrooper",
                    licence: "Star Wars"
                },

                // ========== POKÉMON ==========
                {
                    product_id: 5,
                    product_name: "Charmander",
                    price: 13000,
                    stock: 8,
                    sku: "FNK-PK-01",
                    image_front: "pokemon/charmander-1.webp",
                    description: "Figura coleccionable de Charmander",
                    licence: "Pokemon"
                },
                {
                    product_id: 6,
                    product_name: "Dragonite",
                    price: 14000,
                    stock: 4,
                    sku: "FNK-PK-02",
                    image_front: "pokemon/dragonite-1.webp",
                    description: "Figura coleccionable de Dragonite",
                    licence: "Pokemon"
                },
                {
                    product_id: 7,
                    product_name: "Pidgeotto",
                    price: 12500,
                    stock: 6,
                    sku: "FNK-PK-03",
                    image_front: "pokemon/pidgeotto-1.webp",
                    description: "Figura coleccionable de Pidgeotto",
                    licence: "Pokemon"
                },
                {
                    product_id: 8,
                    product_name: "Pikachu",
                    price: 15000,
                    stock: 10,
                    sku: "FNK-PK-04",
                    image_front: "pokemon/pikachu-1.webp",
                    description: "Figura coleccionable de Pikachu",
                    licence: "Pokemon"
                },
                {
                    product_id: 9,
                    product_name: "Vulpix",
                    price: 13000,
                    stock: 7,
                    sku: "FNK-PK-05",
                    image_front: "pokemon/vulpix-1.webp",
                    description: "Figura coleccionable de Vulpix",
                    licence: "Pokemon"
                },

                // ========== NARUTO ==========
                {
                    product_id: 10,
                    product_name: "Kakashi",
                    price: 15000,
                    stock: 5,
                    sku: "FNK-NA-01",
                    image_front: "naruto/kakashi-1.png",  // ✅ CORREGIDO: .webp → .png
                    description: "Figura coleccionable de Kakashi Hatake",
                    licence: "Naruto"
                },

                // ========== HARRY POTTER ==========
                {
                    product_id: 11,
                    product_name: "Harry Potter",
                    price: 16000,
                    stock: 8,
                    sku: "FNK-HP-01",
                    image_front: "harry-potter/harry-1.webp",
                    description: "Figura coleccionable de Harry Potter",
                    licence: "Harry Potter"
                },
                {
                    product_id: 12,
                    product_name: "Hermione Granger",
                    price: 16000,
                    stock: 6,
                    sku: "FNK-HP-02",
                    image_front: "harry-potter/hermione-1.webp",
                    description: "Figura coleccionable de Hermione Granger",
                    licence: "Harry Potter"
                },
                {
                    product_id: 13,
                    product_name: "Luna Lovegood",
                    price: 15500,
                    stock: 4,
                    sku: "FNK-HP-03",
                    image_front: "harry-potter/luna-1.webp",
                    description: "Figura coleccionable de Luna Lovegood",
                    licence: "Harry Potter"
                },
                {
                    product_id: 14,
                    product_name: "Severus Snape",
                    price: 16500,
                    stock: 3,
                    sku: "FNK-HP-04",
                    image_front: "harry-potter/snape-patronus-1.webp",
                    description: "Figura coleccionable de Severus Snape",
                    licence: "Harry Potter"
                }
            ];

            setProducts(mockProducts);
            setError(null);
        } catch (err) {
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = (product: Omit<Product, 'product_id'>) => {
        const newId = Math.max(...products.map(p => p.product_id), 0) + 1;
        const newProduct: Product = {
            ...product,
            product_id: newId
        };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id: number, updatedProduct: Omit<Product, 'product_id'>) => {
        setProducts(products.map(p =>
            p.product_id === id ? { ...updatedProduct, product_id: id } : p
        ));
    };

    const deleteProduct = (id: number) => {
        setProducts(products.filter(p => p.product_id !== id));
    };

    const getProduct = (id: number) => {
        return products.find(p => p.product_id === id);
    };

    const value: ProductContextType = {
        products,
        loading,
        error,
        refreshProducts: fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};