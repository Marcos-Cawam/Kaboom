<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilePhotosTable extends Migration
{
    public function up()
    {
        Schema::create('profile_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Chave estrangeira para a tabela users
            $table->string('profile_photo_path'); // Campo para armazenar o caminho da foto
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('profile_photos');
    }
}
