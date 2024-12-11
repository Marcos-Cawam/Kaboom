<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\ProfilePhoto;

class ProfilePhotoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            ProfilePhoto::create([
                'user_id' => $user->id,
                'profile_photo_path' => $path,
            ]);
        }
    }

       
    
    
    public function update(Request $request)
    {
        \Log::info('Request received', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        if ($request->hasFile('profile_photo')) {
            \Log::info('Profile photo received');

            // Excluir a foto de perfil antiga se existir
            $profilePhoto = ProfilePhoto::where('user_id', $user->id)->first();
            if ($profilePhoto) {
                \Log::info('Deleting old profile photo: ' . $profilePhoto->profile_photo_path);
                Storage::disk('public')->delete($profilePhoto->profile_photo_path);
                $profilePhoto->delete();
            }

            // Armazenar a nova foto de perfil
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            \Log::info('New profile photo path: ' . $path);
            ProfilePhoto::create([
                'user_id' => $user->id,
                'profile_photo_path' => $path,
            ]);
        }

        \Log::info('Profile updated successfully');

        return response()->json(['message' => 'Profile updated successfully']);
    }

    public function show(){
        $user = Auth::user();

        // Buscar o caminho da foto de perfil da tabela 'profile_photos'
        $profilePhoto = DB::table('profile_photos')
            ->where('profile_photo_path', $user->id)
            ->first();

        $profilePhotoPath = $profilePhoto ? $profilePhoto->path : null;

        return Inertia::render('Profile/Edit', [
            'auth' => [ 
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'profile_photo_path' => $profilePhotoPath, // Inclua o caminho da foto de perfil
                ],
            ],
        ]);
    }
    }
    
    
    



        