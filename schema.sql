CREATE TABLE movie(
    id serial  PRIMARY KEY,
    title VARCHAR(255),
    overview text,
    release_date DATE,
    poster_path VARCHAR(255),
    comments  VARCHAR(255)
);