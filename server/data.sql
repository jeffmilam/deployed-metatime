CREATE DATABASE metatime;
CREATE TABLE todos(
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30),
    progress INT,
    date VARCHAR(300),
    description VARCHAR(5000),
    time_type VARCHAR(255),
    duration TIME,
    repeat_frequency INT,
    repeat_period VARCHAR(255),
    is_due BOOLEAN,
    due_date DATE
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

CREATE TABLE times (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30),
    date VARCHAR(300),
    description VARCHAR(5000)
);