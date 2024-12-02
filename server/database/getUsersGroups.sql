CREATE OR REPLACE FUNCTION get_user_group_subscriptions(user_email_param VARCHAR)
RETURNS TABLE (
    group_id INT,
    group_name VARCHAR,
    description VARCHAR,
    photo TEXT,
    admin_email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.group_id,
        g.group_name,
        g.description,
        g.photo,
        g.admin_email
    FROM 
        group_subscriptions gs
    JOIN 
        groups g
    ON 
        gs.group_id = g.group_id
    WHERE 
        gs.user_email = user_email_param;
END;
$$ LANGUAGE plpgsql;
