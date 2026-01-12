<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class ProductController extends Controller
{
   public function index(Request $request)
{
    $q = trim((string) $request->query('q', ''));

    // filter: active=1/0/true/false (kalau tidak ada, tidak difilter)
    $activeParam = $request->query('active', null);

    // pagination
    $perPage = (int) $request->query('per_page', 10);
    $perPage = max(1, min($perPage, 100)); // batas aman
    $page = (int) $request->query('page', 1);
    $page = max(1, $page);

    // sorting
    $sort = (string) $request->query('sort', 'name');
    $dir = strtolower((string) $request->query('dir', 'asc')) === 'desc' ? 'desc' : 'asc';

    $allowedSorts = ['name', 'sku', 'price_default', 'is_active', 'created_at', 'updated_at'];
    if (!in_array($sort, $allowedSorts, true)) {
        $sort = 'name';
    }

    $query = Product::query();

    // search (sku/name)
    if ($q !== '') {
        $query->where(function ($w) use ($q) {
            $w->where('name', 'like', "%{$q}%")
              ->orWhere('sku', 'like', "%{$q}%");
        });
    }

    // filter active
    if ($activeParam !== null) {
        $query->where('is_active', filter_var($activeParam, FILTER_VALIDATE_BOOLEAN));
    }

    $query->orderBy($sort, $dir);

    // paginate (paksa page biar konsisten)
    $paginator = $query->paginate($perPage, ['*'], 'page', $page);

    return response()->json($paginator);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => ['required', 'string', 'max:100', 'unique:products,sku'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'price_default' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }
    
    public function show(Product $product)
    {
        return response()->json([
            'data' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => ['sometimes', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'price_default' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->fresh()
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
