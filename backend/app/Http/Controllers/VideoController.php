<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        return \App\Models\Video::latest()->get();
    }

    public function store(\Illuminate\Http\Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'video' => 'required|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:102400',
        ]);

        $path = $request->file('video')->store('videos', 'public');

        $video = \App\Models\Video::create([
            'title' => $request->title,
            'description' => $request->description,
            'price' => $request->price,
            'video_path' => '/storage/' . $path,
        ]);

        return response()->json($video, 201);
    }

    public function show($id)
    {
        //
    }

    public function update(\Illuminate\Http\Request $request, $id)
    {
        //
    }

    public function destroy(\App\Models\Video $video)
    {
        if (request()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $video->delete();
        return response()->noContent();
    }
}
