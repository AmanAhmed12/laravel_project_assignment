"use client";

import { useEffect, useState } from "react";
import { Video } from "../types";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const { user, token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const backendUrl = "http://localhost:8000";

  const handleBuy = async (videoId: number) => {
    if (!isAuthenticated) {
      showToast("Please login to buy videos", "info");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ video_id: videoId })
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Purchase successful! You can watch it in your dashboard.", "success");
        setPurchasedIds(prev => [...prev, videoId]); // Update UI immediately
      } else {
        if (res.status === 409) {
          showToast("You have already purchased this video.", "info");
        } else {
          showToast(data.message || "Purchase failed", "error");
        }
      }
    } catch (error) {
      console.error("Purchase error:", error);
      showToast("An error occurred while purchasing.", "error");
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setPurchasedIds(data.map((v: Video) => v.id));
          }
        })
        .catch(err => console.error('Purchases fetch error:', err));
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API Error: ${res.status} ${res.statusText}\n${text}`);
        }
        return res.json();
      })
      .then((data) => setVideos(data))
      .catch((err) => console.error('Videos fetch error:', err));
  }, []);

  return (
    <div className="container mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Amazing Videos</h1>
        <p className="text-xl text-gray-600">Browse our collection of premium content</p>
      </header>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-black aspect-video">
                <video
                  src={`${backendUrl}${video.video_path}`}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{video.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{video.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-2xl font-bold text-blue-600">${video.price}</span>
                  {purchasedIds.includes(video.id) ? (
                    <span className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded">
                      Purchased
                    </span>
                  ) : (
                    <button
                      onClick={() => handleBuy(video.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
