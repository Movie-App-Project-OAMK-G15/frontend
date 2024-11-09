-- just a draft version of our db
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS group_posts;
DROP TABLE IF EXISTS group_subscriptions;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS account;

-- 1. Create 'account' table
CREATE TABLE account (
    user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    secondname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. Create 'review' table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    review_content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE
);

-- 3. Create 'group' table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    admin_email VARCHAR(100) NOT NULL,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    FOREIGN KEY (admin_email) REFERENCES account(email) ON DELETE SET NULL
);

-- 4. Create 'group_subscriptions' table for many-to-many relationship between 'account' and 'group'
CREATE TABLE group_subscriptions (
    group_id INT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    PRIMARY KEY (group_id, user_email),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE
);

-- 5. Create 'group_posts' table
CREATE TABLE group_posts (
    post_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    group_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255),  -- Optional image field; can be a URL or file path
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE
);

-- 6. Create 'comments' table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES group_posts(post_id) ON DELETE CASCADE
);

CREATE TABLE favorite_movies (
    movie_id INT NOT NULL,          
    user_id INT NOT NULL,           
    PRIMARY KEY (movie_id, user_id), 
    FOREIGN KEY (user_id) REFERENCES account(user_id) ON DELETE CASCADE
);