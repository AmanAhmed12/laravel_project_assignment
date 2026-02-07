"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Video } from "../../../types";
import Link from "next/link";

export default function Dashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        // Simple client-side protection. ideally middleware + server checks.
        const checkAuth = () => {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) router.push("/login");
        }
        checkAuth();
    }, [router]);

    const fetchVideos = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`API Error: ${res.status} ${res.statusText}\n${text}`);
                }
                return res.json();
            })
            .then(data => setVideos(data))
            .catch(err => console.error('Dashboard fetch error:', err));
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                fetchVideos();
            } else {
                alert("Failed to delete video");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting video");
        }
    };

    if (!user || user.role !== 'admin') {
        // Should redirect in useEffect, but return null/loader here
        return <div className="p-8 text-center">Loading or Unauthorized...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-5xl font-bold text-gradient mb-2 tracking-tight">Admin Console</h1>
                    <p className="text-gray-400">Manage your premium video catalog and content distribution.</p>
                </div>
                <Link href="/admin/upload" className="btn-primary !px-8 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    New Upload
                </Link>
            </header>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em]">
                                <th className="p-6">Content Title</th>
                                <th className="p-6">Market Value</th>
                                <th className="p-6">Launch Date</th>
                                <th className="p-6 text-center">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {videos.map((video, idx) => (
                                <tr
                                    key={video.id}
                                    className="hover:bg-white/[0.02] transition-colors group animate-fade-in"
                                    style={{ animationDelay: `${idx * 0.05}s` }}
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <span className="font-semibold text-lg">{video.title}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xl font-bold font-mono text-emerald-400">${video.price}</span>
                                    </td>
                                    <td className="p-6 text-gray-500 font-medium">
                                        {new Date(video.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => handleDelete(video.id)}
                                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 px-4 py-2 rounded-xl transition-all border border-rose-500/10 group-hover:border-rose-500/30 text-xs font-bold uppercase tracking-widest"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {videos.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <p className="text-gray-500 font-medium italic">Your catalog is currently empty.</p>
                        <p className="text-sm text-gray-600 mt-1">Start by adding your first premium video.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
