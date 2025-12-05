/**
 * Contexto del Carrito de Compras - Gestión global del carrito.
 * 
 * Este contexto proporciona acceso global al carrito de compras en toda la aplicación.
 * Maneja la persistencia del carrito en localStorage y todas las operaciones del carrito.
 * 
 * Características:
 * - Persistencia en localStorage (el carrito se mantiene al recargar la página)
 * - Agregar productos al carrito
 * - Actualizar cantidades
 * - Eliminar productos
 * - Calcular totales y contadores
 * - Sincronización con el navbar mediante eventos personalizados
 */

// Importar React y hooks necesarios
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Importar la interfaz Product del contexto de productos
import { Product } from './ProductContext';

/**
 * Interfaz que extiende Product para representar un item en el carrito.
 * 
 * Un CartItem es un Product con una cantidad asociada (cuántas unidades del producto
 * están en el carrito).
 */
interface CartItem extends Product {
    quantity: number;  // Cantidad de este producto en el carrito
}

/**
 * Interfaz que define el tipo del contexto del carrito.
 * 
 * Contiene el estado del carrito y todas las funciones para manipularlo.
 */
interface CartContextType {
    items: CartItem[];  // Lista de items en el carrito
    addToCart: (product: Product, quantity?: number) => void;  // Agregar producto al carrito
    removeFromCart: (productId: number) => void;  // Eliminar producto del carrito
    updateQuantity: (productId: number, quantity: number) => void;  // Actualizar cantidad de un producto
    clearCart: () => void;  // Vaciar todo el carrito
    getCartTotal: () => number;  // Calcular el total del carrito (precio * cantidad)
    getCartCount: () => number;  // Contar el total de items en el carrito
}

// Crear el contexto de React para el carrito
// Se inicializa como undefined porque el Provider asignará el valor
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Hook personalizado para usar el contexto del carrito.
 * 
 * Este hook facilita el acceso al contexto y valida que se use dentro de un CartProvider.
 * 
 * @returns {CartContextType} El contexto del carrito con estado y funciones
 * @throws {Error} Si se usa fuera de un CartProvider
 */
export const useCart = () => {
    // Obtener el contexto actual
    const context = useContext(CartContext);
    
    // Validar que el contexto existe (que estamos dentro de un CartProvider)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    
    return context;
};

/**
 * Props del componente CartProvider.
 */
interface CartProviderProps {
    children: ReactNode;  // Componentes hijos que tendrán acceso al contexto
}

/**
 * Provider del contexto del carrito.
 * 
 * Este componente envuelve la aplicación y proporciona acceso global al carrito de compras.
 * Se debe usar en el nivel superior de la aplicación (normalmente en App.tsx).
 * 
 * Características:
 * - Persistencia automática en localStorage
 * - Sincronización con el navbar mediante eventos
 * - Validación de stock al agregar productos
 * 
 * @param {CartProviderProps} props - Props del provider
 * @returns {JSX.Element} Provider con el contexto del carrito
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    // Estado para almacenar los items del carrito
    const [items, setItems] = useState<CartItem[]>([]);

    // Efecto para cargar el carrito desde localStorage al iniciar la aplicación
    // Esto permite que el carrito persista entre recargas de página
    useEffect(() => {
        // Obtener el carrito guardado del localStorage
        const savedCart = localStorage.getItem('cart');
        
        if (savedCart) {
            try {
                // Parsear el JSON guardado y restaurar el estado del carrito
                setItems(JSON.parse(savedCart));
            } catch (error) {
                // Si hay error al parsear (JSON inválido), registrar error y continuar con carrito vacío
                console.error('Error loading cart:', error);
            }
        }
    }, []);  // Array vacío = solo se ejecuta una vez al montar

    // Efecto para guardar el carrito en localStorage cada vez que cambie
    // Esto asegura que el carrito siempre esté sincronizado con el almacenamiento local
    useEffect(() => {
        // Guardar el carrito actual en localStorage como JSON string
        localStorage.setItem('cart', JSON.stringify(items));
        
        // Disparar evento personalizado para actualizar el contador en el navbar
        // Esto permite que el navbar se actualice automáticamente cuando cambia el carrito
        window.dispatchEvent(new Event('cartUpdated'));
    }, [items]);  // Se ejecuta cada vez que items cambia

    /**
     * Agrega un producto al carrito.
     * 
     * Si el producto ya está en el carrito, incrementa la cantidad.
     * Si no está, lo agrega como nuevo item.
     * La cantidad no puede exceder el stock disponible.
     * 
     * @param {Product} product - Producto a agregar al carrito
     * @param {number} quantity - Cantidad a agregar (por defecto 1)
     */
    const addToCart = (product: Product, quantity: number = 1) => {
        setItems(currentItems => {
            // Buscar si el producto ya está en el carrito
            const existingItem = currentItems.find(item => item.product_id === product.product_id);

            if (existingItem) {
                // Si ya existe, actualizar la cantidad sumando la nueva cantidad
                // Math.min asegura que no se exceda el stock disponible
                return currentItems.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                        : item
                );
            } else {
                // Si no existe, agregar como nuevo item al carrito
                // Math.min asegura que la cantidad inicial no exceda el stock
                return [...currentItems, { ...product, quantity: Math.min(quantity, product.stock) }];
            }
        });
    };

    /**
     * Elimina un producto del carrito.
     * 
     * @param {number} productId - ID del producto a eliminar
     */
    const removeFromCart = (productId: number) => {
        // Filtrar el carrito para excluir el producto con el ID especificado
        setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
    };

    /**
     * Actualiza la cantidad de un producto en el carrito.
     * 
     * Si la cantidad es 0 o menor, elimina el producto del carrito.
     * La cantidad no puede exceder el stock disponible.
     * 
     * @param {number} productId - ID del producto a actualizar
     * @param {number} quantity - Nueva cantidad (debe ser > 0)
     */
    const updateQuantity = (productId: number, quantity: number) => {
        // Si la cantidad es 0 o menor, eliminar el producto del carrito
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Actualizar la cantidad del producto especificado
        // Math.min asegura que no se exceda el stock disponible
        setItems(currentItems =>
            currentItems.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        );
    };

    /**
     * Vacía completamente el carrito.
     * 
     * Elimina todos los productos del carrito.
     */
    const clearCart = () => {
        // Establecer el carrito como array vacío
        setItems([]);
    };

    /**
     * Calcula el total del carrito.
     * 
     * Suma el precio de cada producto multiplicado por su cantidad.
     * 
     * @returns {number} Total del carrito en pesos/dólares
     */
    const getCartTotal = () => {
        // Usar reduce para sumar: precio * cantidad de cada item
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    /**
     * Cuenta el total de items en el carrito.
     * 
     * Suma las cantidades de todos los productos (no cuenta productos únicos,
     * sino unidades totales).
     * 
     * @returns {number} Total de unidades en el carrito
     */
    const getCartCount = () => {
        // Usar reduce para sumar las cantidades de todos los items
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
