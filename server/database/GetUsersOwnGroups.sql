CREATE OR REPLACE FUNCTION get_user_own_groups(user_email_param VARCHAR)
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
        groups g
    WHERE 
        g.admin_email = user_email_param;
END;
$$ LANGUAGE plpgsql;
