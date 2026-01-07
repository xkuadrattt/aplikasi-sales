<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use App\Models\Customer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = SalesOrder::with('user')
        -> when($request->from,fn($q)=>$q->whereDate('order_date','>=',$request->from))
        -> when($request->to,fn($q)=>$q->whereDate('order_date','<=',$request->to))
        -> when($request->status,fn($q)=>$q->where('status',$request->status))
        -> orderByDesc('order_date');

        return response()->json([
            'data' => $query->get()
        ]);
    }

    public function show($id)
    {
        $order = SalesOrder::with(['items.product','customer'])->findOrFail($id);

        return response()->json([
            'data' => $order
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_date' => 'required|date',
            'payment_method' => 'required|in:cash,transfer',
            'discount' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'customer.name' => 'nullable|string',
            'customer.phone' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|integer|min:0',
        ]);

        return DB::transaction(function () use ($data) {

            $customerId = null;
            if (!empty($data['customer']['name'])) {
                $customer = Customer::firstOrCreate(
                    ['phone' => $data['customer']['phone'] ?? null],
                    ['name' => $data['customer']['name']]
                );
                $customerId = $customer->id;
            }

            $subtotal = 0;

            foreach ($data['items'] as $item) {
                $subtotal += $item['qty'] * $item['price'];
            }

            $discount = $data['discount'] ?? 0;
            $total = max($subtotal - $discount, 0);

            $order = SalesOrder::create([
                'invoice_no' => $this->generateInvoiceNo(),
                'order_date' => $data['order_date'],
                'user_id' => 1, // sementara hardcode
                'customer_id' => $customerId,
                'payment_method' => $data['payment_method'],
                'status' => 'paid',
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                SalesOrderItem::create([
                    'sales_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'qty' => $item['qty'],
                    'price' => $item['price'],
                    'line_total' => $item['qty'] * $item['price'],
                ]);
            }

            return response()->json(['data' => $order], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $order = SalesOrder::findOrFail($id);

        $data = $request->validate([
            'status' => 'in:paid,draft,canceled',
            'notes' => 'nullable|string'
        ]);

        $order->update($data);

        return response()->json(['data' => $order]);
    }

    private function generateInvoiceNo(): string
    {
        $date = Carbon::now()->format('Ymd');
        $count = SalesOrder::whereDate('created_at', Carbon::today())->count() + 1;
        return 'SO-' . $date . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
    }
}