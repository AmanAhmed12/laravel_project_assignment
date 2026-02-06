"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
    const { token, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile) return alert("Please select a video file");

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

            alert("Video uploaded successfully!");
            router.push("/admin/dashboard");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') return <p className="text-center p-8">Checking authentication...</p>;

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Upload New Video</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Video Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        placeholder="Enter video title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        placeholder="Enter video description"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-bold mb-2">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        placeholder="0.00"
                        required
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <label className="block text-gray-700 font-bold mb-2">Video File</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        className="w-full text-gray-500"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">Supported formats: MP4, AVI, MOV (Max 100MB)</p>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 font-bold"
                    >
                        {loading ? "Uploading..." : "Upload Video"}
                    </button>
                </div>
            </form>
        </div>
    );
}
