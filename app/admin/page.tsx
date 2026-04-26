"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    FileCheck,
    CheckCircle,
    Loader2,
    ShieldAlert,
    Package,
    Plus,
    X,
    Upload,
    Trash2,
    Edit,
    Search,
    Download,
    Upload as UploadIcon,
    Eye,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Save
} from "lucide-react";

export default function AdminPanel() {
    const supabase = createClient();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [medications, setMedications] = useState<any[]>([]);
    const [filteredMedications, setFilteredMedications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

    // Image upload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState(0);

    // Search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [prescriptionFilter, setPrescriptionFilter] = useState("all");
    const [orderStatusFilter, setOrderStatusFilter] = useState("all");

    // Form data
    const [newMed, setNewMed] = useState({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        requires_prescription: false,
        category: "General",
        image_url: ""
    });

    // Bulk upload data
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [bulkProducts, setBulkProducts] = useState<any[]>([]);
    const [bulkUploadProgress, setBulkUploadProgress] = useState(0);

    const MASTER_ADMIN = "obenggyanp@gmail.com";

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    router.push("/admin/login");
                    return;
                }

                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user || user.email !== MASTER_ADMIN) {
                    router.push("/admin/login");
                    return;
                }

                setIsAuthorized(true);
                await Promise.all([fetchOrders(), fetchMedications()]);
            } catch (error) {
                console.error("Check admin error:", error);
                router.push("/admin/login");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    const fetchOrders = async () => {
        const { data } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });
        setOrders(data || []);
    };

    const fetchMedications = async () => {
        const { data } = await supabase
            .from("medications")
            .select("*")
            .order("name", { ascending: true });
        setMedications(data || []);
        setFilteredMedications(data || []);
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        if (orderStatusFilter === "all") return true;
        return order.status === orderStatusFilter;
    });

    // Search and filter function
    useEffect(() => {
        let filtered = [...medications];

        if (searchTerm) {
            filtered = filtered.filter(med =>
                med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                med.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== "all") {
            filtered = filtered.filter(med => med.category === categoryFilter);
        }

        if (prescriptionFilter !== "all") {
            filtered = filtered.filter(med =>
                med.requires_prescription === (prescriptionFilter === "required")
            );
        }

        setFilteredMedications(filtered);
    }, [searchTerm, categoryFilter, prescriptionFilter, medications]);

    const categories = ["all", ...new Set(medications.map(med => med.category).filter(Boolean))];
    const statusOptions = ["pending", "verified", "shipped", "delivered", "cancelled"];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'verified': return 'bg-green-100 text-green-700 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={14} />;
            case 'verified': return <CheckCircle2 size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'delivered': return <CheckCircle size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return null;
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `medications/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size must be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert("Please select an image file");
                return;
            }
            setImageFile(file);
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
        }
    };

    const handleAddMedication = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            let imageUrl = "";

            if (imageFile) {
                setUploadProgress(30);
                const uploadedUrl = await uploadImage(imageFile);
                setUploadProgress(70);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            setUploadProgress(90);

            const { error } = await supabase
                .from("medications")
                .insert([{
                    name: newMed.name,
                    description: newMed.description,
                    price: parseFloat(newMed.price),
                    stock_quantity: parseInt(newMed.stock_quantity),
                    requires_prescription: newMed.requires_prescription,
                    category: newMed.category,
                    image_url: imageUrl
                }]);

            setUploadProgress(100);

            if (!error) {
                setIsAddModalOpen(false);
                resetForm();
                await fetchMedications();
                alert("Product added successfully!");
            } else {
                alert(`Error: ${error.message}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = selectedProduct.image_url;

            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const { error } = await supabase
                .from("medications")
                .update({
                    name: newMed.name,
                    description: newMed.description,
                    price: parseFloat(newMed.price),
                    stock_quantity: parseInt(newMed.stock_quantity),
                    requires_prescription: newMed.requires_prescription,
                    category: newMed.category,
                    image_url: imageUrl
                })
                .eq("id", selectedProduct.id);

            if (!error) {
                setIsEditModalOpen(false);
                resetForm();
                await fetchMedications();
                alert("Product updated successfully!");
            } else {
                alert(`Error: ${error.message}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async () => {
        setIsSubmitting(true);

        try {
            if (selectedProduct.image_url) {
                const imagePath = selectedProduct.image_url.split('/').pop();
                if (imagePath) {
                    await supabase.storage
                        .from('product-images')
                        .remove([`medications/${imagePath}`]);
                }
            }

            const { error } = await supabase
                .from("medications")
                .delete()
                .eq("id", selectedProduct.id);

            if (!error) {
                setIsDeleteModalOpen(false);
                await fetchMedications();
                alert("Product deleted successfully!");
            } else {
                alert(`Error: ${error.message}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fixed updateOrderStatus function with better error handling and state management
    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        // Set loading state for this specific order
        setUpdatingOrderId(orderId);

        try {
            console.log(`Updating order ${orderId} to status: ${newStatus}`);

            const { error } = await supabase
                .from("orders")
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq("id", orderId);

            if (error) {
                console.error("Update error:", error);
                alert(`Error updating order status: ${error.message}`);
                return;
            }

            // Update local state immediately for better UX
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );

            console.log(`Order ${orderId} status updated to ${newStatus} successfully`);
            alert(`Order status updated to ${newStatus.toUpperCase()}!`);

            // Refresh orders from database to ensure consistency
            await fetchOrders();

        } catch (error: any) {
            console.error("Unexpected error:", error);
            alert(`Failed to update order status: ${error.message}`);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "text/csv") {
            setCsvFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const rows = text.split("\n");
                const headers = rows[0].split(",");
                const products = [];

                for (let i = 1; i < rows.length; i++) {
                    if (rows[i].trim()) {
                        const values = rows[i].split(",");
                        const product: any = {};
                        headers.forEach((header, index) => {
                            product[header.trim()] = values[index]?.trim();
                        });
                        products.push(product);
                    }
                }
                setBulkProducts(products);
            };
            reader.readAsText(file);
        } else {
            alert("Please upload a valid CSV file");
        }
    };

    const handleBulkUpload = async () => {
        setIsSubmitting(true);
        let success = 0;
        let failed = 0;

        for (let i = 0; i < bulkProducts.length; i++) {
            setBulkUploadProgress(((i + 1) / bulkProducts.length) * 100);
            const product = bulkProducts[i];

            const { error } = await supabase
                .from("medications")
                .insert([{
                    name: product.name,
                    description: product.description || "",
                    price: parseFloat(product.price),
                    stock_quantity: parseInt(product.stock_quantity),
                    requires_prescription: product.requires_prescription === "true",
                    category: product.category || "General",
                    image_url: product.image_url || ""
                }]);

            if (!error) {
                success++;
            } else {
                failed++;
            }
        }

        alert(`Bulk upload complete!\nSuccess: ${success}\nFailed: ${failed}`);
        setIsBulkModalOpen(false);
        setBulkProducts([]);
        setCsvFile(null);
        setBulkUploadProgress(0);
        await fetchMedications();
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setNewMed({
            name: "",
            description: "",
            price: "",
            stock_quantity: "",
            requires_prescription: false,
            category: "General",
            image_url: ""
        });
        setImageFile(null);
        setImagePreview("");
        setUploadProgress(0);
        setSelectedProduct(null);
    };

    const openEditModal = (product: any) => {
        setSelectedProduct(product);
        setNewMed({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            stock_quantity: product.stock_quantity.toString(),
            requires_prescription: product.requires_prescription,
            category: product.category,
            image_url: product.image_url || ""
        });
        setImagePreview(product.image_url || "");
        setIsEditModalOpen(true);
    };

    const downloadCSVTemplate = () => {
        const headers = ["name", "description", "price", "stock_quantity", "requires_prescription", "category"];
        const sampleRow = ["Sample Product", "Product description", "19.99", "100", "false", "General"];
        const csvContent = [headers.join(","), sampleRow.join(",")].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <Loader2 className="animate-spin text-white" size={40} />
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-zinc-50 flex font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-950 text-white p-8 hidden lg:flex flex-col">
                <h2 className="text-xl font-black mb-12 tracking-tighter italic">AURA<span className="text-zinc-500">ADMIN</span></h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'orders' ? 'bg-white text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} /> Orders
                        {orders.filter(o => o.status === 'pending').length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {orders.filter(o => o.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'inventory' ? 'bg-white text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
                    >
                        <ClipboardList size={20} /> Inventory
                    </button>
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-16">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 tracking-tight capitalize">{activeTab} Console</h1>
                        <p className="text-zinc-500 mt-2 font-medium uppercase text-[10px] tracking-widest">
                            {activeTab === 'orders'
                                ? `${filteredOrders.length} ORDERS • ${orders.filter(o => o.status === 'pending').length} PENDING`
                                : `${filteredMedications.length} STOCK ITEMS`}
                        </p>
                    </div>
                    <div className="bg-white text-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-2 text-xs font-bold uppercase">
                        <ShieldAlert size={14} className="text-red-500" /> Root Access Active
                    </div>
                </header>

                {activeTab === 'orders' ? (
                    <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-zinc-50 bg-zinc-50/50 flex justify-between items-center flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <FileCheck size={20} className="text-zinc-900" />
                                <h3 className="font-bold">Order Management</h3>
                            </div>
                            <div className="flex gap-3">
                                <select
                                    value={orderStatusFilter}
                                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900"
                                >
                                    <option value="all">All Orders</option>
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => fetchOrders()}
                                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw size={14} /> Refresh
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] uppercase tracking-widest text-zinc-400 font-black border-b border-zinc-50 bg-zinc-50/30">
                                        <th className="p-6">Order ID</th>
                                        <th className="p-6">Customer</th>
                                        <th className="p-6">Contact</th>
                                        <th className="p-6">Items</th>
                                        <th className="p-6">Amount</th>
                                        <th className="p-6">Status</th>
                                        <th className="p-6">Prescription</th>
                                        <th className="p-6">Date</th>
                                        <th className="p-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="p-12 text-center text-zinc-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package size={48} className="text-zinc-300" />
                                                    <p>No orders found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="font-mono text-xs font-bold">
                                                        #{order.id.slice(0, 8)}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-bold">{order.full_name || 'Anonymous'}</div>
                                                    <div className="text-xs text-zinc-500">{order.city || 'N/A'}</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-sm">{order.email || 'No email'}</div>
                                                    <div className="text-xs text-zinc-500">{order.phone || 'No phone'}</div>
                                                </td>
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsOrderDetailsModalOpen(true);
                                                        }}
                                                        className="text-xs bg-zinc-100 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors font-medium"
                                                    >
                                                        View ({order.items?.length || 0})
                                                    </button>
                                                </td>
                                                <td className="p-6 font-black">
                                                    ${order.total_amount?.toFixed(2)}
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold border ${getStatusColor(order.status)}`}
                                                            disabled={updatingOrderId === order.id}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="verified">Verified</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        {updatingOrderId === order.id && (
                                                            <Loader2 size={14} className="animate-spin text-zinc-500" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    {order.prescription_url ? (
                                                        <a
                                                            href={order.prescription_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-brand hover:underline text-xs font-bold flex items-center gap-1"
                                                        >
                                                            <Eye size={12} /> View Rx
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">No Rx</span>
                                                    )}
                                                </td>
                                                <td className="p-6 text-sm text-zinc-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="p-6">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsOrderDetailsModalOpen(true);
                                                        }}
                                                        className="text-brand hover:underline text-xs font-medium"
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center gap-4 flex-wrap">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Plus size={16} /> Add Product
                                </button>
                                <button
                                    onClick={() => setIsBulkModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <UploadIcon size={16} /> Bulk Upload
                                </button>
                                <button
                                    onClick={downloadCSVTemplate}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <Download size={16} /> Template
                                </button>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm">
                            <div className="flex gap-4 flex-wrap">
                                <div className="flex-1 min-w-[200px] relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                                    />
                                </div>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === "all" ? "All Categories" : cat}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={prescriptionFilter}
                                    onChange={(e) => setPrescriptionFilter(e.target.value)}
                                    className="px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-900"
                                >
                                    <option value="all">All Products</option>
                                    <option value="required">Prescription Required</option>
                                    <option value="otc">Over Counter</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredMedications.map((med) => (
                                <div key={med.id} className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative">
                                    {med.image_url && (
                                        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-zinc-100">
                                            <img
                                                src={med.image_url}
                                                alt={med.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <h4 className="text-xl font-bold text-zinc-900 mb-1">{med.name}</h4>
                                    <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{med.description || "No description"}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-black">${med.price?.toFixed(2)}</p>
                                            {med.requires_prescription && (
                                                <span className="text-[10px] font-bold text-amber-600 uppercase">Rx Required</span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase ${med.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Stock: {med.stock_quantity}
                                        </span>
                                    </div>

                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(med)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProduct(med);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredMedications.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-3xl">
                                <p className="text-zinc-500">No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Order Details Modal */}
            {isOrderDetailsModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black text-zinc-900">Order Details</h3>
                                <button onClick={() => setIsOrderDetailsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50 rounded-xl">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold">Order ID</p>
                                        <p className="font-mono text-sm">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold">Status</p>
                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusIcon(selectedOrder.status)}
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold">Date</p>
                                        <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase font-bold">Total Amount</p>
                                        <p className="text-xl font-bold">${selectedOrder.total_amount?.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold mb-3">Customer Information</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><span className="text-zinc-500">Name:</span> {selectedOrder.full_name}</div>
                                        <div><span className="text-zinc-500">Email:</span> {selectedOrder.email}</div>
                                        <div><span className="text-zinc-500">Phone:</span> {selectedOrder.phone}</div>
                                        <div><span className="text-zinc-500">Address:</span> {selectedOrder.shipping_address}</div>
                                    </div>
                                </div>

                                {selectedOrder.items && selectedOrder.items.length > 0 && (
                                    <div>
                                        <h4 className="font-bold mb-3">Order Items</h4>
                                        <div className="space-y-2">
                                            {selectedOrder.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-xs text-zinc-500">Quantity: {item.quantity || 1}</p>
                                                    </div>
                                                    <p className="font-bold">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedOrder.prescription_url && (
                                    <div>
                                        <h4 className="font-bold mb-3">Prescription</h4>
                                        <a href={selectedOrder.prescription_url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline flex items-center gap-2">
                                            <Eye size={16} /> View Prescription Document
                                        </a>
                                    </div>
                                )}

                                {selectedOrder.notes && (
                                    <div>
                                        <h4 className="font-bold mb-3">Order Notes</h4>
                                        <p className="text-sm text-zinc-600 p-3 bg-zinc-50 rounded-lg">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-zinc-900 italic tracking-tighter">NEW STOCK ENTRY</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleAddMedication} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400">Product Image</label>
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-zinc-900 transition-colors">
                                            <Upload size={32} className="text-zinc-400 mb-2" />
                                            <p className="text-sm text-zinc-500">Click to upload image</p>
                                            <p className="text-xs text-zinc-400">PNG, JPG, GIF up to 5MB</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                                        </label>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Product Name *</label>
                                    <input required placeholder="Enter product name" className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Description</label>
                                    <textarea placeholder="Enter product description" rows={3} className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900 resize-none" value={newMed.description} onChange={(e) => setNewMed({ ...newMed, description: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Price ($) *</label>
                                        <input required type="number" step="0.01" placeholder="0.00" className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Stock Quantity *</label>
                                        <input required type="number" placeholder="0" className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.stock_quantity} onChange={(e) => setNewMed({ ...newMed, stock_quantity: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Category</label>
                                    <select className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.category} onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}>
                                        <option>General</option>
                                        <option>Pain Relief</option>
                                        <option>Antibiotics</option>
                                        <option>Vitamins</option>
                                        <option>Chronic Care</option>
                                    </select>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newMed.requires_prescription} onChange={(e) => setNewMed({ ...newMed, requires_prescription: e.target.checked })} />
                                    <span className="text-sm font-medium">Requires Prescription</span>
                                </label>

                                {uploadProgress > 0 && (
                                    <div className="w-full bg-zinc-200 rounded-full h-2">
                                        <div className="bg-zinc-900 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting} className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black hover:bg-zinc-800 transition disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Add Product"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-zinc-900 italic tracking-tighter">EDIT PRODUCT</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleEditProduct} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400">Product Image</label>
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-zinc-900 transition-colors">
                                            <Upload size={32} className="text-zinc-400 mb-2" />
                                            <p className="text-sm text-zinc-500">Click to upload new image</p>
                                            <p className="text-xs text-zinc-400">Leave empty to keep current image</p>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                                        </label>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Product Name *</label>
                                    <input required className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.name} onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Description</label>
                                    <textarea rows={3} className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900 resize-none" value={newMed.description} onChange={(e) => setNewMed({ ...newMed, description: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Price ($) *</label>
                                        <input required type="number" step="0.01" className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.price} onChange={(e) => setNewMed({ ...newMed, price: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Stock Quantity *</label>
                                        <input required type="number" className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.stock_quantity} onChange={(e) => setNewMed({ ...newMed, stock_quantity: e.target.value })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-zinc-400 block mb-2">Category</label>
                                    <select className="w-full p-3 border rounded-xl focus:outline-none focus:border-zinc-900" value={newMed.category} onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}>
                                        <option>General</option>
                                        <option>Pain Relief</option>
                                        <option>Antibiotics</option>
                                        <option>Vitamins</option>
                                        <option>Chronic Care</option>
                                    </select>
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newMed.requires_prescription} onChange={(e) => setNewMed({ ...newMed, requires_prescription: e.target.checked })} />
                                    <span className="text-sm font-medium">Requires Prescription</span>
                                </label>

                                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 transition disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Update Product"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                        <h3 className="text-2xl font-black text-zinc-900 mb-4">Delete Product</h3>
                        <p className="text-zinc-600 mb-6">
                            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 border rounded-xl font-medium hover:bg-zinc-50 transition">
                                Cancel
                            </button>
                            <button onClick={handleDeleteProduct} disabled={isSubmitting} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {isBulkModalOpen && (
                <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-zinc-900 italic tracking-tighter">BULK UPLOAD</h3>
                            <button onClick={() => setIsBulkModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        {bulkProducts.length === 0 ? (
                            <div className="space-y-6">
                                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-zinc-900 transition-colors">
                                    <UploadIcon className="mx-auto mb-4 text-zinc-400" size={48} />
                                    <p className="text-zinc-600 mb-2 font-medium">Upload CSV file with products</p>
                                    <p className="text-xs text-zinc-400 mb-4">Format: name, description, price, stock_quantity, requires_prescription, category</p>
                                    <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" id="csvUpload" />
                                    <label htmlFor="csvUpload" className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-xl cursor-pointer hover:bg-zinc-800 transition">
                                        Select CSV File
                                    </label>
                                </div>
                                <button onClick={downloadCSVTemplate} className="w-full px-6 py-3 border rounded-xl font-medium hover:bg-zinc-50 transition">
                                    Download Template CSV
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-zinc-50 rounded-xl p-4">
                                    <p className="font-bold mb-2">Preview: {bulkProducts.length} products found</p>
                                    <div className="max-h-64 overflow-y-auto space-y-2">
                                        {bulkProducts.slice(0, 5).map((product, idx) => (
                                            <div key={idx} className="text-sm p-2 bg-white rounded border">
                                                {product.name} - ${product.price} (Stock: {product.stock_quantity})
                                            </div>
                                        ))}
                                        {bulkProducts.length > 5 && (
                                            <p className="text-sm text-zinc-500">... and {bulkProducts.length - 5} more</p>
                                        )}
                                    </div>
                                </div>

                                {bulkUploadProgress > 0 && (
                                    <div className="space-y-2">
                                        <div className="w-full bg-zinc-200 rounded-full h-2">
                                            <div className="bg-zinc-900 h-2 rounded-full transition-all" style={{ width: `${bulkUploadProgress}%` }} />
                                        </div>
                                        <p className="text-xs text-zinc-500 text-center">Uploading... {Math.round(bulkUploadProgress)}%</p>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button onClick={() => setBulkProducts([])} className="flex-1 px-6 py-3 border rounded-xl font-medium hover:bg-zinc-50 transition">
                                        Cancel
                                    </button>
                                    <button onClick={handleBulkUpload} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50">
                                        {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Upload All"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}