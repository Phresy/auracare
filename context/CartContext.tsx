"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number; // Changed to always be number
    image: string;
    requiresPrescription: boolean;
    quantity: number;
}

export interface CartContextValue {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: any) => {
        setCart((prev) => {
            const existingItem = prev.find(item => item.id === product.id);

            // Ensure price is a number
            const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }

            return [...prev, {
                id: product.id,
                name: product.name,
                price: price, // Store as number
                image: product.image || product.image_url || "/placeholder-image.jpg",
                requiresPrescription: product.requiresPrescription || product.rx || false,
                quantity: 1
            }];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const cartCount = useMemo(() => {
        return cart.reduce((count, item) => count + (item.quantity || 1), 0);
    }, [cart]);

    const totalPrice = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }, [cart]);

    const value = useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice
    }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}