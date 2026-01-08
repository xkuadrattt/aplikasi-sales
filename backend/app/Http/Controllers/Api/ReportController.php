<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\SalesOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
   public function daily(Request $request)
   {
       $data = SalesOrder::select(
           DB::raw('DATE(order_date) as date'),
           DB::raw('COUNT(id) as total_orders'),
           DB::raw('SUM(total) as total')
       )
       ->where('status','paid')
       ->whereBetween('order_date', [$request->from, $request->to])
       ->groupBy('date')
       ->orderBy('date')
       ->get();

       return response()->json([
           'data' => $data
       ]);
   }

   public function sales(Request $request)
   {
       $data = SalesOrder::select(
        'user_id',
        DB::raw('COUNT(id) as order_count'),
        DB::raw('SUM(total) as total')
       )
       ->where('status', 'paid')
       ->whereBetween('order_date', [$request->from, $request->to])
       ->groupBy('user_id')
       ->with('user:id,name')
       ->get();

       return response()->json([
           'data' => $data
       ]);
   }
   public function products(Request $request)
   {
       $data = SalesOrderItem::select(
        'product_id',
        DB::raw('SUM(qty) as units'),
        DB::raw('SUM(subtotal) as revenue')
       )
       ->whereHas('order', function($q) use ($request) {
           $q->where('status', 'paid')
             ->whereBetween('order_date', [$request->from, $request->to]);
       })
       ->groupBy('product_id')
       ->with('product:id,name,sku')
       ->get();

       return response()->json([
           'data' => $data
       ]);
   }
}