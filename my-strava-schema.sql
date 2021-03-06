\echo 'setting up db my_strava_test'

DROP DATABASE my_strava_test;
CREATE DATABASE my_strava_test;
\connect my_strava_test

CREATE TABLE users(
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name VARCHAR(25),
  last_name VARCHAR(25),
  email TEXT NOT NULL
    CHECK (position ('@' IN email) > 1),
  athlete_id VARCHAR(20) UNIQUE,
  strava_auth_code VARCHAR(80),
  strava_access_token VARCHAR(80),
  strava_refresh_token VARCHAR(80),
  last_refresh TIMESTAMP
);

CREATE TABLE bikes(
  bike_id VARCHAR(20) PRIMARY KEY,
  athlete_id VARCHAR(20) REFERENCES users(athlete_id),
  distance INTEGER,
  brand_name TEXT,
  model_name TEXT,
  bike_description VARCHAR(140)
);

CREATE TABLE activities(
  activity_id VARCHAR(20) PRIMARY KEY,
  athlete_id VARCHAR(20) REFERENCES users(athlete_id),
  start_date DATE,
  type VARCHAR(15),
  distance NUMERIC(8,1),
  kilojoules NUMERIC(8,1),
  moving_time INTEGER,
  description VARCHAR(140),
  trainer boolean
);

CREATE TABLE goals (
  goal_id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username) NOT NULL,
  distance NUMERIC(8,1),
  kilojoules NUMERIC(8,1),
  moving_time INTEGER,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);