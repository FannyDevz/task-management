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
        Schema::create('custom_category_fields', function (Blueprint $table) {
          $table->id();
          $table->unsignedBigInteger('category_id');
          $table->string('fieldname');
          $table->string('fieldtype');
          $table->text('detail')->nullable();
          $table->integer('order')->default(0);
          $table->boolean('hidden')->default(false);

          $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_category_fields');
    }
};
