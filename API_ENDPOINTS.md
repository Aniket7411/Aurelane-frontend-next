# 🚀 Complete API Endpoints Documentation

## Base URL
```
Production: https://gems-backend-zfpw.onrender.com/api
Local: http://localhost:5000/api
```

---

## 📚 Table of Contents
1. [Authentication APIs](#1-authentication-apis)
2. [Gem Management APIs](#2-gem-management-apis)
3. [Cart APIs](#3-cart-apis)
4. [Order APIs](#4-order-apis)
5. [Payment APIs](#5-payment-apis)
6. [Seller Profile APIs](#6-seller-profile-apis)
7. [User Profile APIs](#7-user-profile-apis)
8. [Wishlist APIs](#8-wishlist-apis)
9. [Review APIs](#9-review-apis)
10. [Admin APIs](#10-admin-apis)
11. [OTP APIs](#11-otp-apis)
12. [Utility APIs](#12-utility-apis)

---

## 1. AUTHENTICATION APIs

### 1.1 User Signup
**Endpoint**: `POST /api/auth/signup`  
**Access**: Public  
**Description**: Register a new user (buyer or seller)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "role": "buyer"
}
```

**Field Validation**:
- `name`: String, required, 2-50 characters
- `email`: String, required, valid email format
- `password`: String, required, min 6 characters
- `phoneNumber`: String, optional, 10 digits
- `role`: String, optional, enum: `["buyer", "seller"]`, default: `"buyer"`

**Success Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "role": "buyer"
  }
}
```

**Error Response (400)**:
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 1.2 User Register (Alternative)
**Endpoint**: `POST /api/auth/register`  
**Access**: Public  
**Description**: Alternative registration endpoint

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

**Note**: Similar to signup but uses `phone` instead of `phoneNumber`

---

### 1.3 User Login
**Endpoint**: `POST /api/auth/login`  
**Access**: Public  
**Description**: Login user (buyer, seller, or admin)

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "buyer"
  }
}
```

---

### 1.4 Admin Login
**Endpoint**: `POST /api/auth/admin/login`  
**Access**: Public  
**Description**: Login as admin

**Request Body**:
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```

---

### 1.5 Get Current User
**Endpoint**: `GET /api/auth/me`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

### 1.6 Get User Profile
**Endpoint**: `GET /api/auth/profile`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "buyer",
    "address": {},
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 1.7 Update User Profile
**Endpoint**: `PUT /api/auth/profile`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "9876543210",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 1.8 Change Password
**Endpoint**: `PUT /api/auth/change-password`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 1.9 Forgot Password
**Endpoint**: `POST /api/auth/forgot-password`  
**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password reset email sent successfully! Check your inbox."
}
```

---

### 1.10 Reset Password
**Endpoint**: `POST /api/auth/reset-password/:token` or `PUT /api/auth/reset-password/:token`  
**Access**: Public

**Request Body**:
```json
{
  "password": "newpassword123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Note**: Both POST and PUT methods are supported for frontend compatibility.

---

### 1.10.1 Get Reset Password Token (Redirect)
**Endpoint**: `GET /api/auth/reset-password/:token`  
**Access**: Public  
**Description**: Validates reset token and redirects to frontend reset password page

**Success**: Redirects to frontend with token: `${CLIENT_URL}/reset-password?token=${token}`  
**Error**: Redirects with error: `${CLIENT_URL}/reset-password?error=invalid_token`

---

---

### 1.11 Verify Email
**Endpoint**: `GET /api/auth/verify-email/:token`  
**Access**: Public

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## 2. GEM MANAGEMENT APIs

### 2.1 Get All Gems
**Endpoint**: `GET /api/gems`  
**Access**: Public  
**Description**: Get all gems with filters, search, pagination

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 12, max: 50)
- `search`: String - Search in name, description, planet, etc.
- `category`: String - Filter by category
- `subcategory`: String - Filter by subcategory
- `zodiac`: String - Filter by zodiac sign
- `planet`: String - Filter by planet
- `birthMonth`: String - Filter by birth month
- `minPrice`: Number - Minimum price
- `maxPrice`: Number - Maximum price
- `sort`: String - Sort option: `newest`, `oldest`, `price-low`, `price-high`, `name`
- `availability`: Boolean - Filter by availability
- `inStock`: Boolean - Filter in stock items
- `lowStock`: Boolean - Filter low stock items
- `outOfStock`: Boolean - Filter out of stock items

**Example Request**:
```
GET /api/gems?page=1&limit=12&search=emerald&planet=Mercury&minPrice=1000&maxPrice=100000&sort=newest
```

**Success Response (200)**:
```json
{
  "success": true,
  "gems": [...],
  "pagination": {
    "totalItems": 45,
    "totalGems": 45,
    "totalPages": 4,
    "currentPage": 1,
    "hasNext": true,
    "hasPrev": false,
    "limit": 12
  }
}
```

---

### 2.2 Get Single Gem
**Endpoint**: `GET /api/gems/:id`  
**Access**: Public

**Success Response (200)**:
```json
{
  "success": true,
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Emerald",
    "hindiName": "Panna (पन्ना)",
    "category": "Emerald",
    "subcategory": "Natural",
    "planet": "Mercury (Budh)",
    "planetHindi": "बुध ग्रह",
    "color": "Green",
    "price": 50000,
    "stock": 10,
    "availability": true,
    "heroImage": "https://...",
    "images": ["https://..."],
    "seller": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Raj Kumar Gems",
      "shopName": "Raj Gems Store",
      "isVerified": true
    },
    "relatedProducts": [...]
  }
}
```

---

### 2.3 Get Gem Categories
**Endpoint**: `GET /api/gems/categories`  
**Access**: Public

**Success Response (200)**:
```json
{
  "success": true,
  "data": ["Ruby", "Emerald", "Blue Sapphire", "Yellow Sapphire", "Diamond", "Pearl", "Red Coral", "Cat's Eye", "Hessonite"],
  "categories": ["Ruby", "Emerald", "Blue Sapphire", "Yellow Sapphire", "Diamond", "Pearl", "Red Coral", "Cat's Eye", "Hessonite"]
}
```

---

### 2.4 Get Gems by Category
**Endpoint**: `GET /api/gems/category/:categoryName`  
**Access**: Public

**Example**: `GET /api/gems/category/Ruby`

---

### 2.5 Get Gems by Zodiac
**Endpoint**: `GET /api/gems/zodiac/:sign`  
**Access**: Public

**Example**: `GET /api/gems/zodiac/aries`

**Alternative Endpoint**: `GET /api/gems/filter/zodiac/:zodiacSign` (Legacy - filters only available gems)

---

### 2.6 Search Suggestions
**Endpoint**: `GET /api/gems/search-suggestions`  
**Access**: Public

**Query Parameters**:
- `q` or `search`: String (min 2 characters)

**Success Response (200)**:
```json
{
  "success": true,
  "suggestions": [
    {
      "type": "name",
      "value": "Emerald",
      "label": "Emerald (पन्ना)",
      "gemId": "507f1f77bcf86cd799439011"
    },
    {
      "type": "planet",
      "value": "Mercury",
      "label": "Planet: Mercury",
      "icon": "🪐"
    }
  ]
}
```

---

### 2.7 Add New Gem
**Endpoint**: `POST /api/gems`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Emerald",
  "hindiName": "पन्ना",
  "category": "Emerald",
  "subcategory": "Natural",
  "planet": "Mercury (Budh)",
  "planetHindi": "बुध ग्रह",
  "color": "Green",
  "description": "Beautiful natural emerald",
  "benefits": ["Enhances intelligence", "Improves communication"],
  "suitableFor": ["Teachers", "Lawyers"],
  "price": 50000,
  "sizeWeight": 5.5,
  "sizeUnit": "carat",
  "stock": 10,
  "certification": "Govt. Lab Certified",
  "origin": "Sri Lanka",
  "deliveryDays": 7,
  "heroImage": "https://...",
  "gstCategory": "cut_polished",
  "contactForPrice": false
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Gem added successfully",
  "gem": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Emerald",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2.8 Get Seller's Gems
**Endpoint**: `GET /api/gems/my-gems`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "gems": [...]
}
```

---

### 2.9 Get Gem for Editing
**Endpoint**: `GET /api/gems/edit/:id`  
**Access**: Protected (Seller only - Own gems)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "gem": {...}
}
```

---

### 2.10 Update Gem
**Endpoint**: `PUT /api/gems/:id`  
**Access**: Protected (Seller only - Own gems)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as Add Gem (all fields optional)

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Gem updated successfully",
  "gem": {...}
}
```

---

### 2.11 Delete Gem
**Endpoint**: `DELETE /api/gems/:id`  
**Access**: Protected (Seller only - Own gems)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Gem deleted successfully"
}
```

---

### 2.12 Get Gems by Planet
**Endpoint**: `GET /api/gems/filter/planet/:planet`  
**Access**: Public

**Example**: `GET /api/gems/filter/planet/Mercury`

**Query Parameters**: Supports all standard gem filters (page, limit, search, category, etc.)

**Success Response (200)**:
```json
{
  "success": true,
  "count": 25,
  "totalPages": 3,
  "currentPage": 1,
  "planet": "Mercury",
  "gems": [...],
  "pagination": {...}
}
```

---

## 3. CART APIs

### 3.1 Add to Cart
**Endpoint**: `POST /api/cart/add`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "gemId": "507f1f77bcf86cd799439011",
  "quantity": 1
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItem": {
    "_id": "507f1f77bcf86cd799439012",
    "gemId": "507f1f77bcf86cd799439011",
    "quantity": 1
  }
}
```

---

### 3.2 Get Cart
**Endpoint**: `GET /api/cart`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "cart": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "gem": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Emerald",
        "category": "Emerald",
        "subcategory": "Natural",
        "price": 50000,
        "images": ["https://..."]
      },
      "quantity": 1
    }
  ],
  "total": 50000
}
```

---

### 3.3 Update Cart Item
**Endpoint**: `PUT /api/cart/update/:gemId`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "quantity": 2
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Cart updated successfully"
}
```

---

### 3.4 Remove from Cart
**Endpoint**: `DELETE /api/cart/remove/:gemId`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### 3.5 Clear Cart
**Endpoint**: `DELETE /api/cart/clear`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

---

## 4. ORDER APIs

### 4.1 Create Order
**Endpoint**: `POST /api/orders`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "items": [
    {
      "gem": "507f1f77bcf86cd799439011",
      "quantity": 1,
      "price": 50000,
      "gstCategory": "cut_polished"
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "totalPrice": 50000
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "totalPrice": 50000,
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.2 Get Buyer's Orders
**Endpoint**: `GET /api/orders/my-orders` or `GET /api/orders`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Note**: `GET /api/orders` is an alias for `GET /api/orders/my-orders` and provides the same functionality.

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)
- `status`: String - Filter by status

**Success Response (200)**:
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "orderNumber": "ORD-20240101-001",
      "orderDate": "2024-01-01T00:00:00.000Z",
      "status": "pending",
      "paymentStatus": "pending",
      "paymentMethod": "COD",
      "totalAmount": 50000,
      "deliveryDays": 7,
      "expectedDelivery": "2024-01-08T00:00:00.000Z",
      "items": [...],
      "shippingAddress": {...}
    }
  ]
}
```

---

### 4.3 Get Single Order
**Endpoint**: `GET /api/orders/:id`  
**Access**: Protected (Buyer, Seller, or Admin)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "order": {...}
}
```

---

### 4.4 Cancel Order
**Endpoint**: `PUT /api/orders/:id/cancel`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body** (optional):
```json
{
  "reason": "Changed my mind"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.5 Get Seller's Orders
**Endpoint**: `GET /api/orders/seller/orders`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `status`: String - Filter by status
- `paymentStatus`: String - Filter by payment status

**Success Response (200)**:
```json
{
  "success": true,
  "count": 10,
  "total": 10,
  "orders": [...],
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalPages": 1,
    "total": 10
  }
}
```

---

### 4.6 Get Seller Order Statistics
**Endpoint**: `GET /api/orders/seller/orders/stats`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalOrders": 50,
    "pendingOrders": 5,
    "processingOrders": 10,
    "shippedOrders": 15,
    "deliveredOrders": 18,
    "cancelledOrders": 2,
    "totalRevenue": 2500000,
    "pendingRevenue": 250000,
    "completedRevenue": 1800000
  }
}
```

---

### 4.7 Get Seller Order by ID
**Endpoint**: `GET /api/orders/seller/orders/:orderId`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "buyer": {
      "_id": "507f1f77bcf86cd799439014",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "items": [...],
    "totalPrice": 50000,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": {...},
    "statusHistory": [...]
  }
}
```

---

### 4.8 Update Order Status (Seller)
**Endpoint**: `PUT /api/orders/:id/status`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Valid Status Values**: `pending`, `processing`, `shipped`, `cancelled`  
**Note**: Sellers cannot set status to `delivered` (admin only)

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "status": "shipped",
    "trackingNumber": "TRACK123456",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4.9 Get Order Tracking Details
**Endpoint**: `GET /api/orders/:id/track`  
**Access**: Protected (Buyer, Seller, or Admin)  
**Headers**: `Authorization: Bearer <token>`

**Description**: Get detailed tracking information for an order including status history and tracking details.

**Success Response (200)**:
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "status": "shipped",
    "trackingNumber": "TRACK123456",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-02T00:00:00.000Z"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-03T00:00:00.000Z"
      }
    ],
    "shippingAddress": {...},
    "expectedDelivery": "2024-01-08T00:00:00.000Z"
  }
}
```

---

### 4.10 Get Order Invoice
**Endpoint**: `GET /api/orders/:id/invoice`  
**Access**: Protected (Buyer, Seller, or Admin)  
**Headers**: `Authorization: Bearer <token>`

**Description**: Download order invoice as PDF or blob file.

**Response**: Returns invoice file (PDF/blob format)

**Note**: Frontend code uses this endpoint. Ensure backend implementation returns invoice file.

---

## 5. PAYMENT APIs

### 5.1 Create Payment Order
**Endpoint**: `POST /api/payments/create-order`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**: Same as Create Order (see 4.1)

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "totalPrice": 50000,
    "status": "pending",
    "paymentStatus": "pending"
  },
  "razorpayOrder": {
    "id": "order_ABC123",
    "amount": 5000000,
    "currency": "INR",
    "receipt": "ORD-20240101-001",
    "status": "created"
  },
  "keyId": "rzp_test_..."
}
```

