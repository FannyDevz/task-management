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
        Schema::create('custom_category_option_values', function (Blueprint $table) {
          $table->id();
          $table->unsignedBigInteger('task_id');
          $table->unsignedBigInteger('config_id');
          $table->unsignedBigInteger('option_id');

          $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
          $table->foreign('config_id')->references('id')->on('custom_config_category_forms')->onDelete('cascade');
          $table->foreign('option_id')->references('id')->on('custom_config_category_options')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_category_option_values');
    }
};
