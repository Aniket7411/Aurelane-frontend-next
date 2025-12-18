# Search Implementation Documentation

This document explains how the gem search functionality works in the Aurelane application.

---

## Overview

The search functionality allows users to find gems by:
- **Name** (English and Hindi)
- **Category**
- **Description**
- **Color**
- **Planet** (for regular gems)
- **Origin**
- **Benefits** (array)
- **Suitable For** (array)
- **Birth Month** (for custom stones)

---

## Frontend Implementation

### 1. Search Input Locations

**Primary Search:**
- **Header Component** (`app/reactcomponents/components/layout/Header.js`)
  - Search bar in the header
  - Sends search query to `GET /api/gems?search=<query>`
  - Shows up to 5 results in dropdown
  - On submit, navigates to `/shop?query=<search>`

**Shop Page Search:**
- **Shop Component** (`app/reactcomponents/pages/Shop.js`)
  - Main search bar on shop page
  - Debounced search (500ms delay)
  - Updates URL parameters: `/shop?query=<search>`
  - Sends search to backend via `gemAPI.getGems({ search: query })`

### 2. Search Parameters Sent to Backend

```javascript
// From Shop.js - Line 149-157
const params = {};
if (page) params.page = page;
if (limit) params.limit = limit;
if (search) params.search = search;              // ← Search query
if (categoryKey) params.category = categoryKey.split('|').join(',');
if (minPrice) params.minPrice = minPrice;
if (maxPrice) params.maxPrice = maxPrice;
if (sort) params.sort = sort;
if (birthMonth) params.birthMonth = birthMonth;
```

**API Call:**
```javascript
// From api.js - Line 389-404
getGems: async (params = {}, options = {}) => {
  const filteredParams = Object.keys(params).reduce((acc, key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  
  return cachedGet('/gems', { params: filteredParams }, {
    ttl: cacheTtl,
    forceRefresh,
    signal
  });
}
```

**Request Example:**
```http
GET /api/gems?search=ruby&category=Ruby,Sapphire&minPrice=10000&maxPrice=100000&page=1&limit=12
```

---

## Backend Search Implementation (Expected)

### Fields Searched

According to `docs/gem-data-and-filter-spec.md` (Line 69), the backend should search across:

1. **`name`** - Gem name (e.g., "Ruby", "Blue Sapphire")
2. **`hindiName`** - Hindi name (e.g., "माणिक", "नीलम")
3. **`description`** - Full description text
4. **`benefits`** - Array of benefits (e.g., ["Financial Growth", "Health"])
5. **`suitableFor`** - Array of suitable professions (e.g., ["Teachers", "Lawyers"])
6. **`color`** - Color of the gem (e.g., "Red", "Blue")
7. **`planet`** - Associated planet (e.g., "Sun (Surya)") - **Only for regular gems**
8. **`origin`** - Origin country/region (e.g., "Sri Lanka", "Burma")
9. **`birthMonth`** - Birth month (e.g., "January") - **For custom stones**

### Recommended MongoDB Query

```javascript
// Backend search implementation (pseudo-code)
const searchTerm = req.query.search;

if (searchTerm) {
  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive
  
  query.$or = [
    { name: searchRegex },
    { hindiName: searchRegex },
    { description: searchRegex },
    { color: searchRegex },
    { origin: searchRegex },
    { planet: searchRegex },              // For regular gems
    { planetHindi: searchRegex },         // For regular gems
    { birthMonth: searchRegex },          // For custom stones
    { benefits: { $in: [searchRegex] } },
    { suitableFor: { $in: [searchRegex] } }
  ];
}
```

### MongoDB Text Index (Recommended)

For better search performance, create a text index:

```javascript
db.gems.createIndex({
  name: "text",
  hindiName: "text",
  description: "text",
  color: "text",
  origin: "text",
  planet: "text",
  planetHindi: "text",
  birthMonth: "text",
  benefits: "text",
  suitableFor: "text"
});

// Then use text search:
db.gems.find({ $text: { $search: searchTerm } });
```

---

## Search Examples

### Example 1: Search by Name
**User Input:** "ruby"  
**Backend Query:** `{ $or: [{ name: /ruby/i }, { hindiName: /ruby/i }, ...] }`  
**Results:** All gems with "ruby" in name, hindiName, description, etc.

### Example 2: Search by Category
**User Input:** "sapphire"  
**Backend Query:** `{ $or: [{ name: /sapphire/i }, { category: /sapphire/i }, ...] }`  
**Results:** Blue Sapphire, Yellow Sapphire, Pink Sapphire, etc.

