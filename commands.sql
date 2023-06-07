CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES ('Hot Coldman', 'myhotblog.com', 'Peacewalker');

INSERT INTO blogs (author, url, title)
VALUES ('Some Dude', 'myrandomblog.com', 'My Trip To Vegas');