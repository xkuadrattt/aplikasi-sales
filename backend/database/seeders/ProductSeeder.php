<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Product::create([
            'sku' => 'NB-003',
            'name' => 'Laptop Acer Aspire',
            'category' => 'Laptop',
            'price_default' => 6000000,
        ]);

        Product::create([
            'sku' => 'NB-004',
            'name' => 'Laptop HP 14',
            'category' => 'Laptop',
            'price_default' => 12000000,
        ]);
    }
}
