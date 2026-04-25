"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Beaker,
    Microscope,
    Heart,
    Brain,
    Droplet,
    Activity,
    Syringe,
    Stethoscope,
    Search,
    Filter,
    Clock,
    Shield,
    Truck,
    Calendar,
    FileText,
    ChevronRight,
    Star,
    Wifi,
    Home,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

// Lab test categories
const LAB_CATEGORIES = [
    { id: "all", name: "All Tests", icon: Beaker },
    { id: "blood", name: "Blood Tests", icon: Droplet },
    { id: "cardiac", name: "Cardiac Health", icon: Heart },
    { id: "hormone", name: "Hormone Testing", icon: Activity },
    { id: "allergy", name: "Allergy Tests", icon: AlertCircle },
    { id: "wellness", name: "Wellness Panel", icon: Shield },
];

// Lab test packages
const labTests = [
    {
        id: "test-1",
        name: "Complete Blood Count (CBC)",
        description: "Comprehensive blood analysis for overall health assessment",
        price: 49,
        originalPrice: 89,
        category: "blood",
        preparation: "Fasting not required",
        turnaround: "24-48 hours",
        sampleType: "Blood",
        popular: true,
        parameters: ["RBC Count", "WBC Count", "Hemoglobin", "Platelets", "Hematocrit"],
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=400"
    },
    {
        id: "test-2",
        name: "Lipid Profile",
        description: "Measures cholesterol and triglycerides for heart health",
        price: 69,
        originalPrice: 119,
        category: "cardiac",
        preparation: "Fasting required (10-12 hours)",
        turnaround: "24-48 hours",
        sampleType: "Blood",
        popular: true,
        parameters: ["Total Cholesterol", "HDL", "LDL", "Triglycerides", "VLDL"],
        image: "https://images.unsplash.com/photo-1505751172876-fa5323c4350a?w=400"
    },
    {
        id: "test-3",
        name: "Thyroid Panel",
        description: "Complete thyroid function assessment",
        price: 79,
        originalPrice: 139,
        category: "hormone",
        preparation: "Fasting not required",
        turnaround: "24-48 hours",
        sampleType: "Blood",
        popular: false,
        parameters: ["TSH", "T3", "T4", "Free T3", "Free T4"],
        image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400"
    },
    {
        id: "test-4",
        name: "Diabetes Screening",
        description: "HbA1c and glucose tests for diabetes monitoring",
        price: 59,
        originalPrice: 99,
        category: "blood",
        preparation: "Fasting required (8 hours)",
        turnaround: "24 hours",
        sampleType: "Blood",
        popular: true,
        parameters: ["Fasting Glucose", "HbA1c", "Postprandial Glucose"],
        image: "https://images.unsplash.com/photo-1579154204601-0158f351e67f?w=400"
    },
    {
        id: "test-5",
        name: "Vitamin Deficiency Panel",
        description: "Checks levels of essential vitamins",
        price: 99,
        originalPrice: 179,
        category: "wellness",
        preparation: "Fasting required (8 hours)",
        turnaround: "48-72 hours",
        sampleType: "Blood",
        popular: true,
        parameters: ["Vitamin D", "Vitamin B12", "Folate", "Iron", "Magnesium"],
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400"
    },
    {
        id: "test-6",
        name: "Allergy Panel - Comprehensive",
        description: "Tests for common food and environmental allergies",
        price: 149,
        originalPrice: 249,
        category: "allergy",
        preparation: "No antihistamines 3 days prior",
        turnaround: "5-7 days",
        sampleType: "Blood",
        popular: false,
        parameters: ["Food Allergies", "Seasonal Allergies", "Pet Allergies", "Dust Mites"],
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400"
    },
    {
        id: "test-7",
        name: "Liver Function Test",
        description: "Evaluates liver health and function",
        price: 54,
        originalPrice: 94,
        category: "blood",
        preparation: "Fasting required (8 hours)",
        turnaround: "24-48 hours",
        sampleType: "Blood",
        popular: false,
        parameters: ["ALT", "AST", "ALP", "Bilirubin", "Protein"],
        image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=400"
    },
    {
        id: "test-8",
        name: "Kidney Function Test",
        description: "Assesses kidney health and filtration",
        price: 54,
        originalPrice: 94,
        category: "blood",
        preparation: "Fasting required (8 hours)",
        turnaround: "24-48 hours",
        sampleType: "Blood",
        popular: false,
        parameters: ["Creatinine", "BUN", "Uric Acid", "eGFR", "Electrolytes"],
        image: "https://images.unsplash.com/photo-1581092335871-4a6c9f7b7d9f?w=400"
    }
];

