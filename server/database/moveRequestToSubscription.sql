CREATE OR REPLACE FUNCTION move_request_to_subscription(req_id INT)
RETURNS TABLE (
    user_id INT,
    firstname VARCHAR,
    familyname VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    user_photo VARCHAR
) AS $$
BEGIN
    -- Insert user_email and group_id into group_subscriptions
    INSERT INTO group_subscriptions (group_id, user_email)
    SELECT group_id, user_email
    FROM group_requests
    WHERE request_id = req_id;

    -- Return the details of the newly added user
    RETURN QUERY
    SELECT 
        a.user_id,
        a.firstname,
        a.familyname,
        a.email,
        a.phone,
        a.bio,
        a.user_photo
    FROM account a
    WHERE a.email = (
        SELECT user_email
        FROM group_requests
        WHERE request_id = req_id
    );

    -- Delete the corresponding request from group_requests
    DELETE FROM group_requests
    WHERE request_id = req_id;
END;
$$ LANGUAGE plpgsql;
