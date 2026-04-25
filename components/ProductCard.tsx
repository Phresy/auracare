"use client";

import { useCart } from "@/context/CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";

// 1. Ensure 'default' is present in the function signature
export default function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="group relative bg-white border border-zinc-100 rounded-[2rem] p-4 transition-all duration-500 hover:shadow-premium hover:-translate-y-1">
            {/* Product Image Area */}
            <div className="aspect-[4/5] rounded-[1.5rem] bg-zinc-50 overflow-hidden relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Prescription Badge */}
                {product.rx && (
                    <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                        Rx Required
                    </div>
                )}

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-zinc-950 transition-all duration-300 hover:bg-brand hover:text-white active:scale-90"
                >
                    {added ? <Check size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {/* Content */}
            <div className="mt-6 px-2 pb-2">
                <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-zinc-950 leading-tight group-hover:text-brand transition-colors">
                    {product.name}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-zinc-950">${product.price}</span>
                    <span className="text-xs font-medium text-zinc-400">Incl. VAT</span>
                </div>
            </div>
        </div>
    );
}