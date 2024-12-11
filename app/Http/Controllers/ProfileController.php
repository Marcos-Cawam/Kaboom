<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use App\Models\ProfilePhoto;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;


class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
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

            $newProfilePhoto = ProfilePhoto::create([
                'user_id' => $user->id,
                'profile_photo_path' => $path,
            ]);

            if ($newProfilePhoto) {
                \Log::info('Profile photo successfully saved in database: ' . $newProfilePhoto->profile_photo_path);
            } else {
                \Log::error('Failed to save profile photo in database.');
            }
        }

        \Log::info('Profile updated successfully');

        return response()->json(['message' => 'Profile updated successfully']);
    }


    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

public function show()
{
   
       
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