---

### 5.2 Verify Payment
**Endpoint**: `POST /api/payments/verify-payment`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "signature_hash",
  "orderId": "507f1f77bcf86cd799439013"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "totalPrice": 50000,
    "status": "processing",
    "paymentStatus": "completed"
  }
}
```

---

### 5.3 Get Order Payment Status
**Endpoint**: `GET /api/payments/order-status/:orderId`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-20240101-001",
    "paymentStatus": "completed",
    "status": "processing",
    "razorpayOrderId": "order_ABC123",
    "razorpayPaymentId": "pay_XYZ789",
    "totalPrice": 50000
  }
}
```

---

### 5.4 Cancel Pending Payment Order
**Endpoint**: `DELETE /api/payments/cancel-pending-order`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Pending payment orders cancelled successfully",
  "deletedCount": 1
}
```

---

### 5.5 Razorpay Webhook
**Endpoint**: `POST /api/payments/webhook`  
**Access**: Public (Razorpay calls this)  
**Headers**: `X-Razorpay-Signature: <signature>`

**Description**: Webhook endpoint for Razorpay payment events. Handles `payment.captured` and `payment.failed` events automatically.

**Note**: This endpoint is called by Razorpay, not by your application. Configure this URL in your Razorpay dashboard.

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Webhook processed"
}
```

