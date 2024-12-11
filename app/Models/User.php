<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Illuminate\Database\Eloquent\Relations\HasMany;
    

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

     

    protected $fillable = [
        'name',
        'email',
        'password',

        'profile_photo_path',
    ];  
    protected $appends = ['profile_photo_path'];


    public function chirps(): HasMany
    {
        return $this->hasMany(Chirp::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profilePhotos(): HasMany 
    { return
         $this->hasMany(ProfilePhoto::class); }    

         public function toArray()
{
    return array_merge(parent::toArray(), [
        'profile_photo_path' => $this->profile_photo_path,
    ]);
}


public function getProfilePhotoPathAttribute()
{
    return $this->profilePhoto 
        ? $this->profilePhoto->profile_photo_path 
        : 'default-profile.png';
}


    public function profilePhoto()
{
    return $this->hasOne(ProfilePhoto::class, 'user_id', 'id');
}

public function comments()
{
    return $this->hasMany(Comment::class);
} //



}
 

