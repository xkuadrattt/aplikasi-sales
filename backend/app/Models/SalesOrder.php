<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesOrder extends Model
{
    protected $fillable = [
        'invoice_no','order_date','user_id','customer_id',
        'payment_method','status','subtotal','discount','total','notes'
    ];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SalesOrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
