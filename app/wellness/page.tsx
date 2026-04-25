"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
    Heart,
    Droplet,
    Brain,
    Activity,
    Moon,
    Sun,
    Apple,
    Dumbbell,
    Search,
    Filter,
    ShoppingCart,
    Star,
    Clock,
    Shield,
    Truck,
    Leaf,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Wellness categories
const WELLNESS_CATEGORIES = [
    { id: "all", name: "All Products", icon: Sparkles, color: "bg-purple-100 text-purple-600" },
    { id: "vitamins", name: "Vitamins & Supplements", icon: Droplet, color: "bg-blue-100 text-blue-600" },
    { id: "mental", name: "Mental Wellness", icon: Brain, color: "bg-indigo-100 text-indigo-600" },
    { id: "sleep", name: "Sleep Support", icon: Moon, color: "bg-slate-100 text-slate-600" },
    { id: "immunity", name: "Immune Health", icon: Shield, color: "bg-green-100 text-green-600" },
    { id: "fitness", name: "Fitness & Energy", icon: Dumbbell, color: "bg-orange-100 text-orange-600" },
    { id: "digestion", name: "Digestive Health", icon: Apple, color: "bg-emerald-100 text-emerald-600" },
    { id: "skincare", name: "Skincare", icon: Sun, color: "bg-pink-100 text-pink-600" }
];

export default function WellnessPage() {
    const supabase = createClient();
    const { addToCart } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        fetchWellnessProducts();
    }, []);

    const fetchWellnessProducts = async () => {
        try {
            setLoading(true);
            // Fetch wellness products (category not in medications or specific wellness categories)
            const { data, error } = await supabase
                .from("medications")
                .select("*")
                .in("category", ["Vitamins", "Wellness", "Supplements", "Personal Care"])
                .order("name", { ascending: true });

            if (error) {
                console.error("Error fetching wellness products:", error);
                // Fallback to demo data
                setProducts(getDemoWellnessProducts());
                setFilteredProducts(getDemoWellnessProducts());
            } else {
                setProducts(data || []);
                setFilteredProducts(data || []);
            }
        } catch (error) {
            console.error("Error:", error);
            setProducts(getDemoWellnessProducts());
            setFilteredProducts(getDemoWellnessProducts());
        } finally {
            setLoading(false);
        }
    };

    // Demo wellness products for fallback
    const getDemoWellnessProducts = () => {
        return [
            {
                id: "wellness-1",
                name: "Vitamin D3 1000 IU",
                description: "Supports bone health and immune function",
                price: 24.99,
                category: "Vitamins",
                image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
                rating: 4.8,
                reviews: 234,
                in_stock: true,
                benefits: ["Immune Support", "Bone Health", "Mood Support"]
            },
            {
                id: "wellness-2",
                name: "Omega-3 Fish Oil",
                description: "Heart and brain health support",
                price: 34.99,
                category: "Supplements",
                image_url: "https://images.unsplash.com/photo-1579869847556-8f8a46c6c34f?w=400",
                rating: 4.9,
                reviews: 567,
                in_stock: true,
                benefits: ["Heart Health", "Brain Function", "Joint Support"]
            },
            {
                id: "wellness-3",
                name: "Magnesium Glycinate",
                description: "Promotes relaxation and quality sleep",
                price: 29.99,
                category: "Wellness",
                image_url: "https://images.unsplash.com/photo-1576675466969-38eeae4b41f6?w=400",
                rating: 4.7,
                reviews: 189,
                in_stock: true,
                benefits: ["Sleep Support", "Muscle Relaxation", "Stress Relief"]
            },
            {
                id: "wellness-4",
                name: "Probiotic 50 Billion CFU",
                description: "Digestive and immune health",
                price: 39.99,
                category: "Supplements",
                image_url: "https://images.unsplash.com/photo-1616671276441-2f2c2a21a6c2?w=400",
                rating: 4.8,
                reviews: 312,
                in_stock: true,
                benefits: ["Digestive Health", "Immune Support", "Gut Balance"]
            },
            {
                id: "wellness-5",
                name: "Ashwagandha Root",
                description: "Adaptogen for stress management",
                price: 27.99,
                category: "Wellness",
                image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400",
                rating: 4.6,
                reviews: 178,
                in_stock: true,
                benefits: ["Stress Relief", "Energy Boost", "Mental Clarity"]
            },
            {
                id: "wellness-6",
                name: "Collagen Peptides",
                description: "Skin, hair, and joint support",
                price: 44.99,
                category: "Skincare",
                image_url: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=400",
                rating: 4.9,
                reviews: 445,
                in_stock: true,
                benefits: ["Skin Health", "Joint Support", "Hair Growth"]
            }
        ];
    };

    // Filter and sort products
    useEffect(() => {
        let filtered = [...products];

        if (selectedCategory !== "all") {
            filtered = filtered.filter(p =>
                p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
                p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortBy === "price-low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, searchTerm, sortBy, products]);

    const handleAddToCart = (product: any) => {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            requiresPrescription: false,
            quantity: 1
        };
        addToCart(cartItem);
        alert(`${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-zinc-600">Loading wellness products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
                <div className="max-w-7xl mx-auto px-6 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-bold mb-6">
                            <Sparkles size={16} />
                            Holistic Wellness
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-950 mb-6">
                            Nurture Your
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Well-being</span>
                        </h1>
                        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                            Discover premium wellness products designed to support your journey to optimal health.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search and Filter Bar */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-zinc-100 py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search wellness products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-purple-500"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Categories Navigation */}
            <div className="sticky top-[73px] bg-white/60 backdrop-blur-md z-30 py-4 border-b border-zinc-100">
                <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
                    <div className="flex gap-3">
                        {WELLNESS_CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === category.id
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                                        : "bg-white text-zinc-600 hover:bg-purple-50 border border-zinc-200"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="text-sm font-medium">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart size={64} className="mx-auto text-zinc-300 mb-4" />
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                        <p className="text-zinc-500">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                                    <img
                                        src={product.image_url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {product.rating && (
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-xs font-bold">{product.rating}</span>
                                            <span className="text-xs text-zinc-500">({product.reviews})</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-purple-600 hover:text-white"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                            {product.category}
                                        </span>
                                        {product.in_stock && (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <Shield size={10} /> In Stock
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-lg text-zinc-900 mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {product.benefits && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {product.benefits.slice(0, 2).map((benefit: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-black text-zinc-900">${product.price}</span>
                                            {product.old_price && (
                                                <span className="text-sm text-zinc-400 line-through ml-2">${product.old_price}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Wellness Tips Banner */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Daily Wellness Tips</h2>
                    <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                        Small habits lead to big changes. Here are some tips to enhance your wellness journey.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <Droplet size={32} className="mx-auto mb-3" />
                            <h3 className="font-bold mb-2">Stay Hydrated</h3>
                            <p className="text-sm text-purple-100">Drink 8 glasses of water daily for optimal health</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <Moon size={32} className="mx-auto mb-3" />
                            <h3 className="font-bold mb-2">Quality Sleep</h3>
                            <p className="text-sm text-purple-100">Aim for 7-9 hours of restorative sleep each night</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                            <Activity size={32} className="mx-auto mb-3" />
                            <h3 className="font-bold mb-2">Move Daily</h3>
                            <p className="text-sm text-purple-100">30 minutes of movement keeps your body energized</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}