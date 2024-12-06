-- Function to delete a user and all related data
CREATE OR REPLACE FUNCTION delete_user_and_related_data(input_user_email TEXT) RETURNS VOID AS $$
BEGIN
    -- 1. Delete all reviews written by the user
    DELETE FROM review WHERE user_email = input_user_email;

    -- 2. Delete all comments on posts authored by the user
    DELETE FROM comments WHERE post_id IN (
        SELECT post_id FROM group_posts WHERE user_email = input_user_email
    );

    -- 3. Delete all posts authored by the user
    DELETE FROM group_posts WHERE user_email = input_user_email;

    -- 4. Delete all groups where the user is the admin
    DELETE FROM groups WHERE admin_email = input_user_email;

    -- 5. Remove the user from group subscriptions
    DELETE FROM group_subscriptions WHERE user_email = input_user_email;

    -- 6. Remove any group join requests made by the user
    DELETE FROM group_requests WHERE user_email = input_user_email;

    -- 7. Finally, delete the user account
    DELETE FROM account WHERE email = input_user_email;

END;
$$ LANGUAGE plpgsql;
