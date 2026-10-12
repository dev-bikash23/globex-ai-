# Itinerary API — Phase 6

Base URL: `/api/v1/trips/{tripId}/itinerary`  
Auth: All endpoints require `Authorization: Bearer <JWT>`

---

## Overview

When a trip is created, **itinerary day stubs are auto-generated** — one `ItineraryDay` per calendar day in the trip's date range. Each day can then have multiple `ItineraryItem`s representing scheduled activities, transports, meals, etc.

---

## Endpoints

### Get Itinerary
```
GET /api/v1/trips/{tripId}/itinerary
```
**Response:**
```json
{
  "tripId": "uuid",
  "totalDays": 8,
  "days": [
    {
      "id": "uuid",
      "dayNumber": 1,
      "date": "2027-04-29",
      "title": "Day 1",
      "notes": null,
      "items": [
        {
          "id": "uuid",
          "title": "Arrive at Narita",
          "itemType": "TRANSPORT",
          "sortOrder": 1,
          "startTime": null,
          "endTime": null,
          "notes": null,
          "priceAmount": null,
          "currency": null
        }
      ]
    }
  ]
}
```

---

### Update a Day
```
PUT /api/v1/trips/{tripId}/itinerary/days/{dayId}
```
```json
{
  "title": "Arrival Day — Shinjuku",
  "notes": "Check in hotel early, walk Shinjuku Gyoen"
}
```

---

### Add Item to Day
```
POST /api/v1/trips/{tripId}/itinerary/days/{dayId}/items
```
```json
{
  "title": "Tsukiji Outer Market",
  "itemType": "FOOD",
  "startTime": "08:00",
  "endTime": "10:00",
  "sortOrder": 2,
  "notes": "Fresh tuna breakfast",
  "priceAmount": 2000,
  "currency": "JPY"
}
```
`itemType` values: `TRANSPORT`, `ACCOMMODATION`, `FOOD`, `ACTIVITY`, `SIGHTSEEING`, `OTHER`

---

### Update Item
```
PUT /api/v1/trips/{tripId}/itinerary/days/{dayId}/items/{itemId}
```
All fields optional (partial update).

---

### Delete Item
```
DELETE /api/v1/trips/{tripId}/itinerary/days/{dayId}/items/{itemId}
```

---

### Reorder Items
```
PUT /api/v1/trips/{tripId}/itinerary/days/{dayId}/items/reorder
```
```json
{
  "orderedItemIds": ["uuid-item-3", "uuid-item-1", "uuid-item-2"]
}
```
Updates `sortOrder` for all items in the day.

---

## Notes

- Days are auto-generated in `createTrip()` — one stub per date in `[startDate, endDate]`
- Items are returned sorted by `sortOrder` ascending
- `priceAmount` / `currency` on items feed into the planned budget calculation
