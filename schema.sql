CREATE TABLE IF NOT EXISTS flags (
  country_code TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  image_data BLOB NOT NULL
);