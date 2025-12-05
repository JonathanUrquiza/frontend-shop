/**
 * Contexto de Productos - Gestión global del estado de productos.
 * 
 * Este contexto proporciona acceso global a la lista de productos en toda la aplicación.
 * Maneja la carga de productos desde el backend, normalización de datos y operaciones CRUD.
 * 
 * Características:
 * - Carga automática de productos al iniciar la aplicación
 * - Normalización de datos del backend al formato del frontend
 * - Operaciones CRUD (crear, leer, actualizar, eliminar productos)
 * - Manejo de estados de carga y errores
 */

// Importar React y hooks necesarios
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// URL del backend - usa variable de entorno REACT_APP_API_URL o fallback a localhost
// Permite cambiar la URL del backend sin modificar el código
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Interfaz que define la estructura de un Producto.
 * 
 * Representa un producto del catálogo con toda su información.
 * Algunos campos son opcionales porque pueden no estar presentes en todos los productos.
 */
export interface Product {
    product_id: number;  // ID único del producto
    product_name: string;  // Nombre del producto
    price: number;  // Precio del producto
    stock: number;  // Cantidad disponible en stock
    sku: string;  // SKU (código único) del producto
    image_front?: string;  // Ruta de la imagen frontal (opcional)
    image_back?: string;  // Ruta de la imagen reverso (opcional)
    description?: string;  // Descripción del producto (normalizada desde product_description)
    product_description?: string;  // Descripción del producto (formato del backend)
    licence?: string | { licence_id: number; licence_name: string };  // Licencia (puede ser string o objeto)
    category?: { category_id: number; category_name: string };  // Categoría del producto
    discount?: number;  // Descuento aplicado (opcional)
    dues?: number;  // Número de cuotas disponibles (opcional)
    [key: string]: any;  // Permitir campos adicionales del backend (flexibilidad)
}

/**
 * Interfaz que define el tipo del contexto de productos.
 * 
 * Contiene el estado y las funciones disponibles para los componentes que usen este contexto.
 */
interface ProductContextType {
    products: Product[];  // Lista de todos los productos cargados
    loading: boolean;  // Indica si se están cargando productos
    error: string | null;  // Mensaje de error si hay algún problema
    refreshProducts: () => Promise<void>;  // Función para recargar productos desde el backend
    addProduct: (product: Omit<Product, 'product_id'>) => Promise<void>;  // Crear un nuevo producto
    updateProduct: (id: number, product: Omit<Product, 'product_id'>) => Promise<void>;  // Actualizar un producto
    deleteProduct: (id: number) => Promise<void>;  // Eliminar un producto
    getProduct: (id: number) => Product | undefined;  // Obtener un producto por ID
}

// Crear el contexto de React para productos
// Se inicializa como undefined porque el Provider asignará el valor
const ProductContext = createContext<ProductContextType | undefined>(undefined);

/**
 * Hook personalizado para usar el contexto de productos.
 * 
 * Este hook facilita el acceso al contexto y valida que se use dentro de un ProductProvider.
 * 
 * @returns {ProductContextType} El contexto de productos con estado y funciones
 * @throws {Error} Si se usa fuera de un ProductProvider
 */
export const useProducts = () => {
    // Obtener el contexto actual
    const context = useContext(ProductContext);
    
    // Validar que el contexto existe (que estamos dentro de un ProductProvider)
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    
    return context;
};

/**
 * Props del componente ProductProvider.
 */
interface ProductProviderProps {
    children: ReactNode;  // Componentes hijos que tendrán acceso al contexto
}

/**
 * Provider del contexto de productos.
 * 
 * Este componente envuelve la aplicación y proporciona acceso global al estado de productos.
 * Se debe usar en el nivel superior de la aplicación (normalmente en App.tsx).
 * 
 * @param {ProductProviderProps} props - Props del provider
 * @returns {JSX.Element} Provider con el contexto de productos
 */
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
    // Estado para almacenar la lista de productos
    const [products, setProducts] = useState<Product[]>([]);
    
    // Estado para indicar si se están cargando productos
    const [loading, setLoading] = useState(true);
    
    // Estado para almacenar mensajes de error
    const [error, setError] = useState<string | null>(null);

    /**
     * Función para cargar productos desde el backend.
     * 
     * Esta función hace una petición GET al endpoint /product/list/ del backend,
     * normaliza los datos recibidos y actualiza el estado de productos.
     * 
     * Normalización realizada:
     * - Convierte product_description a description para consistencia
     * - Limpia valores vacíos de image_front
     * - Mantiene compatibilidad con diferentes formatos de datos del backend
     */
    const fetchProducts = async () => {
        try {
            // Activar estado de carga
            setLoading(true);
            
            // Hacer petición GET al backend para obtener todos los productos
            const response = await fetch(`${API_URL}/product/list/`);
            
            // Verificar que la respuesta sea exitosa (status 200-299)
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            // Parsear la respuesta JSON a array de productos
            const data: Product[] = await response.json();
            
            // Debug: ver qué está recibiendo del backend (solo en desarrollo)
            console.log('Productos recibidos del backend:', data);
            if (data.length > 0) {
                console.log('Primer producto ejemplo:', {
                    product_name: data[0].product_name,
                    image_front: data[0].image_front,
                    licence: data[0].licence
                });
            }
            
            // Normalizar el campo description (el backend usa product_description)
            // Esto asegura que siempre tengamos un campo 'description' consistente
            const normalizedProducts = data.map(product => ({
                ...product,  // Mantener todos los campos originales
                // Crear campo description desde product_description o usar el existente
                description: product.product_description || product.description || '',
                // Mantener image_front solo si tiene un valor válido (no vacío ni null)
                // Esto previene mostrar imágenes rotas en el frontend
                image_front: product.image_front && product.image_front.trim() !== '' 
                    ? product.image_front 
                    : undefined
            }));
            
            // Debug: mostrar primeros productos normalizados (solo en desarrollo)
            console.log('Productos normalizados:', normalizedProducts.slice(0, 3));
            
            // Actualizar estado con productos normalizados
            setProducts(normalizedProducts);
            // Limpiar cualquier error previo
            setError(null);
        } catch (err) {
            // Si hay error, registrar en consola y actualizar estado de error
            console.error('Error al cargar productos:', err);
            setError('Error al cargar productos. Verifica la conexión con el servidor.');
            // Establecer array vacío en caso de error para evitar errores en componentes
            setProducts([]);
        } finally {
            // Siempre desactivar estado de carga, sin importar el resultado
            setLoading(false);
        }
    };

    // Efecto que se ejecuta una vez al montar el componente
    // Carga los productos automáticamente cuando la aplicación inicia
    useEffect(() => {
        fetchProducts();
    }, []);  // Array vacío = solo se ejecuta una vez al montar

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