---

## 6. SELLER PROFILE APIs

### 6.1 Get Seller Profile
**Endpoint**: `GET /api/seller/profile`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "seller": {
    "_id": "507f1f77bcf86cd799439015",
    "user": "507f1f77bcf86cd799439011",
    "fullName": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "9876543210",
    "shopName": "Raj Gems Store",
    "shopType": "Retail",
    "businessType": "Sole Proprietorship",
    "address": {
      "street": "123 Gem Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "gstNumber": "27ABCDE1234F1Z5",
    "panNumber": "ABCDE1234F",
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6.2 Create/Update Seller Profile
**Endpoint**: `PUT /api/seller/profile`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "fullName": "Raj Kumar",
  "email": "raj@example.com",
  "phone": "9876543210",
  "shopName": "Raj Gems Store",
  "shopType": "Retail",
  "businessType": "Sole Proprietorship",
  "address": {
    "street": "123 Gem Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "gstNumber": "27ABCDE1234F1Z5",
  "panNumber": "ABCDE1234F",
  "aadharNumber": "1234 5678 9012",
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "accountHolderName": "Raj Kumar",
  "businessDescription": "Premium gemstones",
  "specialization": ["Emeralds", "Rubies"],
  "gemTypes": ["Natural", "Certified"],
  "website": "https://rajgems.com",
  "instagram": "@rajgems",
  "facebook": "rajgemsstore",
  "documentsUploaded": true
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Seller profile updated successfully",
  "seller": {...}
}
```

---

### 6.3 Get Seller Orders
**Endpoint**: `GET /api/seller/orders`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**: Same as 4.5

---

### 6.4 Get Seller Order Statistics
**Endpoint**: `GET /api/seller/orders/stats`  
**Access**: Protected (Seller only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalOrders": 50,
    "totalRevenue": 2500000,
    "ordersByStatus": {
      "pending": 5,
      "processing": 10,
      "shipped": 15,
      "delivered": 18,
      "cancelled": 2
    },
    "revenueByStatus": {...},
    "recentOrders": 10,
    "recentRevenue": 500000,
    "monthlyRevenue": [
      {
        "month": "Jan 2024",
        "revenue": 500000,
        "orders": 10
      }
    ],
    "averageOrderValue": 50000
  }
}
```

---

## 7. USER PROFILE APIs

### 7.1 Get User Profile
**Endpoint**: `GET /api/user/profile`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "9876543210",
    "role": "buyer",
    "address": {},
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7.2 Update User Profile
**Endpoint**: `PUT /api/user/profile`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "John Updated",
  "phoneNumber": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}
```

---

### 7.3 Get User Addresses
**Endpoint**: `GET /api/user/addresses`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "label": "Home",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India",
      "isPrimary": true
    }
  ]
}
```

---

### 7.4 Add Address
**Endpoint**: `POST /api/user/addresses`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "label": "Home",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "isPrimary": true
}
```

---

### 7.5 Update Address
**Endpoint**: `PUT /api/user/addresses/:addressId`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

---

### 7.6 Delete Address
**Endpoint**: `DELETE /api/user/addresses/:addressId`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

---

### 7.7 Set Primary Address
**Endpoint**: `PUT /api/user/addresses/:addressId/primary`  
**Access**: Protected (Buyer only)  
**Headers**: `Authorization: Bearer <token>`

---

## 8. WISHLIST APIs

### 8.1 Add to Wishlist
**Endpoint**: `POST /api/wishlist/add`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "gemId": "507f1f77bcf86cd799439011"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Item added to wishlist",
  "wishlist": {...}
}
```

