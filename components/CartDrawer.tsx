"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, cartCount, removeFromCart } = useCart();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    // Fixed: Ensure price is treated as a number
    const subtotal = cart.reduce((acc, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const quantity = item.quantity || 1;
        return acc + (price * quantity);
    }, 0);

    // Helper function to safely format price
    const formatPrice = (price: number | string): string => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                                    <ShoppingBag className="text-brand" size={18} />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-zinc-950">Your Bag ({cartCount})</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="text-zinc-200" size={40} />
                                    </div>
                                    <div>
                                        <p className="text-zinc-950 font-bold">Your bag is empty</p>
                                        <p className="text-zinc-500 text-sm mt-1">Looks like you haven't added any <br /> healthcare essentials yet.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={`${item.id}-${idx}`}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-20 h-24 bg-zinc-50 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100">
                                            <img
                                                src={item.image || "/placeholder-image.jpg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 py-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-zinc-900 leading-tight">{item.name}</h4>
                                                    {/* FIXED: Using formatPrice helper */}
                                                    <span className="font-bold text-sm text-zinc-950">
                                                        ${formatPrice(item.price)}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-brand font-bold mt-1 uppercase tracking-widest">In Stock</p>
                                                {item.quantity && item.quantity > 1 && (
                                                    <p className="text-xs text-zinc-500 mt-1">Quantity: {item.quantity}</p>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition-colors text-xs font-semibold w-fit"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-zinc-100 bg-white space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500 font-medium">Subtotal</span>
                                        {/* FIXED: Using formatPrice helper */}
                                        <span className="text-zinc-950 font-bold">${formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500 font-medium">Delivery</span>
                                        <span className="text-brand font-bold uppercase text-[10px] tracking-widest">Calculated at Checkout</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full bg-zinc-950 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand transition-all group shadow-xl shadow-zinc-950/10"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <p className="text-center text-[10px] text-zinc-400 mt-4 font-medium uppercase tracking-tighter">
                                        Secure 256-bit SSL Encrypted Checkout
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}