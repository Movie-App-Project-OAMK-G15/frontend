CREATE OR REPLACE FUNCTION populate_test_data() RETURNS JSON AS $$
DECLARE
    admin_user_id INT;
    admin_group_id INT;
    bob_group_id INT;
    jane_group_id INT;
    inserted_data JSON;
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

    -- Insert groups
    INSERT INTO groups (admin_email, group_name, description, photo)
    VALUES 
        ('admin@example.com', 'Admin Group', 'Group managed by the admin user', 'path/to/admin_group_photo.jpg'),
        ('bob@example.com', 'Group for Bob', 'Bobs special group', 'path/to/bob_group_photo.jpg'),
        ('jane@example.com', 'Janes Group', 'Group managed by Jane', 'path/to/jane_group_photo.jpg')
    RETURNING 
        CASE 
            WHEN group_name = 'Admin Group' THEN group_id 
            WHEN group_name = 'Group for Bob' THEN group_id 
            WHEN group_name = 'Jane Group' THEN group_id 
        END
    INTO 
        admin_group_id, bob_group_id, jane_group_id;

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

    -- Build the JSON result
    inserted_data := json_build_object(
        'status', 'success'
    );

    RETURN inserted_data;
END;
$$ LANGUAGE plpgsql;
