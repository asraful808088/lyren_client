'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    FC,
    ReactNode,
} from 'react';

import { Product } from '../data/products';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void; // Add this
    updateQuantity: (id: number, quantity: number) => void; // Optional but useful
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

interface CartStorage {
    data: CartItem[];
    expiry: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'lyren_cart';
const SIX_HOURS = 6 * 60 * 60 * 1000;

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                const parsed: CartStorage = JSON.parse(stored);

                // Check expiration
                if (parsed.expiry > Date.now()) {
                    setCart(parsed.data);
                } else {
                    // Expired
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch (error) {
                console.error('Failed to parse cart:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        setIsLoaded(true);
    }, []);

    // Save cart with new 6-hour expiry
    useEffect(() => {
        if (!isLoaded) return;

        const cartStorage: CartStorage = {
            data: cart,
            expiry: Date.now() + SIX_HOURS,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartStorage));
    }, [cart, isLoaded]);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });

        setIsOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    // Add clearCart function
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    // Add updateQuantity function (useful for cart management)
    const updateQuantity = (id: number, quantity: number) => {
        setCart((prev) => {
            if (quantity <= 0) {
                return prev.filter((item) => item.id !== id);
            }
            return prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            );
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart, // Add this
                updateQuantity, // Add this
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};