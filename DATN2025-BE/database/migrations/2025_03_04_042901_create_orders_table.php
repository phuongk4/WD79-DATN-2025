<?php

use App\Enums\OrderMethod;
use App\Enums\OrderStatus;
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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references(/**/ 'id')->on('users')->onDelete('cascade');

            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('reason_cancel')->nullable();

            $table->decimal('products_price', 15, 0)->comment('Giá toàn bộ sản phẩm');
            $table->decimal('shipping_price', 15, 0)->comment('Giá tiền phí vận chuyển');
            $table->decimal('discount_price', 15, 0)->comment('Giá tiền giảm giá');
            $table->decimal('total_price', 15, 0)->comment('Tổng tiền thanh toán');

            $table->longText('notes')->nullable()->comment('Ghi chú của khách hàng');

            $table->string('order_method')->default(OrderMethod::IMMEDIATE);
            $table->string('status')->default(OrderStatus::PROCESSING);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
