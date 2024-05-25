<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_config_category_options', function (Blueprint $table) {
          $table->id();
          $table->unsignedBigInteger('config_id');
          $table->string('optionname');
          $table->integer('order');
          $table->boolean('hidden')->default(false);
          $table->timestamps();

          // Define foreign key constraint
          $table->foreign('config_id')->references('id')->on('custom_config_category_forms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_config_category_options');
    }
};
