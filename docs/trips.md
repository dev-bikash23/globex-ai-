# Trip Builder API — Phase 6

Base URL: `/api/v1/trips`  
Auth: All endpoints require `Authorization: Bearer <JWT>`

---

## Trips

### Create Trip
```
POST /api/v1/trips
```
**Body:**
```json
{
  "title": "Tokyo Adventure",
  "description": "Optional description",
  "startDate": "2027-04-29",
  "endDate": "2027-05-06",
  "currency": "JPY",
  "budgetLimit": 200000,
  "destinationId": "d1000000-0000-0000-0000-000000000001"
}
```
- `title` required, 2–200 chars
- `currency` required, 3-char ISO code (e.g. `JPY`, `USD`, `INR`)
- `startDate`/`endDate` required, `YYYY-MM-DD`
- `destinationId` optional — links to Phase 3 destinations table
- Auto-generates itinerary day stubs for each day in range

**Response 201:**
```json
{
  "id": "uuid",
  "title": "Tokyo Adventure",
  "status": "PLANNING",
  "startDate": "2027-04-29",
  "endDate": "2027-05-06",
  "durationDays": 8,
  "currency": "JPY"
}
```

---

### List My Trips
```
GET /api/v1/trips
```
Returns trips grouped by category (ARCHIVED trips excluded):

```json
{
  "upcoming": [...],
  "planning": [...],
  "past":     [...],
  "totalCount": 3
}
```

---

### Get Trip
```
GET /api/v1/trips/{tripId}
```

---

### Update Trip (partial)
```
PUT /api/v1/trips/{tripId}
```
All fields optional — only provided fields are updated:
```json
{
  "title": "New title",
  "description": "New desc",
  "startDate": "2027-04-30",
  "endDate": "2027-05-07",
  "currency": "JPY",
  "budgetLimit": 250000
}
```

---

### Update Status
```
PATCH /api/v1/trips/{tripId}/status
```
```json
{ "status": "CONFIRMED" }
```
Valid transitions:
| From       | To          |
|------------|-------------|
| PLANNING   | CONFIRMED   |
| PLANNING   | CANCELLED   |
| CONFIRMED  | IN_PROGRESS |
| CONFIRMED  | CANCELLED   |
| IN_PROGRESS| COMPLETED   |
| CONFIRMED  | PLANNING    |
| Any        | ARCHIVED    |

---

### Delete / Archive Trip
```
DELETE /api/v1/trips/{tripId}?mode=archive   # Default — sets status=ARCHIVED
DELETE /api/v1/trips/{tripId}?mode=hard      # Hard delete from DB
```

---

### Trip Summary
```
GET /api/v1/trips/{tripId}/summary
```
Lightweight overview: traveler count, flight/hotel/activity counts, planned total, actual total.

---

## Travelers

### List Travelers
```
GET /api/v1/trips/{tripId}/travelers
```

### Add Traveler
```
POST /api/v1/trips/{tripId}/travelers
```
```json
{
  "firstName": "Alice",
  "lastName": "Smith",
  "travelerType": "ADULT"
}
```
`travelerType`: `ADULT`, `CHILD`, `INFANT`

### Remove Traveler
```
DELETE /api/v1/trips/{tripId}/travelers/{travelerId}
```

---

## Offers (Flights / Hotels / Activities)

### Flights
```
GET    /api/v1/trips/{tripId}/flights
POST   /api/v1/trips/{tripId}/flights           # attach offer
DELETE /api/v1/trips/{tripId}/flights/{flightId}
```
Attach body:
```json
{
  "provider": "duffel",
  "providerOfferId": "off_0001",
  "origin": "DEL",
  "destination": "NRT",
  "airline": "ANA",
  "cabinClass": "economy",
  "priceAmount": 45000,
  "currency": "INR",
  "departureTime": "2027-04-29T05:00:00Z",
  "arrivalTime": "2027-04-29T18:30:00Z"
}
```

### Hotels & Activities
Same pattern under `/hotels` and `/activities`.
