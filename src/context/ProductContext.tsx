import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// URL del backend - usa variable de entorno o fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export interface Product {
    product_id: number;
    product_name: string;
    price: number;
    stock: number;
    sku: string;
    image_front?: string;
    image_back?: string;
    description?: string;
    product_description?: string;
    licence?: string | { licence_id: number; licence_name: string };
    category?: { category_id: number; category_name: string };
    discount?: number;
    dues?: number;
    [key: string]: any; // Permitir campos adicionales del backend
}

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'product_id'>) => Promise<void>;
    updateProduct: (id: number, product: Omit<Product, 'product_id'>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
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
            
            const response = await fetch(`${API_URL}/product/list/`);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data: Product[] = await response.json();
            
            // Debug: ver qué está recibiendo del backend
            console.log('Productos recibidos del backend:', data);
            if (data.length > 0) {
                console.log('Primer producto ejemplo:', {
                    product_name: data[0].product_name,
                    image_front: data[0].image_front,
                    licence: data[0].licence
                });
            }
            
            // Normalizar el campo description (el backend usa product_description)
            const normalizedProducts = data.map(product => ({
                ...product,
                description: product.product_description || product.description || '',
                // Mantener image_front solo si tiene un valor válido (no vacío ni null)
                image_front: product.image_front && product.image_front.trim() !== '' 
                    ? product.image_front 
                    : undefined
            }));
            
            console.log('Productos normalizados:', normalizedProducts.slice(0, 3));
            
            setProducts(normalizedProducts);
            setError(null);
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('Error al cargar productos. Verifica la conexión con el servidor.');
            setProducts([]); // Array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addProduct = async (product: Omit<Product, 'product_id'> | any) => {
        try {
            // Preparar datos para el backend
            // El backend espera category_name y licence_name como strings
            const productData: any = {
                ...product,
                product_description: product.description || product.product_description || ''
            };

            // Asegurar que category_name y licence_name estén presentes
            if (product.category_name) {
                productData.category_name = product.category_name;
            }
            if (product.licence_name) {
                productData.licence_name = product.licence_name;
            }

            // Remover campos que no necesita el backend
            delete productData.description;
            delete productData.category;
            delete productData.licence;

            const response = await fetch(`${API_URL}/product/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            // Refrescar la lista de productos después de crear
            await fetchProducts();
        } catch (err) {
            console.error('Error al crear producto:', err);
            throw err;
        }
    };

    const updateProduct = async (id: number, updatedProduct: Omit<Product, 'product_id'> | any) => {
        try {
            // Preparar datos para el backend
            const productData: any = {
                ...updatedProduct,
                product_description: updatedProduct.description || updatedProduct.product_description || ''
            };

            // Asegurar que category_name y licence_name estén presentes si se proporcionan
            if (updatedProduct.category_name) {
                productData.category_name = updatedProduct.category_name;
            }
            if (updatedProduct.licence_name) {
                productData.licence_name = updatedProduct.licence_name;
            }

            // Remover campos que no necesita el backend
            delete productData.description;
            delete productData.category;
            delete productData.licence;

            const response = await fetch(`${API_URL}/product/update/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            // Refrescar la lista de productos después de actualizar
            await fetchProducts();
        } catch (err) {
            console.error('Error al actualizar producto:', err);
            throw err;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/product/delete/${id}/`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            // Refrescar la lista de productos después de eliminar
            await fetchProducts();
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            throw err;
        }
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