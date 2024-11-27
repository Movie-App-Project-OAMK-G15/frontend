CREATE OR REPLACE FUNCTION get_all_subscribers()
RETURNS TABLE (
    user_id INT,
    firstname VARCHAR,
    familyname VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    bio VARCHAR,
    user_photo VARCHAR,
    group_ids INT[]
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
        a.user_photo,
        ARRAY_AGG(gs.group_id) AS group_ids
    FROM 
        account a
    INNER JOIN 
        group_subscriptions gs ON a.email = gs.user_email
    GROUP BY 
        a.user_id, a.firstname, a.familyname, a.email, a.phone, a.bio, a.user_photo;
END;
$$ LANGUAGE plpgsql;
