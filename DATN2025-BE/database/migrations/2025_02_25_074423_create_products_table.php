<?php

use App\Enums\ProductStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->longText('short_description');
            $table->longText('description');

            $table->longText('thumbnail');
            $table->longText('gallery');

            $table->decimal('price', 15, 0);
            $table->decimal('sale_price', 15, 0);

            $table->bigInteger('quantity')->default(1);

            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references(/**/ 'id')->on('categories')->onDelete('cascade');

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references(/**/ 'id')->on('users')->onDelete('cascade');

            $table->bigInteger('updated_by')->nullable();

            $table->bigInteger('deleted_by')->nullable();
            $table->timestamp('deleted_at')->nullable();

            $table->string('status')->default(ProductStatus::ACTIVE);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
