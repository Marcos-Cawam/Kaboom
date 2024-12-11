<?php

use App\Http\Controllers\ChirpController;

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProfilePhotoController;
use App\Http\Controllers\CommentController;

//COMENTARIOS
Route::post('/chirps/{chirp}/comments', [CommentController::class, 'store'])->name('comments.store');
Route::get('/comments/{comment}/edit', [CommentController::class, 'edit'])->name('comments.edit');
Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');




Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/profile_photos', [ProfilePhotoController::class, 'store'])->name('profile_photos.store');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});

Route::get('/user/profile', 'UserProfileController@show')->name('profile.show');



Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/Message', function () {
    return Inertia::render('Message', [
    ]);
});

//CODIGO COMENTADO 05/12/2024
Route::get('/chirps', [ChirpController::class, 'index'])->name('chirps.index');


Route::get('/Message', function () {
    return Inertia::render('Message');
})->middleware(['auth', 'verified'])->name('message');






Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



Route::resource('chirps', ChirpController::class)
    ->only(['index', 'store', 'update', 'destroy'])
    ->middleware(['auth', 'verified']);

require __DIR__.'/auth.php';
