CREATE OR REPLACE FUNCTION get_group_subscribers(group_id_input INT)
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
    RETURN QUERY
    SELECT 
        a.user_id,
        a.firstname,
        a.familyname,
        a.email,
        a.phone,
        a.bio,
        a.user_photo
    FROM 
        account a
    INNER JOIN 
        group_subscriptions gs ON a.email = gs.user_email
    WHERE 
        gs.group_id = group_id_input;
END;
$$ LANGUAGE plpgsql;
