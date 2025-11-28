import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './ProductContext';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
        // Disparar evento para actualizar el contador en el navbar
        window.dispatchEvent(new Event('cartUpdated'));
    }, [items]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.product_id === product.product_id);

            if (existingItem) {
                // Si ya existe, actualizar cantidad
                return currentItems.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
                        : item
                );
            } else {
                // Si no existe, agregar nuevo item
                return [...currentItems, { ...product, quantity: Math.min(quantity, product.stock) }];
            }
        });
    };

    const removeFromCart = (productId: number) => {
        setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: Math.min(quantity, item.stock) }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getCartTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
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
