# Endpoint Documentation

## POST /auth/login

Request:

```json
{ "email": "sales@toko.com", "password": "secret" }
```

Response:

```json
{ "data": { "token": "..." , "user": { "id": 2, "name": "Sales A", "role": "sales" } } }
```

## Get /me

Header: Authorization: Bearer <token>
Response:

```json
{ "data": { "id": 2, "name": "Sales A", "role": "sales" } }
```

## Get /products
Query (opsional):

active=1

Response:
```json
{
  "data": [
    { "id": 1, "sku": "ACR-SW14", "name": "Acer Swift Lite 14", "price_default": 7999000, "is_active": true }
  ]
}
```

## POST /products
Role : admin

Request:
```json
{ "sku": "ACR-NL16", "name": "Acer Nitro Lite 16", "price_default": 12999000, "category": "laptop" }
```

## Get /orders

Query:

from=2026-01-01
to=2026-01-31
status=paid|draft|canceled (optional)
user_id=2 (optional; admin only)

Response (list):
```json
{
  "data": [
    {
      "id": 10,
      "invoice_no": "SO-20260106-0001",
      "order_date": "2026-01-06T14:00:00+07:00",
      "user": { "id": 2, "name": "Sales A" },
      "payment_method": "cash",
      "status": "paid",
      "subtotal": 7999000,
      "discount": 0,
      "total": 7999000
    }
  ],
  "meta": { "from": "2026-01-01", "to": "2026-01-31" }
}
```

## POST /orders
Request:

```json
{
  "order_date": "2026-01-06 14:00:00",
  "customer": { "name": "Budi", "phone": "0812xxxx" },
  "payment_method": "cash",
  "discount": 50000,
  "notes": "bonus mouse",
  "items": [
    { "product_id": 1, "qty": 1, "price": 7999000 },
    { "product_id": 5, "qty": 1, "price": 199000 }
  ]
}
```
Rules validasi minimal:

payment_method in [cash, transfer]
items min 1
qty >= 1
price >= 0
discount >= 0

Response:

```json
{
  "data": {
    "id": 10,
    "invoice_no": "SO-20260106-0001",
    "status": "paid",
    "subtotal": 8198000,
    "discount": 50000,
    "total": 8148000
  }
}
```

## GET /orders/{id}

Response:

```json
{
  "data": {
    "id": 10,
    "invoice_no": "SO-20260106-0001",
    "order_date": "2026-01-06T14:00:00+07:00",
    "user": { "id": 2, "name": "Sales A" },
    "customer": { "id": 7, "name": "Budi", "phone": "0812xxxx" },
    "payment_method": "cash",
    "status": "paid",
    "subtotal": 8198000,
    "discount": 50000,
    "total": 8148000,
    "notes": "bonus mouse",
    "items": [
      { "product_id": 1, "name": "Acer Swift Lite 14", "qty": 1, "price": 7999000, "line_total": 7999000 },
      { "product_id": 5, "name": "Mouse", "qty": 1, "price": 199000, "line_total": 199000 }
    ]
  }
}
```

