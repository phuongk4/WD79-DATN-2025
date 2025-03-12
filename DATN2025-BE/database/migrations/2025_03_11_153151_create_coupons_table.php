<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            $table->text('description')->nullable();

            $table->string('code')->unique();
            $table->string('type');
            $table->string('discount_percent')->comment('Phần trăm giảm giá');
            $table->decimal('max_discount', 15, 0);
            $table->bigInteger('max_set')->comment('Số lượng mã tối đa user có thể lưu');
            $table->string('status')->default(\App\Enums\CouponStatus::ACTIVE);

            $table->string('thumbnail')->nullable();

            $table->bigInteger('quantity');
            $table->bigInteger('number_used');

            $table->timestamp('start_time')->default(Carbon::now());
            $table->timestamp('end_time')->default(Carbon::now()->addDays(1));

            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references(/**/ 'id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};