<?php

use App\Enums\ReviewStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_id');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');

            $table->integer('stars');

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references(/**/ 'id')->on('users')->onDelete('cascade');

            $table->string('title');
            $table->longText('content');
            $table->longText('thumbnail')->nullable();

            $table->unsignedBigInteger('order_id')->nullable();

            $table->string('status')->nullable()->default(ReviewStatus::APPROVED);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
