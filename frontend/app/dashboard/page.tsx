"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Video } from "../../types";

export default function CustomerDashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [purchasedVideos, setPurchasedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setPurchasedVideos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [isAuthenticated, token, router]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Dashboard</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2">My Purchased Videos</h2>
                {purchasedVideos.length === 0 ? (
                    <p className="text-gray-500">You haven't purchased any videos yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {purchasedVideos.map((video) => (
                            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="bg-black aspect-video">
                                    <video
                                        src={`http://localhost:8000${video.video_path}`}
                                        controls
                                        controlsList="nodownload"
                                        className="w-full h-full object-contain"
                                        onContextMenu={(e) => e.preventDefault()}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{video.description}</p>
                                    <span className="text-green-600 font-bold">Purchased</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
