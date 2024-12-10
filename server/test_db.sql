-- just a draft version of our db
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS group_posts CASCADE;
DROP TABLE IF EXISTS group_subscriptions CASCADE;
DROP TABLE IF EXISTS group_requests CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS review CASCADE;
DROP TABLE IF EXISTS favorite_movies CASCADE;
DROP FUNCTION IF EXISTS delete_user_and_related_data;
DROP FUNCTION IF EXISTS populate_test_data;
DROP FUNCTION IF EXISTS check_user_data_existence;


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

-- Function to delete a user and all related data
CREATE OR REPLACE FUNCTION delete_user_and_related_data(input_user_email TEXT) RETURNS BOOLEAN AS $$
DECLARE
    user_id_to_delete INT; -- Variable to store the user's ID
    rows_deleted INT; -- Variable to track the number of rows deleted
BEGIN
    -- Retrieve the user's ID from the account table
    SELECT user_id INTO user_id_to_delete
    FROM account
    WHERE email = input_user_email;

    -- Check if the user exists
    IF NOT FOUND THEN
        RETURN FALSE; -- If the user doesn't exist, return FALSE
    END IF;

    -- 1. Delete all reviews written by the user
    DELETE FROM review WHERE user_email = input_user_email;

    -- 2. Delete all posts authored by the user
    DELETE FROM group_posts WHERE user_email = input_user_email;

    -- 3. Delete all groups where the user is the admin
    DELETE FROM groups WHERE admin_email = input_user_email;

    -- 4. Remove the user from group subscriptions
    DELETE FROM group_subscriptions WHERE user_email = input_user_email;

    -- 5. Remove any group join requests made by the user
    DELETE FROM group_requests WHERE user_email = input_user_email;

    -- 6. Delete all records from favorite_movies table based on the user ID
    DELETE FROM favorite_movies WHERE user_id = user_id_to_delete;

    -- 7. Finally, delete the user account and check if a row was deleted
    DELETE FROM account WHERE email = input_user_email RETURNING user_id INTO rows_deleted;

    -- If no rows were deleted, the user didn't exist
    IF rows_deleted = 0 THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE; -- Successfully deleted user and related data
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION populate_test_data() RETURNS VOID AS $$
DECLARE
    admin_user_id INT;
    admin_group_id INT;
    bob_group_id INT;
    jane_group_id INT;
BEGIN
    -- Insert the initial user with isConfirmed = true
    INSERT INTO account (firstname, familyname, email, phone, password, bio, user_photo, email_verif, isConfirmed)
    VALUES 
        ('John', 'Doe', 'admin@example.com', '1234567890', 'hashed_password', 'Admin user bio', NULL, NULL, true)
    RETURNING user_id INTO admin_user_id;

    -- Insert additional users
    INSERT INTO account (firstname, familyname, email, phone, password, bio, user_photo, email_verif, isConfirmed)
    VALUES 
        ('Jane', 'Smith', 'jane@example.com', '9876543210', 'hashed_password', 'Test user bio', NULL, NULL, true),
        ('Bob', 'Johnson', 'bob@example.com', '5556667777', 'hashed_password', 'Another test user bio', NULL, NULL, true);

    -- Insert groups and capture their IDs
    INSERT INTO groups (admin_email, group_name, description, photo)
    VALUES 
        ('admin@example.com', 'Admin Group', 'Group managed by the admin user', 'path/to/admin_group_photo.jpg')
    RETURNING group_id INTO admin_group_id;

    INSERT INTO groups (admin_email, group_name, description, photo)
    VALUES 
        ('bob@example.com', 'Group for Bob', 'Bobs special group', 'path/to/bob_group_photo.jpg')
    RETURNING group_id INTO bob_group_id;

    INSERT INTO groups (admin_email, group_name, description, photo)
    VALUES 
        ('jane@example.com', 'Janes Group', 'Group managed by Jane', 'path/to/jane_group_photo.jpg')
    RETURNING group_id INTO jane_group_id;

    -- Add test user as a subscriber to one group
    INSERT INTO group_subscriptions (group_id, user_email)
    VALUES 
        (bob_group_id, 'admin@example.com');

    -- Add a group join request for the test user
    INSERT INTO group_requests (user_email, group_id, request_time)
    VALUES 
        ('admin@example.com', jane_group_id, DEFAULT);

    -- Add a post in the group where the test user is the admin
    INSERT INTO group_posts (user_email, group_id, title, content, image)
    VALUES 
        ('admin@example.com', admin_group_id, 'Welcome Post', 'This is the first post in the admin group.', NULL);

    -- Add a review from the test user
    INSERT INTO review (user_email, review_content, likes, dislikes, movie_id, rating)
    VALUES 
        ('admin@example.com', 'Great movie! Highly recommend it.', 5, 0, 1, 5);

    -- Add a movie to the test user's favorites
    INSERT INTO favorite_movies (movie_id, user_id)
    VALUES 
        (1, admin_user_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_user_data_existence(input_user_email TEXT) RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN := FALSE; -- Variable to track if any data exists
BEGIN
    -- Check if the user exists in the account table
    SELECT EXISTS(SELECT 1 FROM account WHERE email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in account table
    END IF;

    -- Check if the user has reviews
    SELECT EXISTS(SELECT 1 FROM review WHERE user_email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in review table
    END IF;

    -- Check if the user has posts in group_posts
    SELECT EXISTS(SELECT 1 FROM group_posts WHERE user_email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in group_posts table
    END IF;

    -- Check if the user is an admin of any group
    SELECT EXISTS(SELECT 1 FROM groups WHERE admin_email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in groups table
    END IF;

    -- Check if the user is a member of any group
    SELECT EXISTS(SELECT 1 FROM group_subscriptions WHERE user_email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in group_subscriptions table
    END IF;

    -- Check if the user has any group join requests
    SELECT EXISTS(SELECT 1 FROM group_requests WHERE user_email = input_user_email)
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in group_requests table
    END IF;

    -- Check if the user has favorite movies
    SELECT EXISTS(
        SELECT 1 
        FROM favorite_movies fm
        JOIN account a ON fm.user_id = a.user_id
        WHERE a.email = input_user_email
    )
    INTO user_exists;
    IF user_exists THEN
        RETURN TRUE; -- Data found in favorite_movies table
    END IF;

    -- If no data was found in any table
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