export default function LabTestsPage() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTest, setSelectedTest] = useState<any>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const filteredTests = labTests.filter(test => {
        const matchesCategory = selectedCategory === "all" || test.category === selectedCategory;
        const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleBookTest = (test: any) => {
        setSelectedTest(test);
        setShowBookingModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
                <div className="max-w-7xl mx-auto px-6 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-bold mb-6">
                            <Microscope size={16} />
                            Diagnostic Excellence
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-zinc-950 mb-6">
                            Lab Tests Made
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> Simple & Accessible</span>
                        </h1>
                        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                            Book lab tests from the comfort of your home. Professional phlebotomists, accurate results, and expert guidance.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3">
                            <Home size={20} className="text-blue-600" />
                            <span className="text-sm font-medium">Home Sample Collection</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-blue-600" />
                            <span className="text-sm font-medium">Reports in 24-48 Hours</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-blue-600" />
                            <span className="text-sm font-medium">NABL Accredited Labs</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Truck size={20} className="text-blue-600" />
                            <span className="text-sm font-medium">Free Home Collection</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-zinc-100 py-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search lab tests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {LAB_CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === cat.id
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                            : "bg-white text-zinc-600 hover:bg-blue-50 border border-zinc-200"
                                            }`}
                                    >
                                        <Icon size={16} />
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Lab Tests Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid gap-6">
                    {filteredTests.map((test, idx) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                                    <img
                                        src={test.image}
                                        alt={test.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {test.popular && (
                                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            Most Popular
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900 mb-2">{test.name}</h3>
                                            <p className="text-zinc-500 mb-3">{test.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-blue-600" />
                                                    <span className="text-zinc-600">{test.turnaround}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Droplet size={14} className="text-blue-600" />
                                                    <span className="text-zinc-600">{test.sampleType}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <AlertCircle size={14} className="text-blue-600" />
                                                    <span className="text-zinc-600">{test.preparation}</span>
                                                </div>
                                            </div>

                                            {/* Parameters */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {test.parameters.slice(0, 4).map((param, i) => (
                                                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                                                        {param}
                                                    </span>
                                                ))}
                                                {test.parameters.length > 4 && (
                                                    <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
                                                        +{test.parameters.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="mb-2">
                                                <span className="text-3xl font-black text-zinc-900">${test.price}</span>
                                                <span className="text-sm text-zinc-400 line-through ml-2">${test.originalPrice}</span>
                                            </div>
                                            <button
                                                onClick={() => handleBookTest(test)}
                                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            >
                                                Book Test
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us Section */}
            <section className="bg-gradient-to-r from-blue-900 to-cyan-900 py-16 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl font-bold mb-12">Why Choose Our Lab Services?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Microscope size={32} />
                            </div>
                            <h3 className="font-bold mb-2">Accurate Results</h3>
                            <p className="text-sm text-blue-200">NABL accredited labs with cutting-edge technology</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Home size={32} />
                            </div>
                            <h3 className="font-bold mb-2">Home Collection</h3>
                            <p className="text-sm text-blue-200">Free sample collection from your doorstep</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} />
                            </div>
                            <h3 className="font-bold mb-2">Digital Reports</h3>
                            <p className="text-sm text-blue-200">Instant access to your reports online</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Stethoscope size={32} />
                            </div>
                            <h3 className="font-bold mb-2">Doctor Consultation</h3>
                            <p className="text-sm text-blue-200">Free follow-up with our health experts</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Booking Modal */}
            {showBookingModal && selectedTest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-zinc-900">Book {selectedTest.name}</h2>
                                <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                                    ✕
                                </button>
                            </div>

                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Full Name" className="p-3 border rounded-xl" required />
                                    <input type="email" placeholder="Email" className="p-3 border rounded-xl" required />
                                    <input type="tel" placeholder="Phone Number" className="p-3 border rounded-xl" required />
                                    <input type="date" placeholder="Preferred Date" className="p-3 border rounded-xl" required />
                                </div>
                                <textarea placeholder="Address for sample collection" rows={3} className="w-full p-3 border rounded-xl" required />
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="font-bold mb-2">Test Summary</p>
                                    <div className="flex justify-between">
                                        <span>{selectedTest.name}</span>
                                        <span className="font-bold">${selectedTest.price}</span>
                                    </div>
                                    <div className="border-t mt-2 pt-2 flex justify-between">
                                        <span>Total</span>
                                        <span className="font-bold text-blue-600">${selectedTest.price}</span>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                                    Confirm Booking
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}