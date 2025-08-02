CREATE TABLE users(id SERIAL PRIMARY KEY, name VARCHAR(32) NOT NULL, email VARCHAR(32) NOT NULL);
INSERT INTO users (name, email) VALUES ('Wyatt', 'wyatt@example.com');
INSERT INTO users (name, email) VALUES ('Billy', 'billy@example.com');