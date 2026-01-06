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
        Schema::create('sales_order_items', function (Blueprint $table) {
        $table->id();

        $table->foreignId('sales_order_id')->constrained('sales_orders')->cascadeOnDelete();
        $table->foreignId('product_id')->constrained()->restrictOnDelete();

        $table->unsignedInteger('qty');
        $table->unsignedBigInteger('price');
        $table->unsignedBigInteger('line_total');

        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_order_items');
    }
};
