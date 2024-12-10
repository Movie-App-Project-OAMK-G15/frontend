-- CREATE OR REPLACE FUNCTION delete_user_and_related_data(input_user_email TEXT) RETURNS VOID AS $$
-- DECLARE
--     user_id_to_delete INT; -- Variable to store the user's ID
-- BEGIN
--     -- Retrieve the user's ID from the account table
--     SELECT user_id INTO user_id_to_delete
--     FROM account
--     WHERE email = input_user_email;

--     -- 1. Delete all reviews written by the user
--     DELETE FROM review WHERE user_email = input_user_email;

--     -- 2. Delete all posts authored by the user
--     DELETE FROM group_posts WHERE user_email = input_user_email;

--     -- 3. Delete all groups where the user is the admin
--     DELETE FROM groups WHERE admin_email = input_user_email;

--     -- 4. Remove the user from group subscriptions
--     DELETE FROM group_subscriptions WHERE user_email = input_user_email;

--     -- 5. Remove any group join requests made by the user
--     DELETE FROM group_requests WHERE user_email = input_user_email;

--     -- 6. Delete all records from favorite_movies table based on the user ID
--     DELETE FROM favorite_movies WHERE user_id = user_id_to_delete;

--     -- 7. Finally, delete the user account
--     DELETE FROM account WHERE email = input_user_email;

-- END;
-- $$ LANGUAGE plpgsql;

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

