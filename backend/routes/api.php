<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReportController;

Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);          // LIST
    Route::post('/', [ProductController::class, 'store']);         // CREATE
    Route::get('{product}', [ProductController::class, 'show']);   // SHOW
    Route::put('{product}', [ProductController::class, 'update']); // UPDATE (full)
    Route::patch('{product}', [ProductController::class, 'update']);// UPDATE (partial)
    Route::delete('{product}', [ProductController::class, 'destroy']); // DELETE
});

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::post('/', [OrderController::class, 'store']);
    Route::get('{id}', [OrderController::class, 'show']);
    Route::patch('{id}', [OrderController::class, 'update']);
});

Route::prefix('reports')->group(function () {
    Route::get('daily', [ReportController::class, 'daily']);
    Route::get('sales', [ReportController::class, 'sales']);
    Route::get('products', [ReportController::class, 'products']);
});
