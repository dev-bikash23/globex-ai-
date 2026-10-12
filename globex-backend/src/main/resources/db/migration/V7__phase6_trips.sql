-- =============================================================================
-- V7: Phase 6 Schema -- Trip Builder + Itinerary + Budget Management
-- GlobeX AI
-- IMPORTANT: No real bookings stored here. All offers are SELECTED (may expire).
-- =============================================================================

CREATE TABLE trips (
    id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id     VARCHAR(36)  REFERENCES destinations(id) ON DELETE SET NULL,
    title              VARCHAR(200) NOT NULL,
    description        TEXT,
    start_date         DATE         NOT NULL,
    end_date           DATE         NOT NULL,
    status             VARCHAR(20)  NOT NULL DEFAULT 'PLANNING',
    currency           CHAR(3)      NOT NULL DEFAULT 'USD',
    budget_limit       NUMERIC(14,2),
    cover_image_url    TEXT,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trips_dates    CHECK (end_date >= start_date),
    CONSTRAINT chk_trips_budget   CHECK (budget_limit IS NULL OR budget_limit >= 0),
    CONSTRAINT chk_trips_status   CHECK (status IN ('PLANNING','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED','ARCHIVED')),
    CONSTRAINT chk_trips_currency CHECK (LENGTH(currency) = 3)
);
CREATE INDEX idx_trips_user_id     ON trips(user_id);
CREATE INDEX idx_trips_status      ON trips(status);
CREATE INDEX idx_trips_start_date  ON trips(start_date);
CREATE INDEX idx_trips_user_status ON trips(user_id, status);

CREATE TABLE trip_travelers (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id       UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    first_name    VARCHAR(100),
    last_name     VARCHAR(100),
    traveler_type VARCHAR(10) NOT NULL DEFAULT 'ADULT',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_traveler_type CHECK (traveler_type IN ('ADULT','CHILD','INFANT'))
);
CREATE INDEX idx_trip_travelers_trip_id ON trip_travelers(trip_id);

CREATE TABLE trip_flights (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id           UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    provider          VARCHAR(50)   NOT NULL,
    provider_offer_id VARCHAR(255)  NOT NULL,
    origin            VARCHAR(10)   NOT NULL,
    destination       VARCHAR(10)   NOT NULL,
    departure_time    TIMESTAMPTZ,
    arrival_time      TIMESTAMPTZ,
    airline           VARCHAR(100),
    cabin_class       VARCHAR(30),
    price_amount      NUMERIC(14,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    status            VARCHAR(20)   NOT NULL DEFAULT 'SELECTED',
    last_validated_at TIMESTAMPTZ,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trip_flight_status CHECK (status IN ('SELECTED','EXPIRED','REMOVED')),
    CONSTRAINT chk_trip_flight_price  CHECK (price_amount >= 0),
    CONSTRAINT uq_trip_flight_offer   UNIQUE (trip_id, provider_offer_id)
);
CREATE INDEX idx_trip_flights_trip_id ON trip_flights(trip_id);

CREATE TABLE trip_hotels (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id           UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    provider          VARCHAR(50)   NOT NULL,
    provider_offer_id VARCHAR(255)  NOT NULL,
    hotel_name        VARCHAR(200)  NOT NULL,
    check_in          DATE          NOT NULL,
    check_out         DATE          NOT NULL,
    room_type         VARCHAR(100),
    price_amount      NUMERIC(14,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    status            VARCHAR(20)   NOT NULL DEFAULT 'SELECTED',
    last_validated_at TIMESTAMPTZ,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trip_hotel_status CHECK (status IN ('SELECTED','EXPIRED','REMOVED')),
    CONSTRAINT chk_trip_hotel_dates  CHECK (check_out > check_in),
    CONSTRAINT chk_trip_hotel_price  CHECK (price_amount >= 0),
    CONSTRAINT uq_trip_hotel_offer   UNIQUE (trip_id, provider_offer_id)
);
CREATE INDEX idx_trip_hotels_trip_id ON trip_hotels(trip_id);

CREATE TABLE trip_activities (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id           UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    provider          VARCHAR(50),
    provider_offer_id VARCHAR(255),
    activity_name     VARCHAR(200)  NOT NULL,
    activity_date     DATE,
    start_time        TIME,
    duration_minutes  INTEGER,
    price_amount      NUMERIC(14,2) NOT NULL DEFAULT 0,
    currency          CHAR(3)       NOT NULL DEFAULT 'USD',
    category          VARCHAR(50),
    status            VARCHAR(20)   NOT NULL DEFAULT 'PLANNED',
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_trip_activity_status CHECK (status IN ('PLANNED','REMOVED','EXPIRED')),
    CONSTRAINT chk_trip_activity_price  CHECK (price_amount >= 0)
);
CREATE INDEX idx_trip_activities_trip_id ON trip_activities(trip_id);

CREATE TABLE itinerary_days (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id    UUID        NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER     NOT NULL,
    date       DATE        NOT NULL,
    title      VARCHAR(200),
    notes      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_itinerary_day_number UNIQUE (trip_id, day_number),
    CONSTRAINT chk_day_number          CHECK (day_number >= 1)
);
CREATE INDEX idx_itinerary_days_trip_id ON itinerary_days(trip_id);

CREATE TABLE itinerary_items (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id         UUID          NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    title          VARCHAR(200)  NOT NULL,
    description    TEXT,
    item_type      VARCHAR(20)   NOT NULL DEFAULT 'OTHER',
    start_time     TIME,
    end_time       TIME,
    location_name  VARCHAR(200),
    latitude       DOUBLE PRECISION,
    longitude      DOUBLE PRECISION,
    estimated_cost NUMERIC(14,2) NOT NULL DEFAULT 0,
    currency       CHAR(3)       NOT NULL DEFAULT 'USD',
    sort_order     INTEGER       NOT NULL DEFAULT 0,
    notes          TEXT,
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_item_type CHECK (item_type IN ('FLIGHT','HOTEL','ACTIVITY','MEAL','TRANSPORT','FREE_TIME','OTHER')),
    CONSTRAINT chk_item_cost CHECK (estimated_cost >= 0)
);
CREATE INDEX idx_itinerary_items_day_id ON itinerary_items(day_id);
CREATE INDEX idx_itinerary_items_sort   ON itinerary_items(day_id, sort_order);

CREATE TABLE trip_expenses (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id      UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    category     VARCHAR(30)   NOT NULL,
    description  VARCHAR(300)  NOT NULL,
    amount       NUMERIC(14,2) NOT NULL,
    currency     CHAR(3)       NOT NULL,
    expense_date DATE,
    notes        TEXT,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_expense_category CHECK (category IN ('FLIGHT','HOTEL','ACTIVITY','FOOD','TRANSPORT','SHOPPING','MISCELLANEOUS')),
    CONSTRAINT chk_expense_amount   CHECK (amount >= 0)
);
CREATE INDEX idx_trip_expenses_trip_id  ON trip_expenses(trip_id);
CREATE INDEX idx_trip_expenses_category ON trip_expenses(trip_id, category);
