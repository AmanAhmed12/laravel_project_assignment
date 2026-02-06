<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        return \App\Models\Video::latest()->get();
    }

    public function store(\App\Http\Requests\StoreVideoRequest $request)
    {
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
        $video->delete();
        return response()->noContent();
    }
}