---

### 8.2 Get Wishlist
**Endpoint**: `GET /api/wishlist`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "gem": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Emerald",
        "price": 50000,
        "heroImage": "https://...",
        "stock": 10,
        "availability": true
      }
    }
  ],
  "totalItems": 1
}
```

---

### 8.3 Remove from Wishlist
**Endpoint**: `DELETE /api/wishlist/remove/:gemId`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

---

### 8.4 Check if in Wishlist
**Endpoint**: `GET /api/wishlist/check/:gemId`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "isInWishlist": true
}
```

---

### 8.5 Clear Wishlist
**Endpoint**: `DELETE /api/wishlist/clear`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

---

### 8.6 Get Wishlist Count
**Endpoint**: `GET /api/wishlist/count`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "count": 5
}
```

---

## 9. REVIEW APIs

### 9.1 Submit Review
**Endpoint**: `POST /api/reviews/:gemId`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Excellent quality gem!"
}
```

**Success Response (201)**:
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "review": {
    "_id": "507f1f77bcf86cd799439018",
    "gemId": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439014",
    "rating": 5,
    "comment": "Excellent quality gem!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 9.2 Get Gem Reviews
**Endpoint**: `GET /api/reviews/gem/:gemId`  
**Access**: Public

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 10)
- `sort`: String - `createdAt` or `rating`

