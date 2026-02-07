"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../../../context/ToastContext";

export default function UploadPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile) return showToast("Please select a video file", "info");

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("video", videoFile);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Upload failed");
            }

            showToast("Video uploaded successfully!", "success");
            router.push("/admin/dashboard");
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') return <p className="text-center p-8">Checking authentication...</p>;

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="absolute top-1/4 right-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gradient mb-3 tracking-tight">Content Studio</h1>
                <p className="text-gray-400">Expand your premium library with high-definition content.</p>
            </header>

            <form onSubmit={handleSubmit} className="glass-card p-10 space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Video Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                            placeholder="Enter cinematic title"
                            required
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Market Price ($)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-mono italic">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 font-mono"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Production Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 h-40 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 resize-none leading-relaxed"
                        placeholder="Describe the cinematic experience..."
                        required
                    />
                </div>

                <div className="group relative bg-white/[0.02] hover:bg-white/[0.04] p-10 rounded-3xl border border-dashed border-white/10 hover:border-indigo-500/50 transition-all text-center">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                    />
                    <div className="relative z-0 pointer-events-none">
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400 group-hover:scale-110 transition-transform duration-500">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-white font-bold mb-1">{videoFile ? videoFile.name : 'Select or Drop Production File'}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">MP4, AVI, MOV (MAX 100MB)</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-bold text-gray-400"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 btn-primary !py-4 text-lg relative overflow-hidden group"
                    >
                        <span className={loading ? 'opacity-0' : 'opacity-100 flex items-center justify-center gap-2'}>
                            Initialize Broadcast
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </span>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
