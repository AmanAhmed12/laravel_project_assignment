<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        // Get videos purchased by the user
        $purchasedVideos = $request->user()->purchases()->with('video')->get()->pluck('video');
        return response()->json($purchasedVideos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'video_id' => 'required|exists:videos,id',
        ]);

        $user = $request->user();
        
        // Use DB::table for now since we haven't created a Purchase model yet relation on User model
        $exists = \Illuminate\Support\Facades\DB::table('purchases')
            ->where('user_id', $user->id)
            ->where('video_id', $request->video_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Video already purchased'], 409);
        }

        \Illuminate\Support\Facades\DB::table('purchases')->insert([
            'user_id' => $user->id,
            'video_id' => $request->video_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Purchase successful'], 201);
    }
}