**Success Response (200)**:
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439018",
      "gemId": "507f1f77bcf86cd799439011",
      "user": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "John Doe"
      },
      "rating": 5,
      "comment": "Excellent quality gem!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 10
}
```

---

### 9.3 Get User's Reviews
**Endpoint**: `GET /api/reviews/user`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

---

### 9.4 Update Review
**Endpoint**: `PUT /api/reviews/:reviewId`  
**Access**: Protected (Review owner only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

---

### 9.5 Delete Review
**Endpoint**: `DELETE /api/reviews/:reviewId`  
**Access**: Protected (Review owner only)  
**Headers**: `Authorization: Bearer <token>`

---

### 9.6 Check if User Reviewed
**Endpoint**: `GET /api/reviews/check/:gemId`  
**Access**: Protected (All roles)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "hasReviewed": true,
  "review": {
    "_id": "507f1f77bcf86cd799439018",
    "rating": 5,
    "comment": "Excellent quality gem!"
  }
}
```

---

## 10. ADMIN APIs

### 10.1 Get All Sellers
**Endpoint**: `GET /api/admin/sellers`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `search`: String - Search by name, email, shop name
- `status`: String - Filter by status: `active`, `pending`, `suspended`, `blocked`

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "sellers": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "name": "Raj Kumar",
        "fullName": "Raj Kumar",
        "email": "raj@example.com",
        "phone": "9876543210",
        "shopName": "Raj Gems Store",
        "status": "approved",
        "isBlocked": false,
        "isVerified": true,
        "rating": 4.5,
        "totalGems": 50,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

