CREATE OR REPLACE FUNCTION get_posts_with_user_info_by_group(p_group_id INT)
RETURNS TABLE (
    post_id INT,
    group_id INT,
    title VARCHAR,
    content TEXT,
    image VARCHAR,
    created_at TIMESTAMP,
    user_id INT,
    firstname VARCHAR,
    familyname VARCHAR,
    email VARCHAR,
    user_photo VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gp.post_id,
        gp.group_id,
        gp.title,
        gp.content,
        gp.image,
        gp.created_at,
        a.user_id,
        a.firstname,
        a.familyname,
        a.email,
        a.user_photo
    FROM 
        group_posts gp
    INNER JOIN 
        account a ON gp.user_email = a.email
    WHERE 
        gp.group_id = p_group_id; -- Use the parameter alias here
END;
$$ LANGUAGE plpgsql;
