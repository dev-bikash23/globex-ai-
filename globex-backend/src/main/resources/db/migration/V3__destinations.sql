-- =============================================================================
-- V3: Destination Explorer Schema -- Phase 3
-- GlobeX AI
-- NOTE: Seed data below is DEV DATA ONLY -- not the production travel database.
-- Production data strategy: DestinationDataProvider interface -> import pipeline
-- =============================================================================

-- Enable uuid-ossp if not already enabled (needed for uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Countries ─────────────────────────────────────────────────────────────────
CREATE TABLE countries (
    id               VARCHAR(36)      PRIMARY KEY,
    code             CHAR(2)          NOT NULL UNIQUE,
    name             VARCHAR(100)     NOT NULL,
    official_name    VARCHAR(200),
    continent        VARCHAR(50)      NOT NULL,
    latitude         DOUBLE PRECISION NOT NULL,
    longitude        DOUBLE PRECISION NOT NULL,
    timezone         VARCHAR(50),
    currency_code    CHAR(3),
    primary_language VARCHAR(50),
    flag_emoji       VARCHAR(10),
    created_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_countries_code      ON countries(code);
CREATE INDEX idx_countries_continent ON countries(continent);
CREATE INDEX idx_countries_name      ON countries(name);

-- ── Cities ────────────────────────────────────────────────────────────────────
CREATE TABLE cities (
    id          VARCHAR(36)      PRIMARY KEY,
    country_id  VARCHAR(36)      NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    name        VARCHAR(100)     NOT NULL,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    timezone    VARCHAR(50),
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cities_country_id ON cities(country_id);
CREATE INDEX idx_cities_name       ON cities(name);

-- ── Destinations ──────────────────────────────────────────────────────────────
CREATE TABLE destinations (
    id          VARCHAR(36)      PRIMARY KEY,
    city_id     VARCHAR(36)      NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    name        VARCHAR(200)     NOT NULL,
    slug        VARCHAR(200)     NOT NULL UNIQUE,
    description TEXT,
    latitude    DOUBLE PRECISION NOT NULL,
    longitude   DOUBLE PRECISION NOT NULL,
    image_url   TEXT,
    featured    BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_destinations_city_id  ON destinations(city_id);
CREATE INDEX idx_destinations_featured ON destinations(featured) WHERE featured = TRUE;
CREATE INDEX idx_destinations_name     ON destinations(name);
CREATE INDEX idx_destinations_slug     ON destinations(slug);
CREATE INDEX idx_destinations_search   ON destinations
    USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ── User Favorite Destinations ────────────────────────────────────────────────
CREATE TABLE user_favorite_destinations (
    id             VARCHAR(36)  PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id        VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destination_id VARCHAR(36)  NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, destination_id)
);

CREATE INDEX idx_favorites_user_id        ON user_favorite_destinations(user_id);
CREATE INDEX idx_favorites_destination_id ON user_favorite_destinations(destination_id);

-- =============================================================================
-- DEV SEED DATA -- 10 destinations for local development only
-- Real lat/lng from Wikipedia. Clearly marked as NOT production data.
-- DO NOT USE IN PRODUCTION -- replace with DestinationDataProvider import pipeline
-- =============================================================================

-- Countries
INSERT INTO countries (id, code, name, official_name, continent, latitude, longitude, timezone, currency_code, primary_language, flag_emoji) VALUES
  ('c1-00000000-0000-0000-0000000000001', 'JP', 'Japan',                'Japan',                        'Asia',          36.2048,   138.2529, 'Asia/Tokyo',       'JPY', 'Japanese',   '🇯🇵'),
  ('c1-00000000-0000-0000-0000000000002', 'FR', 'France',               'French Republic',              'Europe',        46.2276,     2.2137, 'Europe/Paris',     'EUR', 'French',     '🇫🇷'),
  ('c1-00000000-0000-0000-0000000000003', 'AU', 'Australia',            'Commonwealth of Australia',    'Oceania',      -25.2744,   133.7751, 'Australia/Sydney', 'AUD', 'English',    '🇦🇺'),
  ('c1-00000000-0000-0000-0000000000004', 'IN', 'India',                'Republic of India',            'Asia',          20.5937,    78.9629, 'Asia/Kolkata',     'INR', 'Hindi',      '🇮🇳'),
  ('c1-00000000-0000-0000-0000000000005', 'US', 'United States',        'United States of America',     'North America', 37.0902,   -95.7129, 'America/New_York', 'USD', 'English',    '🇺🇸'),
  ('c1-00000000-0000-0000-0000000000006', 'IT', 'Italy',                'Italian Republic',             'Europe',        41.8719,    12.5674, 'Europe/Rome',      'EUR', 'Italian',    '🇮🇹'),
  ('c1-00000000-0000-0000-0000000000007', 'AE', 'United Arab Emirates', 'United Arab Emirates',         'Asia',          23.4241,    53.8478, 'Asia/Dubai',       'AED', 'Arabic',     '🇦🇪'),
  ('c1-00000000-0000-0000-0000000000008', 'BR', 'Brazil',               'Federative Republic of Brazil','South America',-14.2350,   -51.9253, 'America/Sao_Paulo','BRL', 'Portuguese', '🇧🇷'),
  ('c1-00000000-0000-0000-0000000000009', 'PE', 'Peru',                 'Republic of Peru',             'South America', -9.1900,   -75.0152, 'America/Lima',     'PEN', 'Spanish',    '🇵🇪'),
  ('c1-00000000-0000-0000-0000000000010', 'GR', 'Greece',               'Hellenic Republic',            'Europe',        39.0742,    21.8243, 'Europe/Athens',    'EUR', 'Greek',      '🇬🇷');

-- Cities
INSERT INTO cities (id, country_id, name, latitude, longitude, timezone) VALUES
  ('cy-00000000-0000-0000-0000000000001', 'c1-00000000-0000-0000-0000000000001', 'Tokyo',          35.6762,  139.6503, 'Asia/Tokyo'),
  ('cy-00000000-0000-0000-0000000000002', 'c1-00000000-0000-0000-0000000000002', 'Paris',          48.8566,    2.3522, 'Europe/Paris'),
  ('cy-00000000-0000-0000-0000000000003', 'c1-00000000-0000-0000-0000000000003', 'Sydney',        -33.8688,  151.2093, 'Australia/Sydney'),
  ('cy-00000000-0000-0000-0000000000004', 'c1-00000000-0000-0000-0000000000004', 'Mumbai',         19.0760,   72.8777, 'Asia/Kolkata'),
  ('cy-00000000-0000-0000-0000000000005', 'c1-00000000-0000-0000-0000000000005', 'New York',       40.7128,  -74.0060, 'America/New_York'),
  ('cy-00000000-0000-0000-0000000000006', 'c1-00000000-0000-0000-0000000000006', 'Rome',           41.9028,   12.4964, 'Europe/Rome'),
  ('cy-00000000-0000-0000-0000000000007', 'c1-00000000-0000-0000-0000000000007', 'Dubai',          25.2048,   55.2708, 'Asia/Dubai'),
  ('cy-00000000-0000-0000-0000000000008', 'c1-00000000-0000-0000-0000000000008', 'Rio de Janeiro',-22.9068,  -43.1729, 'America/Sao_Paulo'),
  ('cy-00000000-0000-0000-0000000000009', 'c1-00000000-0000-0000-0000000000009', 'Cusco',         -13.5320,  -71.9675, 'America/Lima'),
  ('cy-00000000-0000-0000-0000000000010', 'c1-00000000-0000-0000-0000000000010', 'Santorini',      36.3932,   25.4615, 'Europe/Athens');

-- Destinations (all featured=true for globe marker display)
INSERT INTO destinations (id, city_id, name, slug, description, latitude, longitude, image_url, featured) VALUES
  ('d1-00000000-0000-0000-0000000000001', 'cy-00000000-0000-0000-0000000000001',
   'Shibuya Crossing', 'shibuya-crossing',
   'The world''s busiest pedestrian crossing — a choreographed ocean of people in the heart of Tokyo. Every time the light turns red, thousands flow from every direction in a mesmerising human dance.',
   35.6595, 139.7004,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Paris_-_Eiffelturm_und_Marsfeld2.jpg/1200px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000002', 'cy-00000000-0000-0000-0000000000002',
   'Eiffel Tower', 'eiffel-tower',
   'The iron lattice tower on the Champ de Mars — an enduring symbol of France and human engineering ingenuity. Built for the 1889 World''s Fair, it remains the most visited paid monument in the world.',
   48.8584, 2.2945,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Paris_-_Eiffelturm_und_Marsfeld2.jpg/1200px-Paris_-_Eiffelturm_und_Marsfeld2.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000003', 'cy-00000000-0000-0000-0000000000003',
   'Sydney Opera House', 'sydney-opera-house',
   'The iconic expressionist masterpiece on Sydney Harbour — one of the 20th century''s greatest buildings. Designed by Danish architect Jørn Utzon, it was completed in 1973 and is a UNESCO World Heritage Site.',
   -33.8568, 151.2153,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2810624939933%29.jpg/1200px-Sydney_Australia._%2810624939933%29.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000004', 'cy-00000000-0000-0000-0000000000004',
   'Gateway of India', 'gateway-of-india',
   'A majestic arch monument overlooking Mumbai harbour, built to commemorate the visit of King George V and Queen Mary to Bombay in 1911. It stands as a proud symbol of India''s colonial history and independence.',
   18.9220, 72.8347,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1200px-Mumbai_03-2016_30_Gateway_of_India.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000005', 'cy-00000000-0000-0000-0000000000005',
   'Times Square', 'times-square',
   'The neon-lit commercial heart of Manhattan — where the world comes to celebrate. A major commercial intersection, tourist destination, and entertainment center in Midtown Manhattan, nicknamed The Crossroads of the World.',
   40.7580, -73.9855,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1200px-New_york_times_square-terabass.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000006', 'cy-00000000-0000-0000-0000000000006',
   'Colosseum', 'colosseum',
   'An oval amphitheatre in Rome''s city centre — the largest ancient amphitheatre ever built and still the largest standing amphitheatre today. Construction began under Emperor Vespasian in 72 AD.',
   41.8902, 12.4922,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1200px-Colosseo_2020.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000007', 'cy-00000000-0000-0000-0000000000007',
   'Burj Khalifa', 'burj-khalifa',
   'The world''s tallest building at 828 metres — a shimmering needle of steel and glass in the Dubai skyline. It took 22 million man-hours to build and holds multiple world records beyond height alone.',
   25.1972, 55.2744,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Burj_Khalifa_building_from_mirador_del_edificio.jpg/800px-Burj_Khalifa_building_from_mirador_del_edificio.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000008', 'cy-00000000-0000-0000-0000000000008',
   'Christ the Redeemer', 'christ-the-redeemer',
   'A colossal Art Deco statue of Jesus Christ atop Corcovado mountain, watching over Rio de Janeiro. Standing 38 metres tall with arms stretched 28 metres wide, it was completed in 1931 and is one of the New Seven Wonders of the World.',
   -22.9519, -43.2105,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/800px-Christ_the_Redeemer_-_Cristo_Redentor.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000009', 'cy-00000000-0000-0000-0000000000009',
   'Machu Picchu', 'machu-picchu',
   'The 15th-century Inca citadel set high in the Andes Mountains of Peru — a Wonder of the World. Built around 1450 CE, it was abandoned during the Spanish conquest and was unknown to the outside world until 1911.',
   -13.1631, -72.5450,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/1200px-Machu_Picchu%2C_Peru.jpg',
   TRUE),

  ('d1-00000000-0000-0000-0000000000010', 'cy-00000000-0000-0000-0000000000010',
   'Santorini Caldera', 'santorini-caldera',
   'Whitewashed villages perched on volcanic cliffs above a sapphire sea — the jewel of the Aegean. The island was shaped by one of the largest volcanic eruptions in recorded history, creating the dramatic caldera visible today.',
   36.4618, 25.3753,
   'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Santorini_island%2C_Oia_01.jpg/1200px-Santorini_island%2C_Oia_01.jpg',
   TRUE);