---

### 10.2 Get Seller Details
**Endpoint**: `GET /api/admin/sellers/:sellerId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.3 Verify Seller
**Endpoint**: `PUT /api/admin/sellers/:sellerId/verify`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "isVerified": true
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Seller verification status updated successfully",
  "seller": {
    "_id": "507f1f77bcf86cd799439015",
    "isVerified": true,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 10.4 Update Seller Status
**Endpoint**: `PUT /api/admin/sellers/:sellerId/status`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "approved",
  "suspensionReason": "Optional reason"
}
```

**Valid Status Values**: `pending`, `approved`, `rejected`, `suspended`, `active`

---

### 10.5 Block Seller
**Endpoint**: `PUT /api/admin/sellers/:sellerId/block`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.6 Unblock Seller
**Endpoint**: `PUT /api/admin/sellers/:sellerId/unblock`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.7 Delete Seller
**Endpoint**: `DELETE /api/admin/sellers/:sellerId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.8 Get All Orders
**Endpoint**: `GET /api/admin/orders`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `search`: String - Search by order number
- `status`: String - Filter by status

---

### 10.9 Get Order Details
**Endpoint**: `GET /api/admin/orders/:orderId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.10 Update Order Status (Admin)
**Endpoint**: `PUT /api/admin/orders/:orderId/status`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "delivered",
  "trackingNumber": "TRACK123456"
}
```

**Valid Status Values**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`  
**Note**: Only admin can set status to `delivered`

---

### 10.11 Get All Gems/Products
**Endpoint**: `GET /api/admin/gems` or `GET /api/admin/products`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `search`: String - Search by name
- `category`: String - Filter by category
- `subcategory`: String - Filter by subcategory
- `sellerId`: String - Filter by seller
- `status`: String - Filter by status: `active`, `inactive`

---

### 10.12 Get Product Details
**Endpoint**: `GET /api/admin/products/:productId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.13 Delete Product
**Endpoint**: `DELETE /api/admin/products/:productId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.14 Get All Buyers
**Endpoint**: `GET /api/admin/buyers`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Number (default: 1)
- `limit`: Number (default: 20)
- `search`: String - Search by name, email, phone
- `status`: String - Filter by status: `active`, `blocked`

---

### 10.15 Get Buyer Details
**Endpoint**: `GET /api/admin/buyers/:buyerId`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.16 Block Buyer
**Endpoint**: `PUT /api/admin/buyers/:buyerId/block`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.17 Unblock Buyer
**Endpoint**: `PUT /api/admin/buyers/:buyerId/unblock`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

---

### 10.18 Get Dashboard Statistics
**Endpoint**: `GET /api/admin/dashboard/stats`  
**Access**: Protected (Admin only)  
**Headers**: `Authorization: Bearer <token>`

**Success Response (200)**:
```json
{
  "success": true,
  "stats": {
    "totalBuyers": 1000,
    "totalSellers": 100,
    "totalProducts": 5000,
    "totalOrders": 500,
    "blockedBuyers": 10,
    "blockedSellers": 5,
    "pendingOrders": 20,
    "totalRevenue": 50000000,
    "ordersByStatus": {
      "pending": 20,
      "processing": 50,
      "shipped": 100,
      "delivered": 300,
      "cancelled": 30
    },
    "recentActivity": {
      "buyers": 50,
      "sellers": 5,
      "orders": 100,
      "revenue": 5000000
    },
    "monthlyRevenue": [
      {
        "month": "Jan 2024",
        "revenue": 10000000,
        "orders": 200
      }
    ],
    "averageOrderValue": 100000
  }
}
```

---

## 11. OTP APIs

### 11.1 Send OTP
**Endpoint**: `POST /api/otp/send`  
**Access**: Public

**Request Body**:
```json
{
  "phoneNumber": "+919876543210"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "sessionId": "session_abc123",
    "expiresAt": "2024-01-01T00:05:00.000Z"
  }
}
```

---

### 11.2 Verify OTP
**Endpoint**: `POST /api/otp/verify`  
**Access**: Public

