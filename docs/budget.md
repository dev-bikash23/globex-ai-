# Budget & Expenses API — Phase 6

Base URL: `/api/v1/trips/{tripId}`  
Auth: All endpoints require `Authorization: Bearer <JWT>`

---

## Budget Summary

### Get Budget Summary
```
GET /api/v1/trips/{tripId}/budget
```
**Response:**
```json
{
  "tripId": "uuid",
  "currency": "JPY",
  "budgetLimit": 200000.00,
  "plannedTotal": 85000.00,
  "actualTotal": 3500.00,
  "remainingBudget": 114500.00,
  "isOverBudget": false,
  "plannedFlights": 45000.00,
  "plannedHotels": 35000.00,
  "plannedActivities": 5000.00,
  "plannedItineraryItems": 0.00,
  "currencyNote": "All amounts in trip currency (JPY). Multi-currency conversion not yet implemented."
}
```

**Budget components:**
- `plannedTotal` = sum of SELECTED flight offers + SELECTED hotel offers + PLANNED activities
- `actualTotal` = sum of all logged trip expenses
- `remainingBudget` = `budgetLimit - actualTotal` (null if no budget limit set)
- `isOverBudget` = `actualTotal > budgetLimit` (false if no limit)

---

### Set Budget Limit
```
PUT /api/v1/trips/{tripId}/budget/limit
```
```json
{ "budgetLimit": 300000 }
```
Returns `200 OK` with confirmation message.

---

## Expenses

### List Expenses
```
GET /api/v1/trips/{tripId}/expenses
```
Returns all expenses for the trip, sorted by `expenseDate` descending.

### Add Expense
```
POST /api/v1/trips/{tripId}/expenses
```
```json
{
  "category": "FOOD",
  "description": "Ramen at Ichiran",
  "amount": 1800,
  "currency": "JPY",
  "expenseDate": "2027-04-29",
  "notes": "Best ramen ever"
}
```
`category` values: `FLIGHT`, `HOTEL`, `FOOD`, `TRANSPORT`, `ACTIVITY`, `SHOPPING`, `INSURANCE`, `VISA`, `OTHER`

**Response 201:**
```json
{
  "id": "uuid",
  "category": "FOOD",
  "description": "Ramen at Ichiran",
  "amount": 1800.00,
  "currency": "JPY",
  "expenseDate": "2027-04-29",
  "notes": "Best ramen ever",
  "createdAt": "2027-04-29T12:00:00Z"
}
```

### Update Expense
```
PUT /api/v1/trips/{tripId}/expenses/{expenseId}
```
All fields optional (partial update).

### Delete Expense
```
DELETE /api/v1/trips/{tripId}/expenses/{expenseId}
```

---

## Expense Categories

| Category    | Description                    |
|-------------|--------------------------------|
| FLIGHT      | Air travel                     |
| HOTEL       | Accommodation                  |
| FOOD        | Restaurants, cafes, groceries  |
| TRANSPORT   | Local transport, taxis, trains |
| ACTIVITY    | Tours, tickets, experiences    |
| SHOPPING    | Souvenirs, retail              |
| INSURANCE   | Travel insurance               |
| VISA        | Visa fees                      |
| OTHER       | Miscellaneous                  |

---

## Notes

- All amounts use `BigDecimal` — never `double` (financial precision)
- Multi-currency conversion is Phase 7+ scope
- `currencyNote` in budget response reminds the user that amounts are in trip currency
