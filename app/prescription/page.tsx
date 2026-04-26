"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Upload,
    FileText,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    Shield,
    Clock,
    Mail,
    Phone,
    MapPin,
    User,
    Calendar,
    AlertCircle,
    Eye,
    Trash2,
    Plus
} from "lucide-react";
import Link from "next/link";

export default function PrescriptionPage() {
    const supabase = createClient();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [prescriptionNotes, setPrescriptionNotes] = useState("");
    const [uploadError, setUploadError] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState("");
    const [patientInfo, setPatientInfo] = useState({
        full_name: "",
        date_of_birth: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        checkUser();
        fetchPrescriptions();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?redirect=/prescription");
                return;
            }
            setUser(user);

            // Fetch patient profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setPatientInfo({
                    full_name: profile.full_name || "",
                    date_of_birth: profile.date_of_birth || "",
                    phone: profile.phone || "",
                    address: profile.address || ""
                });
            }
        } catch (error) {
            console.error("Error checking user:", error);
            router.push("/login?redirect=/prescription");
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from("prescriptions")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPrescriptions(data || []);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setUploadError("Please upload a JPEG, PNG, or PDF file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size must be less than 5MB");
            return;
        }

        setSelectedFile(file);
        setUploadError("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select a file to upload");
            return;
        }

        if (!patientInfo.full_name) {
            setUploadError("Please fill in your full name");
            return;
        }

        setUploading(true);
        setUploadError("");
        setUploadSuccess("");

        try {
            // Create unique file name
            const fileExt = selectedFile.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}_prescription.${fileExt}`;
            const filePath = `prescriptions/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('prescriptions')
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('prescriptions')
                .getPublicUrl(filePath);

            // Save prescription record to database
            const { error: dbError } = await supabase
                .from("prescriptions")
                .insert({
                    user_id: user.id,
                    file_url: publicUrl,
                    file_name: selectedFile.name,
                    file_size: selectedFile.size,
                    file_type: selectedFile.type,
                    status: "pending",
                    notes: prescriptionNotes,
                    patient_name: patientInfo.full_name,
                    patient_dob: patientInfo.date_of_birth,
                    patient_phone: patientInfo.phone,
                    created_at: new Date().toISOString()
                });

            if (dbError) throw dbError;

            setUploadSuccess("Prescription uploaded successfully! Our team will review it shortly.");
            setSelectedFile(null);
            setPrescriptionNotes("");
            setShowUploadModal(false);
            await fetchPrescriptions();

            // Reset form after 3 seconds
            setTimeout(() => setUploadSuccess(""), 3000);

        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadError(error.message || "Failed to upload prescription");
        } finally {
            setUploading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return { color: 'bg-yellow-100 text-yellow-700', text: 'Pending Review', icon: Clock };
            case 'approved':
                return { color: 'bg-green-100 text-green-700', text: 'Approved', icon: CheckCircle };
            case 'rejected':
                return { color: 'bg-red-100 text-red-700', text: 'Rejected', icon: XCircle };
            default:
                return { color: 'bg-gray-100 text-gray-700', text: status, icon: FileText };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                    <p className="text-zinc-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-zinc-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-zinc-400 hover:text-zinc-900 transition">
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-zinc-900">Prescription Center</h1>
                                <p className="text-zinc-500 text-sm mt-1">Upload and manage your prescriptions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            New Prescription
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 mb-12 text-white"
                >
                    <div className="flex flex-wrap justify-between items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                            <p className="text-green-100">Upload your prescription and our pharmacists will verify it within 24 hours</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <Upload size={24} />
                                </div>
                                <p className="text-sm font-medium">1. Upload</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <Shield size={24} />
                                </div>
                                <p className="text-sm font-medium">2. Verify</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-sm font-medium">3. Get Approved</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Success/Error Messages */}
                {uploadSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3"
                    >
                        <CheckCircle size={20} className="text-green-600" />
                        <p className="text-green-700">{uploadSuccess}</p>
                    </motion.div>
                )}

                {uploadError && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3"
                    >
                        <AlertCircle size={20} className="text-red-600" />
                        <p className="text-red-700">{uploadError}</p>
                    </motion.div>
                )}

                {/* Prescriptions List */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900">Your Prescriptions</h3>

                    {prescriptions.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-100">
                            <FileText size={64} className="mx-auto text-zinc-300 mb-4" />
                            <h4 className="text-xl font-bold text-zinc-900 mb-2">No Prescriptions Yet</h4>
                            <p className="text-zinc-500 mb-6">Upload your first prescription to get started</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
                            >
                                Upload Prescription
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {prescriptions.map((prescription, idx) => {
                                const status = getStatusBadge(prescription.status);
                                const StatusIcon = status.icon;
                                return (
                                    <motion.div
                                        key={prescription.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl p-6 border border-zinc-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-wrap justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <FileText size={24} className="text-blue-600" />
                                                    <h4 className="font-bold text-zinc-900">{prescription.file_name}</h4>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Uploaded</p>
                                                        <p className="font-medium">{new Date(prescription.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Status</p>
                                                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}>
                                                            <StatusIcon size={12} />
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Size</p>
                                                        <p className="font-medium">{(prescription.file_size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-zinc-500 text-xs">Type</p>
                                                        <p className="font-medium uppercase">{prescription.file_type?.split('/')[1]}</p>
                                                    </div>
                                                </div>
                                                {prescription.notes && (
                                                    <p className="text-sm text-zinc-600 mt-3 p-3 bg-zinc-50 rounded-lg">
                                                        {prescription.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={prescription.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 border border-zinc-200 rounded-xl text-sm font-medium hover:border-green-600 transition flex items-center gap-2"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-zinc-900">Upload Prescription</h2>
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setSelectedFile(null);
                                        setUploadError("");
                                    }}
                                    className="p-2 hover:bg-zinc-100 rounded-full"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Patient Information */}
                                <div>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <User size={18} />
                                        Patient Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                value={patientInfo.full_name}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, full_name: e.target.value })}
                                                className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={patientInfo.date_of_birth}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, date_of_birth: e.target.value })}
                                                className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={patientInfo.phone}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                                className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500"
                                                placeholder="Your phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Address</label>
                                            <input
                                                type="text"
                                                value={patientInfo.address}
                                                onChange={(e) => setPatientInfo({ ...patientInfo, address: e.target.value })}
                                                className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500"
                                                placeholder="Your address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Upload size={18} />
                                        Prescription File
                                    </h3>
                                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${selectedFile ? 'border-green-500 bg-green-50' : 'border-zinc-300 hover:border-blue-500'}`}>
                                        {selectedFile ? (
                                            <div>
                                                <CheckCircle size={48} className="mx-auto text-green-600 mb-3" />
                                                <p className="font-medium text-green-600">{selectedFile.name}</p>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </p>
                                                <button
                                                    onClick={() => setSelectedFile(null)}
                                                    className="mt-3 text-red-600 text-sm hover:underline flex items-center gap-1 mx-auto"
                                                >
                                                    <Trash2 size={14} /> Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer">
                                                <Upload size={48} className="mx-auto text-zinc-400 mb-3" />
                                                <p className="font-medium text-zinc-700">Click to upload</p>
                                                <p className="text-sm text-zinc-400 mt-1">JPEG, PNG, or PDF (Max 5MB)</p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                                    onChange={handleFileSelect}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <label className="block font-bold mb-2">Additional Notes (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={prescriptionNotes}
                                        onChange={(e) => setPrescriptionNotes(e.target.value)}
                                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="Any additional information for the pharmacist..."
                                    />
                                </div>

                                {/* Privacy Notice */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <Shield size={20} className="text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-800">HIPAA Compliant</p>
                                            <p className="text-xs text-blue-600 mt-1">
                                                Your prescription is securely stored and only accessible to licensed pharmacists.
                                                We never share your medical information with third parties.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setSelectedFile(null);
                                            setUploadError("");
                                        }}
                                        className="flex-1 px-6 py-3 border border-zinc-200 rounded-xl font-medium hover:bg-zinc-50 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpload}
                                        disabled={!selectedFile || uploading}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={20} />
                                                Upload Prescription
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}