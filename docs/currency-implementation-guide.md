# Currency Implementation Guide

## Overview
This document describes the currency conversion system implemented in the Aurelane Next.js application. The system allows users to view prices in multiple currencies while maintaining INR as the base currency for all backend operations.

## Frontend Implementation

### Currency Context (`app/reactcomponents/contexts/CurrencyContext.js`)
- Manages selected currency state across the application
- Fetches and caches exchange rates from exchangerate-api.com
- Provides currency conversion and formatting utilities
- Stores currency preference in localStorage

### Supported Currencies
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- INR (Indian Rupee) - Base Currency
- AED (UAE Dirham)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- SGD (Singapore Dollar)
- HKD (Hong Kong Dollar)
- ZAR (South African Rand)
- LKR (Sri Lankan Rupee)

### Exchange Rate API
- **Service**: exchangerate-api.com (free tier, no API key required)
- **Base Currency**: INR
- **Cache Duration**: 1 hour
- **Fallback**: If API fails, uses 1:1 rates as fallback

### Currency Dropdown
- Located in Header component (both desktop and mobile)
- Shows currency symbol icon using react-icons
- Displays selected currency with checkmark
- Persists selection in localStorage

## Backend Requirements

### Current State
- All prices in the database are stored in **INR (Indian Rupee)**
- No backend changes are required for basic currency conversion
- The frontend handles all currency conversion client-side

### Recommended Backend Enhancements (Optional)
If you want to improve the system, consider:

1. **Store Exchange Rates in Database**
   - Create a `exchange_rates` table
   - Update rates daily via cron job
   - Provide API endpoint: `GET /api/currency/rates`

2. **Store Currency Preference**
   - Add `preferredCurrency` field to User model
   - Update user preference via: `PUT /api/user/preferences`

3. **Order Currency Tracking**
   - Add `displayCurrency` and `exchangeRate` fields to Order model
   - Store the currency and rate used at checkout time
   - This helps with accounting and reporting

## Payment Gateway Integration

### Razorpay (Current Implementation)
- **Supported Currency**: INR only
- **Implementation**: Always sends INR amount to Razorpay
- The frontend converts displayed prices, but payment is always in INR

### Stripe Integration (For Multi-Currency Payments)

#### Stripe Setup Requirements:
1. **Stripe Account Configuration**
   - Enable multi-currency in Stripe Dashboard
   - Add supported currencies in Stripe settings
   - Configure currency conversion settings

2. **Backend Changes Needed**:
   ```javascript
   // Example: Create payment intent with currency
   const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.round(amount * 100), // Convert to smallest currency unit
     currency: currency.toLowerCase(), // e.g., 'usd', 'eur', 'inr'
     metadata: {
       orderId: orderId,
       userId: userId
     }
   });
   ```

3. **Frontend Changes**:
   - Update `handleOnlinePayment` in Checkout.js to support Stripe
   - Use Stripe.js to handle payment with selected currency
   - Convert amount to smallest currency unit (cents, paise, etc.)

#### Stripe Currency Support:
Stripe supports 135+ currencies. For your supported currencies:
- USD, EUR, GBP, CAD, AUD, SGD, HKD, AED, ZAR: Fully supported
- INR: Supported (Stripe India)
- LKR: Supported

#### Important Notes:
- **Currency Conversion**: Stripe handles currency conversion automatically
- **Payout Currency**: Configure your Stripe account's payout currency
- **Exchange Rates**: Stripe uses real-time exchange rates
- **Fees**: Stripe charges may vary by currency

### Recommended Payment Flow:
1. User selects currency in header
2. Prices displayed in selected currency
3. At checkout, show both:
   - Display price in selected currency
   - Actual payment amount (may differ due to exchange rates)
4. For Razorpay: Always charge in INR
5. For Stripe: Charge in selected currency (if supported)

## Files Modified

### Frontend Files:
1. `app/reactcomponents/contexts/CurrencyContext.js` - New file
2. `app/reactcomponents/components/layout/Header.js` - Added currency dropdown
3. `app/reactcomponents/components/gems/GemCard.js` - Updated price formatting
4. `app/reactcomponents/pages/GemDetail.js` - Updated price formatting
5. `app/reactcomponents/pages/Cart.js` - Updated price formatting
6. `app/reactcomponents/pages/Checkout.js` - Updated price formatting and payment handling
7. `app/reactcomponents/pages/AddGem.js` - Added "Rati" measurement unit
8. `app/reactcomponents/pages/EditGem.js` - Added "Rati" measurement unit
9. `app/providers.tsx` - Added CurrencyProvider

## Testing Checklist

- [ ] Currency dropdown appears in header (desktop and mobile)
- [ ] Currency selection persists after page refresh
- [ ] Prices update when currency changes
- [ ] Exchange rates load correctly
- [ ] Fallback works when API fails
- [ ] Cart totals display in selected currency
- [ ] Checkout shows correct amounts
- [ ] Payment gateway receives correct INR amount (for Razorpay)
- [ ] All price displays use currency formatting

## Future Enhancements

1. **Real-time Exchange Rate Updates**
   - WebSocket connection for live rates
   - Or periodic background updates

2. **Currency Conversion History**
   - Show rate used at time of purchase
   - Display in order history

3. **Multi-Currency Payment Support**
   - Integrate Stripe for multi-currency payments
   - Support for more payment gateways

4. **Admin Currency Management**
   - Set custom exchange rates
   - Override API rates if needed

5. **Currency-Specific Pricing**
   - Different base prices for different regions
   - Regional pricing strategies

## Support

For questions or issues:
1. Check browser console for exchange rate API errors
2. Verify localStorage has `selectedCurrency` and `exchangeRates`
3. Ensure exchangerate-api.com is accessible
4. Check network tab for API calls

