\echo 'setting up db my_strava'

DROP DATABASE my_strava;
CREATE DATABASE my_strava;
\connect my_strava

CREATE TABLE users(
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  firstname VARCHAR(25),
  lastname VARCHAR(25),
  email TEXT NOT NULL
    CHECK (position ('@' IN email) > 1),
  athlete_id INTEGER UNIQUE
);

CREATE TABLE bikes(
  bike_id SERIAL PRIMARY KEY,
  athlete_id INTEGER REFERENCES users(athlete_id),
  distance INTEGER,
  brand_name TEXT,
  model_name TEXT,
  bike_description VARCHAR(140)
);

CREATE TABLE activities(
  activity_id SERIAL PRIMARY KEY,
  athlete_id INTEGER REFERENCES users(athlete_id),
  start_date DATE,
  type VARCHAR(25),
  distance INTEGER,
  calories NUMERIC,
  moving_time INTEGER,
  description VARCHAR(140)
);

CREATE TABLE goals (
  goal_id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users(username),
  distance INTEGER,
  calories NUMERIC,
  moving_time INTEGER,
  start_date DATE,
  end_date DATE
);