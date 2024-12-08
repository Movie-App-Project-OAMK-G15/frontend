-- just a draft version of our db
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS group_posts CASCADE;
DROP TABLE IF EXISTS group_subscriptions CASCADE;
DROP TABLE IF EXISTS group_requests CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS favorite_movies CASCADE;
DROP TABLE IF EXISTS account CASCADE;

-- 1. Create 'account' table
CREATE TABLE account (
    user_id SERIAL PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    familyname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20), -- Can be null
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(255), -- Short bio about the user, optional
    user_photo VARCHAR(255), -- Path to the user's photo file, optional
    email_verif VARCHAR(255), -- Field for storing email verification token
    isConfirmed BOOLEAN DEFAULT false -- Whether the email is confirmed
);

-- 2. Create 'review' table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    review_content TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    movie_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC' + INTERVAL '2 hours'),
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE
);


-- 3. Create 'group' table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    admin_email VARCHAR(100) NOT NULL,
    group_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    photo TEXT NOT NULL, 
    FOREIGN KEY (admin_email) REFERENCES account(email) ON DELETE SET NULL
);

-- 4. Create 'group_subscriptions' table for many-to-many relationship between 'account' and 'group'
CREATE TABLE group_subscriptions (
    group_id SERIAL NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Automatically sets the timestamp when the post is created
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE
);

-- 6. Create 'favorite_movies' table
CREATE TABLE favorite_movies (
    movie_id INT NOT NULL,          
    user_id INT NOT NULL,           
    PRIMARY KEY (movie_id, user_id), 
    FOREIGN KEY (user_id) REFERENCES account(user_id) ON DELETE CASCADE
);

-- 7. Create 'group_requests' table
CREATE TABLE group_requests (
    request_id SERIAL PRIMARY KEY,       -- Unique ID for each request
    user_email VARCHAR(100) NOT NULL,    -- Reference to the user's email
    group_id INT NOT NULL,               -- Reference to the group
    request_time TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC' + INTERVAL '4 hours'),
    FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE, -- Reference to groups
    FOREIGN KEY (user_email) REFERENCES account(email) ON DELETE CASCADE -- Reference to users
);