"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface PrescriptionUploadProps {
    onUploadSuccess: (url: string) => void;
}

export default function PrescriptionUpload({ onUploadSuccess }: PrescriptionUploadProps) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setError("Please upload a JPEG, PNG, or PDF file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setUploading(true);
        setError("");
        setFileName(file.name);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Please sign in to upload prescription");

            // Create unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}_prescription.${fileExt}`;
            const filePath = `prescriptions/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('prescriptions')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('prescriptions')
                .getPublicUrl(filePath);

            setUploaded(true);
            onUploadSuccess(publicUrl);

        } catch (error: any) {
            console.error("Upload error:", error);
            setError(error.message || "Failed to upload prescription");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!uploaded ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-brand transition-colors bg-zinc-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
                        ) : (
                            <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                        )}
                        <p className="text-sm text-zinc-500">
                            {uploading ? "Uploading..." : "Click to upload prescription"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">JPEG, PNG, or PDF (Max 5MB)</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            ) : (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle className="text-green-600" size={20} />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Prescription uploaded</p>
                        <p className="text-xs text-green-600">{fileName}</p>
                    </div>
                    <button
                        onClick={() => {
                            setUploaded(false);
                            setFileName("");
                            onUploadSuccess("");
                        }}
                        className="text-green-600 hover:text-green-700"
                    >
                        <XCircle size={18} />
                    </button>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}