**Request Body**:
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456",
  "sessionId": "session_abc123"
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "tempToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-01-01T00:30:00.000Z"
  }
}
```

---

## 12. UTILITY APIs

### 12.1 Health Check
**Endpoint**: `GET /api/health`  
**Access**: Public

**Success Response (200)**:
```json
{
  "success": true,
  "message": "Server is running",
  "database": {
    "status": "connected",
    "connected": true
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from:
- `/api/auth/signup` - Returns token on successful registration
- `/api/auth/login` - Returns token on successful login
- `/api/auth/admin/login` - Returns token on successful admin login

---

## 📝 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "description": "Detailed error description"
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid_value",
      "msg": "Error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

---

## 🎯 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (Validation errors)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📌 Important Notes

1. **Base URL**: Use `http://localhost:5000/api` for local development
2. **Pagination**: Most list endpoints support `page` and `limit` query parameters
3. **Filtering**: Many endpoints support multiple filter options via query parameters
4. **GST Calculation**: Orders automatically calculate GST based on `gstCategory` field
5. **Stock Management**: Stock is reduced automatically on order creation (COD) or payment verification (Online)
6. **Image URLs**: All image fields return Cloudinary URLs or full image paths
7. **Date Formats**: All dates are in ISO 8601 format (UTC)

---

## 🔑 Admin Credentials

**Default Admin Account**:
- Email: `admin@admin.com`
- Password: `admin123`

**To create admin user**:
```bash
node createAdmin.js
```

---

## 📞 Support

For API support or questions, please refer to the project documentation or contact the development team.

---

## 📊 Complete Endpoint Summary

### Total Endpoints: **87+**

#### 1. Authentication APIs (13 endpoints)
1. `POST /api/auth/signup` - User signup
2. `POST /api/auth/register` - Alternative registration
3. `POST /api/auth/login` - User login
4. `POST /api/auth/admin/login` - Admin login
5. `GET /api/auth/me` - Get current user
6. `GET /api/auth/profile` - Get user profile
7. `PUT /api/auth/profile` - Update user profile
8. `PUT /api/auth/change-password` - Change password
9. `POST /api/auth/forgot-password` - Forgot password
10. `GET /api/auth/reset-password/:token` - Get reset token (redirect)
11. `POST /api/auth/reset-password/:token` - Reset password (POST)
12. `PUT /api/auth/reset-password/:token` - Reset password (PUT)
13. `GET /api/auth/verify-email/:token` - Verify email

#### 2. Gem Management APIs (13 endpoints)
1. `GET /api/gems` - Get all gems with filters
2. `GET /api/gems/:id` - Get single gem
3. `POST /api/gems` - Add new gem (Seller)
4. `PUT /api/gems/:id` - Update gem (Seller)
5. `DELETE /api/gems/:id` - Delete gem (Seller)
6. `GET /api/gems/my-gems` - Get seller's gems
7. `GET /api/gems/edit/:id` - Get gem for editing
8. `GET /api/gems/categories` - Get categories
9. `GET /api/gems/category/:categoryName` - Get gems by category
10. `GET /api/gems/zodiac/:sign` - Get gems by zodiac
11. `GET /api/gems/filter/zodiac/:zodiacSign` - Filter gems by zodiac (legacy)
12. `GET /api/gems/filter/planet/:planet` - Get gems by planet
13. `GET /api/gems/search-suggestions` - Get search suggestions

#### 3. Cart APIs (5 endpoints)
1. `POST /api/cart/add` - Add to cart
2. `GET /api/cart` - Get cart
3. `PUT /api/cart/update/:gemId` - Update cart item
4. `DELETE /api/cart/remove/:gemId` - Remove from cart
5. `DELETE /api/cart/clear` - Clear cart

#### 4. Order APIs (11 endpoints)
1. `POST /api/orders` - Create order
2. `GET /api/orders` - Get buyer's orders (alias)
3. `GET /api/orders/my-orders` - Get buyer's orders
4. `GET /api/orders/:id` - Get single order
5. `PUT /api/orders/:id/cancel` - Cancel order
6. `GET /api/orders/seller/orders` - Get seller's orders
7. `GET /api/orders/seller/orders/stats` - Get seller order statistics
8. `GET /api/orders/seller/orders/:orderId` - Get seller order by ID
9. `PUT /api/orders/:id/status` - Update order status (Seller)
10. `GET /api/orders/:id/track` - Get order tracking details
11. `GET /api/orders/:id/invoice` - Get order invoice

#### 5. Payment APIs (6 endpoints)
1. `POST /api/payments/create-order` - Create Razorpay order
2. `POST /api/payments/verify-payment` - Verify payment
3. `GET /api/payments/order-status/:orderId` - Get payment status
4. `DELETE /api/payments/cancel-pending-order` - Cancel pending orders
5. `POST /api/payments/webhook` - Razorpay webhook (Public)

#### 6. Seller Profile APIs (4 endpoints)
1. `GET /api/seller/profile` - Get seller profile
2. `PUT /api/seller/profile` - Create/Update seller profile
3. `GET /api/seller/orders` - Get seller orders
4. `GET /api/seller/orders/stats` - Get seller order statistics

#### 7. User Profile APIs (7 endpoints)
1. `GET /api/user/profile` - Get user profile
2. `PUT /api/user/profile` - Update user profile
3. `GET /api/user/addresses` - Get user addresses
4. `POST /api/user/addresses` - Add address
5. `PUT /api/user/addresses/:addressId` - Update address
6. `DELETE /api/user/addresses/:addressId` - Delete address
7. `PUT /api/user/addresses/:addressId/primary` - Set primary address

#### 8. Wishlist APIs (6 endpoints)
1. `POST /api/wishlist/add` - Add to wishlist
2. `GET /api/wishlist` - Get wishlist
3. `DELETE /api/wishlist/remove/:gemId` - Remove from wishlist
4. `GET /api/wishlist/check/:gemId` - Check if in wishlist
5. `DELETE /api/wishlist/clear` - Clear wishlist
6. `GET /api/wishlist/count` - Get wishlist count

#### 9. Review APIs (6 endpoints)
1. `POST /api/reviews/:gemId` - Submit review
2. `GET /api/reviews/gem/:gemId` - Get gem reviews
3. `GET /api/reviews/user` - Get user's reviews
4. `PUT /api/reviews/:reviewId` - Update review
5. `DELETE /api/reviews/:reviewId` - Delete review
6. `GET /api/reviews/check/:gemId` - Check if user reviewed

#### 10. Admin APIs (19 endpoints)
1. `GET /api/admin/sellers` - Get all sellers
2. `GET /api/admin/sellers/:sellerId` - Get seller details
3. `PUT /api/admin/sellers/:sellerId/verify` - Verify seller (set verification status)
4. `PUT /api/admin/sellers/:sellerId/status` - Update seller status
5. `PUT /api/admin/sellers/:sellerId/block` - Block seller
6. `PUT /api/admin/sellers/:sellerId/unblock` - Unblock seller
7. `DELETE /api/admin/sellers/:sellerId` - Delete seller
8. `GET /api/admin/orders` - Get all orders
9. `GET /api/admin/orders/:orderId` - Get order details
10. `PUT /api/admin/orders/:orderId/status` - Update order status (Admin)
11. `GET /api/admin/gems` - Get all gems
12. `GET /api/admin/products` - Get all products
13. `GET /api/admin/products/:productId` - Get product details
14. `DELETE /api/admin/products/:productId` - Delete product
15. `GET /api/admin/buyers` - Get all buyers
16. `GET /api/admin/buyers/:buyerId` - Get buyer details
17. `PUT /api/admin/buyers/:buyerId/block` - Block buyer
18. `PUT /api/admin/buyers/:buyerId/unblock` - Unblock buyer
19. `GET /api/admin/dashboard/stats` - Get dashboard statistics

#### 11. OTP APIs (2 endpoints)
1. `POST /api/otp/send` - Send OTP
2. `POST /api/otp/verify` - Verify OTP

#### 12. Utility APIs (1 endpoint)
1. `GET /api/health` - Health check

---

## ✅ Verification Checklist

- [x] All authentication endpoints documented
- [x] All gem management endpoints documented
- [x] All cart endpoints documented
- [x] All order endpoints documented
- [x] All payment endpoints documented (including webhook)
- [x] All seller profile endpoints documented
- [x] All user profile endpoints documented
- [x] All wishlist endpoints documented
- [x] All review endpoints documented
- [x] All admin endpoints documented
- [x] All OTP endpoints documented
- [x] All utility endpoints documented
- [x] Alternative HTTP methods documented (PUT for reset-password)
- [x] Alias routes documented (GET /api/orders)

**Documentation Status: COMPLETE ✅**