### Example 3: Search by Birth Month
**User Input:** "january"  
**Backend Query:** `{ $or: [{ birthMonth: /january/i }, ...] }`  
**Results:** All gems (regular and custom) associated with January

### Example 4: Search by Color
**User Input:** "blue"  
**Backend Query:** `{ $or: [{ color: /blue/i }, { description: /blue/i }, ...] }`  
**Results:** Blue Sapphire, Blue Topaz, Aquamarine, etc.

### Example 5: Combined Search with Filters
**User Input:** "sapphire"  
**Filters:** Category: "Sapphire", Price: 50000-200000  
**Backend Query:**
```javascript
{
  $or: [
    { name: /sapphire/i },
    { category: /sapphire/i },
    // ... other fields
  ],
  category: "Sapphire",
  price: { $gte: 50000, $lte: 200000 }
}
```

---

## Filtering (Separate from Search)

### Category Filter
- **Frontend:** Sends comma-separated categories: `category=Ruby,Sapphire`
- **Backend:** Should split by comma and filter: `{ category: { $in: ["Ruby", "Sapphire"] } }`

### Birth Month Filter
- **Frontend:** Sends exact month: `birthMonth=January`
- **Backend:** Exact match: `{ birthMonth: "January" }`
- **Note:** This works for both regular gems and custom stones

### Price Filter
- **Frontend:** Sends `minPrice` and `maxPrice`
- **Backend:** Range query: `{ price: { $gte: minPrice, $lte: maxPrice } }`

### Sort Options
- **Frontend:** Sends `sort` parameter
- **Backend:** Should sort by:
  - `newest` → `createdAt DESC`
  - `oldest` → `createdAt ASC`
  - `price-low` → `price ASC`
  - `price-high` → `price DESC`

---

## Search Flow Diagram

```
User Types in Search Bar
         ↓
Frontend Debounces (500ms)
         ↓
Updates URL: /shop?query=<search>
         ↓
Calls gemAPI.getGems({ search: query })
         ↓
GET /api/gems?search=<query>
         ↓
Backend Searches MongoDB:
  - name, hindiName, description
  - color, origin, planet, birthMonth
  - benefits[], suitableFor[]
         ↓
Returns Filtered Results
         ↓
Frontend Displays Results
```

---

## Caching

**Frontend Caching:**
- Search results are cached for **2 minutes** (DEFAULT_CACHE_TTL)
- Cache key includes all query parameters
- Cache is invalidated when gems are added/updated/deleted

**Cache Key Format:**
```javascript
`GET:/gems?${JSON.stringify(params)}`
```

---

## Performance Considerations

1. **Use MongoDB Text Index** for faster full-text search
2. **Limit Results** - Frontend sends `limit=12` by default
3. **Pagination** - Backend should return pagination metadata
4. **Debouncing** - Frontend debounces search input (500ms) to reduce API calls
5. **Request Cancellation** - Frontend cancels previous requests when new search is initiated

---

## Testing Search

### Test Cases

1. **Search by English Name**
   - Input: "ruby"
   - Expected: Returns all Ruby variants

2. **Search by Hindi Name**
   - Input: "माणिक"
   - Expected: Returns Ruby gems

3. **Search by Category**
   - Input: "sapphire"
   - Expected: Returns Blue, Yellow, Pink Sapphires

4. **Search by Birth Month**
   - Input: "january"
   - Expected: Returns gems with birthMonth = "January"

5. **Search with Filters**
   - Input: "sapphire" + Category: "Sapphire" + Price: 50000-200000
   - Expected: Returns filtered Sapphire gems in price range

6. **Empty Search**
   - Input: ""
   - Expected: Returns all gems (no search filter applied)

---

## Current Implementation Status

✅ **Frontend:** Fully implemented
- Search bar in header
- Search bar in shop page
- Debouncing
- URL parameter sync
- Cache management

⚠️ **Backend:** Needs verification
- Ensure search includes all fields listed above
- Add `birthMonth` to searchable fields (for custom stones)
- Verify text index includes all fields
- Test search performance

---

## Related Files

- **Frontend Search:** `app/reactcomponents/pages/Shop.js`
- **API Service:** `app/reactcomponents/services/api.js`
- **Header Search:** `app/reactcomponents/components/layout/Header.js`
- **Spec Document:** `docs/gem-data-and-filter-spec.md`
- **Backend Update Guide:** `updatecustomgem.md`

---

**Last Updated:** Based on current frontend implementation  
**Next Steps:** Verify backend search implementation matches this specification

