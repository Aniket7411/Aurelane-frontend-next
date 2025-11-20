# Backend Currency Support Specification

## Current Status
**No immediate backend changes are required.** The frontend handles all currency conversion client-side. All prices in the database remain in INR (Indian Rupee).

## What the Frontend Does
1. Fetches exchange rates from exchangerate-api.com
2. Converts prices from INR to selected currency for display only
3. Stores currency preference in browser localStorage
4. All backend API calls still send/receive prices in INR

## Optional Backend Enhancements

### 1. Exchange Rate API Endpoint (Recommended)
If you want to provide exchange rates from your backend instead of relying on external API:

**Endpoint**: `GET /api/currency/rates`

**Response**:
```json
{
  "success": true,
  "baseCurrency": "INR",
  "rates": {
    "USD": 0.012,
    "EUR": 0.011,
    "GBP": 0.0095,
    "AED": 0.044,
    "CAD": 0.016,
    "AUD": 0.018,
    "SGD": 0.016,
    "HKD": 0.094,
    "ZAR": 0.22,
    "LKR": 4.5
  },
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

**Implementation**:
- Create `ExchangeRate` model/table
- Update rates daily via cron job or scheduled task
- Cache rates in Redis/memory for performance

### 2. User Currency Preference (Optional)
Store user's preferred currency in the database:

**User Model Addition**:
```javascript
{
  // ... existing fields
  preferredCurrency: {
    type: String,
    default: 'INR',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD', 'AUD', 'SGD', 'HKD', 'ZAR', 'LKR']
  }
}
```

**Endpoint**: `PUT /api/user/preferences`
```json
{
  "preferredCurrency": "USD"
}
```

### 3. Order Currency Tracking (Recommended for Accounting)
Track the currency and exchange rate used at checkout:

**Order Model Addition**:
```javascript
{
  // ... existing fields
  displayCurrency: {
    type: String,
    default: 'INR'
  },
  exchangeRate: {
    type: Number,
    default: 1.0
  },
  displayTotal: {
    type: Number  // Total in display currency (for reference)
  }
}
```

**When Creating Order**:
- Accept `displayCurrency` and `exchangeRate` from frontend
- Store these values with the order
- Keep `totalAmount` in INR (base currency)

### 4. Stripe Payment Integration (For Multi-Currency Payments)

If you want to accept payments in multiple currencies using Stripe:

**Backend Changes Needed**:

1. **Install Stripe SDK**:
```bash
npm install stripe
```

2. **Create Payment Intent Endpoint**:
```javascript
// POST /api/payments/create-intent
app.post('/api/payments/create-intent', async (req, res) => {
  const { orderId, amount, currency } = req.body;
  
  // Validate currency is supported
  const supportedCurrencies = ['usd', 'eur', 'gbp', 'inr', 'aed', 'cad', 'aud', 'sgd', 'hkd', 'zar', 'lkr'];
  if (!supportedCurrencies.includes(currency.toLowerCase())) {
    return res.status(400).json({ 
      success: false, 
      message: 'Currency not supported' 
    });
  }
  
  // Convert amount to smallest currency unit
  const amountInSmallestUnit = Math.round(amount * 100);
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      metadata: {
        orderId: orderId,
        userId: req.user.id
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

3. **Webhook for Payment Confirmation**:
```javascript
// POST /api/payments/webhook
app.post('/api/payments/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      paymentMethod: 'stripe',
      paymentId: paymentIntent.id
    });
  }
  
  res.json({ received: true });
});
```

**Environment Variables Needed**:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Important Notes for Stripe**:
- Stripe handles currency conversion automatically
- You'll receive payouts in your Stripe account's default currency
- Stripe charges fees based on the payment currency
- Some currencies may have minimum payment amounts

### 5. Razorpay Integration (Current - No Changes Needed)
Razorpay only supports INR, so no backend changes are required. The frontend already handles this correctly by always sending INR amounts to Razorpay.

## Database Schema Changes (Optional)

### Exchange Rates Table (if implementing backend rates)
```sql
CREATE TABLE exchange_rates (
  id SERIAL PRIMARY KEY,
  base_currency VARCHAR(3) NOT NULL DEFAULT 'INR',
  target_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(base_currency, target_currency)
);
```

### User Model Update
```javascript
// Add to User schema
preferredCurrency: {
  type: String,
  default: 'INR',
  enum: ['USD', 'EUR', 'GBP', 'INR', 'AED', 'CAD', 'AUD', 'SGD', 'HKD', 'ZAR', 'LKR']
}
```

### Order Model Update
```javascript
// Add to Order schema
displayCurrency: {
  type: String,
  default: 'INR'
},
exchangeRate: {
  type: Number,
  default: 1.0
},
displayTotal: {
  type: Number
}
```

## API Endpoints Summary

### Current (No Changes Required)
- All existing endpoints work as-is
- Prices are always in INR

### Optional New Endpoints

1. **GET /api/currency/rates**
   - Returns current exchange rates
   - Cache for 1 hour

2. **PUT /api/user/preferences**
   - Update user's preferred currency
   - Body: `{ preferredCurrency: "USD" }`

3. **POST /api/payments/create-intent** (Stripe)
   - Create Stripe payment intent
   - Body: `{ orderId, amount, currency }`
   - Returns: `{ clientSecret, paymentIntentId }`

4. **POST /api/payments/webhook** (Stripe)
   - Handle Stripe webhook events
   - Update order payment status

## Testing

### Test Cases:
1. Verify all prices in database are in INR
2. Test exchange rate API (if implemented)
3. Test user preference storage
4. Test order currency tracking
5. Test Stripe payment flow (if implemented)

## Migration Guide

If implementing optional features:

1. **Add fields to User model** (optional)
   ```javascript
   // Migration script
   db.users.updateMany(
     {},
     { $set: { preferredCurrency: 'INR' } }
   );
   ```

2. **Add fields to Order model** (optional)
   ```javascript
   // Migration script
   db.orders.updateMany(
     {},
     { 
       $set: { 
         displayCurrency: 'INR',
         exchangeRate: 1.0
       } 
     }
   );
   ```

3. **Create exchange rates table** (if implementing backend rates)
   - Seed with initial rates
   - Set up daily update job

## Questions?

Contact the frontend team if you need clarification on:
- How currency conversion works in the frontend
- What data the frontend expects from the backend
- Payment gateway integration requirements

