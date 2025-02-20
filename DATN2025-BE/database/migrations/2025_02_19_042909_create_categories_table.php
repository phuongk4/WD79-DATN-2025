<?php

use App\Enums\CategoryStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->longText('thumbnail');
            $table->bigInteger('parent_id')->nullable();

            $table->timestamp('deleted_at')->nullable();
            $table->bigInteger('deleted_by')->nullable();

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references(/**/ 'id')->on('users')->onDelete('cascade');

            $table->bigInteger('updated_by')->nullable();

            $table->string('status')->default(CategoryStatus::ACTIVE);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
