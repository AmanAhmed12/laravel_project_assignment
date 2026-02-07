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
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <Link href="/admin/upload" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition shadow">
                    + Upload New Video
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b text-gray-700 uppercase text-sm">
                            <th className="p-4">Video Title</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Uploaded Date</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map(video => (
                            <tr key={video.id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 font-medium">{video.title}</td>
                                <td className="p-4 font-bold text-green-700">${video.price}</td>
                                <td className="p-4 text-gray-500">{new Date(video.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {videos.length === 0 && <p className="p-8 text-center text-gray-500 italic">No videos uploaded yet. Start by clicking Upload New Video.</p>}
            </div>
        </div>
    );
}
